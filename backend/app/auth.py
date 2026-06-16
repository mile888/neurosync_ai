from fastapi import Header, HTTPException
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    NS-008: JWT Authentication Middleware (Simulated)
    Validates the Bearer token before allowing access to protected routes.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization token")
    
    token = authorization.split(" ")[1]
    
    # Simulated token validation (In production, decode JWT and verify signature)
    if token == "valid-secret-token-2026":
        return {"username": "dev_user", "role": "admin"}
    
    raise HTTPException(status_code=401, detail="Invalid or expired token")