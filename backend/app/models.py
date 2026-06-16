from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text to analyze")

class PredictionResponse(BaseModel):
    text: str
    prediction: str
    confidence: float
    model_version: str