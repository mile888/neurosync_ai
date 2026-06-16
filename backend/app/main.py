import sys
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add parent directory to path to import ai_model
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_model.inference import model_instance
from app.models import PredictionRequest, PredictionResponse
from app.auth import get_current_user

app = FastAPI(title="NeuroSync AI API", version="1.0.0")

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Default Vite port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Pre-load the AI model into memory when the server starts."""
    model_instance.load_model()

@app.post("/api/v1/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest, user: dict = Depends(get_current_user)):
    """
    NS-004: Prediction endpoint protected by NS-008 auth middleware.
    """
    try:
        result = model_instance.predict(request.text)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")