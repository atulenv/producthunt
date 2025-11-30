from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime
import uuid

app = FastAPI(title="Tourist Safety API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (for demo)
users_db = {}
sos_alerts_db = []
risk_zones_db = [
    {
        "id": "zone-theft-1",
        "category": "theft",
        "label": "Janpath Market",
        "latitude": 28.6263,
        "longitude": 77.2177,
        "intensity": 0.85,
        "note": "High pickpocket activity during shopping hours.",
    },
    {
        "id": "zone-theft-2",
        "category": "theft",
        "label": "Old Delhi Railway Station",
        "latitude": 28.6432,
        "longitude": 77.2191,
        "intensity": 0.9,
        "note": "Extremely crowded. Watch bags at all times.",
    },
    {
        "id": "zone-harass-1",
        "category": "harassment",
        "label": "Paharganj Area",
        "latitude": 28.6447,
        "longitude": 77.2124,
        "intensity": 0.65,
        "note": "Backpacker area with persistent touts.",
    },
    {
        "id": "zone-danger-1",
        "category": "danger",
        "label": "GB Road Area",
        "latitude": 28.6489,
        "longitude": 77.2169,
        "intensity": 0.95,
        "note": "Red light district. Avoid after dark.",
    },
]

emergency_contacts = [
    {"id": "police", "label": "Police", "number": "100", "icon": "shield"},
    {"id": "ambulance", "label": "Ambulance", "number": "108", "icon": "medkit"},
    {"id": "women", "label": "Women Helpline", "number": "1091", "icon": "female"},
    {"id": "tourist", "label": "Tourist Helpline", "number": "1363", "icon": "airplane"},
    {"id": "emergency", "label": "Emergency", "number": "112", "icon": "alert"},
    {"id": "fire", "label": "Fire", "number": "101", "icon": "flame"},
]

# Models
class UserProfile(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = None
    nationality: Optional[str] = None
    blood_type: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    hotel_name: Optional[str] = None
    hotel_address: Optional[str] = None

class SOSAlert(BaseModel):
    id: Optional[str] = None
    user_id: str
    latitude: float
    longitude: float
    type: str = "sos"  # sos, silent_sos, fake_call
    timestamp: Optional[str] = None
    status: str = "active"

class RiskZone(BaseModel):
    id: str
    category: str
    label: str
    latitude: float
    longitude: float
    intensity: float
    note: str

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Tourist Safety API"}

@app.get("/api/emergency-contacts")
async def get_emergency_contacts():
    return {"contacts": emergency_contacts}

@app.get("/api/risk-zones")
async def get_risk_zones():
    return {"zones": risk_zones_db}

@app.post("/api/users")
async def create_user(user: UserProfile):
    user_id = str(uuid.uuid4())
    user.id = user_id
    users_db[user_id] = user.dict()
    return {"message": "User created", "user": users_db[user_id]}

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, user: UserProfile):
    if user_id not in users_db:
        users_db[user_id] = {}
    users_db[user_id].update(user.dict(exclude_unset=True))
    users_db[user_id]["id"] = user_id
    return {"message": "User updated", "user": users_db[user_id]}

@app.post("/api/sos")
async def trigger_sos(alert: SOSAlert):
    alert_id = str(uuid.uuid4())
    alert.id = alert_id
    alert.timestamp = datetime.now().isoformat()
    sos_alerts_db.append(alert.dict())
    return {
        "message": "SOS triggered successfully",
        "alert_id": alert_id,
        "emergency_contacts": emergency_contacts[:3],
    }

@app.post("/api/sos/deactivate/{alert_id}")
async def deactivate_sos(alert_id: str):
    for alert in sos_alerts_db:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            return {"message": "SOS deactivated", "alert_id": alert_id}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/api/sos/active")
async def get_active_sos():
    active = [a for a in sos_alerts_db if a["status"] == "active"]
    return {"active_alerts": active}

@app.get("/api/safe-spots")
async def get_safe_spots():
    spots = [
        {
            "id": "1",
            "name": "Connaught Place Police Station",
            "type": "police",
            "address": "Block A, Connaught Place",
            "distance_km": 0.5,
            "notes": "24/7 tourist assistance",
        },
        {
            "id": "2",
            "name": "RML Hospital",
            "type": "hospital",
            "address": "Baba Kharak Singh Marg",
            "distance_km": 1.2,
            "notes": "Emergency ward available",
        },
        {
            "id": "3",
            "name": "Embassy Zone",
            "type": "embassy",
            "address": "Chanakyapuri",
            "distance_km": 4.5,
            "notes": "Multiple embassies",
        },
    ]
    return {"safe_spots": spots}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
