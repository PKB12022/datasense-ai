import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from supabase import create_client, Client
from app.core.config import settings
import uuid

router = APIRouter()

# Initialize Supabase client for storage
# Note: For production, consider using dependency injection to pass this
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

ALLOWED_EXTENSIONS = {".csv", ".xlsx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported.")
    
    # Read file content
    contents = await file.read()
    
    # Validate file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")
    
    # Generate a unique filename to prevent collisions
    unique_filename = f"{uuid.uuid4()}{ext}"
    
    try:
        # Upload to Supabase Storage in the 'datasets' bucket
        # Ensure the bucket 'datasets' exists in your Supabase project!
        response = supabase.storage.from_("datasets").upload(
            path=unique_filename,
            file=contents,
            file_options={"content-type": file.content_type}
        )
        
        # In a real scenario, we would also extract the user ID from the JWT token
        # and save a record to the PostgreSQL `datasets` table here.
        
        # Get public URL (if bucket is public) or signed URL (if private)
        file_url = supabase.storage.from_("datasets").get_public_url(unique_filename)
        
        return {
            "status": "success",
            "filename": file.filename,
            "unique_filename": unique_filename,
            "size_bytes": len(contents),
            "url": file_url
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file to storage: {str(e)}")
