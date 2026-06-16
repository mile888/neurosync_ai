// NS-005: Typed API Client for FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface PredictionRequest {
  text: string;
}

export interface PredictionResponse {
  text: string;
  prediction: string;
  confidence: number;
  model_version: string;
}

export const apiClient = {
  async predict(data: PredictionRequest, token: string): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to get prediction from server");
    }

    return response.json();
  },
};