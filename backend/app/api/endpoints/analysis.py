from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from app.core.config import settings
from app.services.analysis_service import DataAnalysisService
from app.services.insight_engine import InsightEngine
from app.services.ai_service import AIService
from app.services.pdf_service import PDFService
import traceback
import uuid

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class AnalysisRequest(BaseModel):
    unique_filename: str
    original_filename: str

@router.post("/run")
async def run_analysis(request: AnalysisRequest):
    try:
        # 1. Download file from Supabase Storage
        res = supabase.storage.from_("datasets").download(request.unique_filename)
        
        # 2. Run the Pandas Analysis Pipeline
        analyzer = DataAnalysisService(file_content=res, filename=request.original_filename)
        analysis_results = analyzer.run_full_analysis()
        analysis_results["visuals"] = analyzer.generate_visualizations()
        
        # Run the Deterministic Insight Engine
        engine = InsightEngine(df=analyzer.df, analysis_results=analysis_results)
        engine_insights = engine.run()
        analysis_results["engine_insights"] = engine_insights
        
        # 3. Generate Natural Language Insights using AI API
        ai_insights = AIService.generate_insights(analysis_results)
        
        # 4. Include AI insights into the final payload
        analysis_results["ai_insights"] = ai_insights
        
        # 5. Generate PDF Report
        pdf_bytes = PDFService.generate_report(analysis_results, request.original_filename)
        
        # Upload PDF to Supabase Storage
        # We will use the existing 'datasets' bucket so the user doesn't need to create a new one
        pdf_filename = f"report_{uuid.uuid4()}.pdf"
        supabase.storage.from_("datasets").upload(
            path=pdf_filename,
            file=pdf_bytes,
            file_options={"content-type": "application/pdf"}
        )
        pdf_url = supabase.storage.from_("datasets").get_public_url(pdf_filename)
        
        # 7. In a real app, save these results to PostgreSQL here.
        
        # Filter out raw image bytes before sending to frontend
        frontend_results = {k: v for k, v in analysis_results.items() if k != 'visuals'}
        
        return {
            "status": "success",
            "filename": request.original_filename,
            "pdf_url": pdf_url,
            "results": frontend_results
        }
        
    except Exception as e:
        error_msg = f"Analysis failed: {str(e)}\n{traceback.format_exc()}"
        print(error_msg) # Log to console
        raise HTTPException(status_code=500, detail=f"Failed to analyze dataset. Ensure the file is a valid CSV/XLSX.")

class ChatRequest(BaseModel):
    messages: list
    context_data: dict

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        reply = AIService.chat_with_data(request.messages, request.context_data)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
