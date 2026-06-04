from openai import OpenAI
from app.core.config import settings
import json
from typing import Dict, Any

class AIService:
    @staticmethod
    def get_client():
        if settings.ACTIVE_AI_PROVIDER.upper() == "NVIDIA":
            return OpenAI(
                api_key=settings.NVIDIA_API_KEY,
                base_url="https://integrate.api.nvidia.com/v1"
            )
        else:
            return OpenAI(
                api_key=settings.GEMINI_API_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )

    @staticmethod
    def generate_insights(analysis_results: Dict[str, Any]) -> str:
        safe_results = {k: v for k, v in analysis_results.items() if k != 'visuals'}
        context_data = json.dumps(safe_results, indent=2)
        
        mode = analysis_results.get('analysis_mode', {}).get('mode', 'Business Intelligence')
        requires_ml = analysis_results.get('analysis_mode', {}).get('requires_ml', False)
        
        ml_prompt = """
# Page 5: ML Strategy
Write 4 sub-sections:
## Recommended Models
(List models and EXPLAIN WHY they were chosen)
## Target Selection
(State the detected target variable and EXPLAIN WHY it is a good target)
## Ranked Predictive Drivers
(Explain WHICH features drive the target variable and explain the BUSINESS MECHANISM behind why they are predictive. Do not just recite statistics.)
## Training Considerations
(Explain what needs to be done before training)
""" if requires_ml else ""
        
        prompt = f"""
You are a Senior Data Analyst and Senior Data Scientist. 
The Python engine has classified this dataset as: {mode}. 
Generate a highly specific, consultant-grade business report.

## CALIBRATED CONFIDENCE & TONALITY
You must strictly separate Facts, Interpretations, and Speculation. This is critical to prevent hallucinations.
1. FACTS: State data points objectively without adjectives (e.g., "Retention is 42%").
2. INTERPRETATION: Use phrase indicators when interpreting a fact (e.g., "This suggests...", "This indicates...").
3. SPECULATION: If proposing a reason not found in the data, you MUST flag it as a hypothesis (e.g., "A potential hypothesis for this is...", "This could optionally be driven by...").
4. AVOID ABSOLUTES: Never say "This proves", "This will cause", or "This means". Use "This correlates with", "This suggests", or "This implies".

## BANNED BEHAVIORS
- Do not use generic phrases ("The dataset is clean", "Collect more data", "Build predictive models").
- Do not just recite statistics (e.g., BANNED: "North = 26.7% and South = 22.6%").
- You MUST interpret the statistics (e.g., REQUIRED: "North outperforms South by 18%, suggesting stronger market penetration or sales execution.").

## REPORT STRUCTURE
You must follow this exact markdown structure:

# Page 1: Executive Takeaway
(Write exactly 2 to 3 sentences summarizing the absolute most important strategic takeaway for a C-Level Executive reading this dataset.)

# Page 3: Key Insights & Patterns
Write 2 sub-sections:
## Top 5 Key Insights
(5 bullet points. Interpret the numbers and explain WHAT THEY MEAN to the business.)
## Trends
(Identify temporal or numerical trends and interpret them)

# Page 4: Risks & Opportunities
Write 2 sub-sections:
## Risks
(Identify anomalies, bottom categories, or sparse data risks)
## Opportunities
(Actionable business opportunities based on the insights)
{ml_prompt}
# Page 6: Recommendations & Next Steps
Write 3 highly specific recommendations. YOU MUST STRICTLY USE THIS FORMAT FOR EACH:
**Finding (Fact):** [The objective numerical fact from the data]
**Interpretation:** [What this suggests about the business]
**Recommendation:** [What the business should do]
**Business Impact:** [The strategic financial or operational outcome]

## INPUT DATA
{context_data}
"""
        try:
            client = AIService.get_client()
            import time
            max_retries = 3
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    response = client.chat.completions.create(
                        model=settings.AI_MODEL_NAME,
                        messages=[{"role": "user", "content": prompt}],
                    )
                    return response.choices[0].message.content
                except Exception as e:
                    last_error = str(e)
                    if ("503" in last_error or "429" in last_error) and attempt < max_retries - 1:
                        time.sleep(3 * (attempt + 1))
                        continue
            return f"Failed to generate AI insights due to an error: {last_error}"
        except Exception as e:
            return f"Failed to generate AI insights due to an error: {str(e)}"

    @staticmethod
    def chat_with_data(messages: list, context_data: Dict[str, Any]) -> str:
        safe_results = {k: v for k, v in context_data.items() if k != 'visuals' and k != 'ai_insights'}
        context_str = json.dumps(safe_results, indent=2)
        
        system_prompt = {
            "role": "system",
            "content": f"You are a Senior Data Analyst assisting a user. Use the following statistical summary to answer their questions specifically and numerically.\n\nDATASET SUMMARY:\n{context_str}"
        }
        
        full_messages = [system_prompt] + messages
        try:
            client = AIService.get_client()
            response = client.chat.completions.create(
                model=settings.AI_MODEL_NAME,
                messages=full_messages,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error connecting to AI: {str(e)}"
