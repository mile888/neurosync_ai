// NS-009: Loading states and error handling in React
import React, { useState } from "react";
import { apiClient, PredictionResponse } from "../api/client";

export const AIPredictor: React.FC = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulated valid token matching backend auth.py logic
      const response = await apiClient.predict({ text }, "valid-secret-token-2026");
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">AI Text Analyzer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={4}
          placeholder="Enter text to analyze (e.g., 'This is a great product')..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Text"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && !isLoading && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md animate-fade-in">
          <p className="font-semibold text-green-800">Prediction: {result.prediction}</p>
          <p className="text-sm text-green-700 mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-3 border-t border-green-200 pt-2">
            Model Version: {result.model_version}
          </p>
        </div>
      )}
    </div>
  );
};