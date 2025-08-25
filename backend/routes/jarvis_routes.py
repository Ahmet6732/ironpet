from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.deepseek_service import DeepSeekService
from services.voice_service import VoiceService

logger = logging.getLogger(__name__)

jarvis_router = APIRouter(prefix="/jarvis", tags=["jarvis"])

# Initialize services
deepseek_service = DeepSeekService()
voice_service = VoiceService()

# Conversation storage (in production, use Redis or database)
conversation_sessions = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class VoiceCommandRequest(BaseModel):
    transcript: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    action: Optional[str] = None
    animation: Optional[str] = None

@jarvis_router.post("/chat", response_model=ChatResponse)
async def chat_with_jarvis(request: ChatRequest):
    """
    Chat with Jarvis AI assistant
    """
    try:
        # Get or create conversation history
        session_id = request.session_id
        if session_id not in conversation_sessions:
            conversation_sessions[session_id] = []
        
        conversation_history = conversation_sessions[session_id]
        
        # Process the command/message
        result = await deepseek_service.process_command(request.message, conversation_history)
        
        # Update conversation history
        conversation_history.extend([
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": result["response"]}
        ])
        
        # Keep only last 20 messages to manage memory
        if len(conversation_history) > 20:
            conversation_history = conversation_history[-20:]
        
        conversation_sessions[session_id] = conversation_history
        
        response = ChatResponse(
            response=result["response"],
            action=result.get("action"),
            animation=result.get("animation")
        )
        
        logger.info(f"Chat response sent: {response.response[:100]}...")
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process chat request: {str(e)}")

@jarvis_router.post("/voice-command", response_model=ChatResponse)
async def process_voice_command(request: VoiceCommandRequest):
    """
    Process voice command transcript
    """
    try:
        # Get or create conversation history
        session_id = request.session_id
        if session_id not in conversation_sessions:
            conversation_sessions[session_id] = []
        
        conversation_history = conversation_sessions[session_id]
        
        # Process the voice command
        result = await deepseek_service.process_command(request.transcript, conversation_history)
        
        # Update conversation history
        conversation_history.extend([
            {"role": "user", "content": f"[Voice] {request.transcript}"},
            {"role": "assistant", "content": result["response"]}
        ])
        
        # Keep only last 20 messages
        if len(conversation_history) > 20:
            conversation_history = conversation_history[-20:]
        
        conversation_sessions[session_id] = conversation_history
        
        response = ChatResponse(
            response=result["response"],
            action=result.get("action"),
            animation=result.get("animation")
        )
        
        logger.info(f"Voice command processed: {request.transcript} -> {response.response[:50]}...")
        return response
        
    except Exception as e:
        logger.error(f"Error in voice command endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process voice command: {str(e)}")

@jarvis_router.get("/conversation/{session_id}")
async def get_conversation_history(session_id: str):
    """
    Get conversation history for a session
    """
    try:
        history = conversation_sessions.get(session_id, [])
        return {"session_id": session_id, "messages": history}
    except Exception as e:
        logger.error(f"Error retrieving conversation history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve conversation history")

@jarvis_router.delete("/conversation/{session_id}")
async def clear_conversation_history(session_id: str):
    """
    Clear conversation history for a session
    """
    try:
        if session_id in conversation_sessions:
            del conversation_sessions[session_id]
        return {"message": f"Conversation history cleared for session {session_id}"}
    except Exception as e:
        logger.error(f"Error clearing conversation history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to clear conversation history")

@jarvis_router.get("/status")
async def get_jarvis_status():
    """
    Get Jarvis system status
    """
    try:
        return {
            "status": "online",
            "model": deepseek_service.model,
            "active_sessions": len(conversation_sessions),
            "voice_recognition": "available" if voice_service else "unavailable"
        }
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get status")