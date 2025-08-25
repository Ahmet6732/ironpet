import os
import requests
import json
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class DeepSeekService:
    def __init__(self):
        self.api_key = "sk-b5e42ee619a3491b9b1d5b1146639c53"
        self.base_url = "https://api.deepseek.com/v1"
        self.model = "deepseek-chat"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
    async def chat_completion(self, message: str, conversation_history: List[Dict] = None) -> str:
        """
        Send a message to DeepSeek API and get a response
        """
        try:
            # Prepare conversation context
            messages = []
            
            # Add system message for Jarvis personality
            messages.append({
                "role": "system",
                "content": "You are Jarvis, an intelligent AI assistant like Tony Stark's AI. You are helpful, witty, sophisticated, and can control a virtual avatar character called ironpet. Keep responses concise but engaging. You can understand commands for avatar animations (idle, walk, run, jump, fire, punch, fly) and general questions. Always maintain a professional but friendly tone."
            })
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history[-10:])  # Keep last 10 messages for context
            
            # Add current message
            messages.append({
                "role": "user", 
                "content": message
            })
            
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500,
                "stream": False
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                response_data = response.json()
                if "choices" in response_data and len(response_data["choices"]) > 0:
                    return response_data["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Unexpected response format: {response_data}")
                    return "I apologize, but I encountered an issue processing your request."
            else:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return f"I'm sorry, I'm having trouble connecting to my AI brain right now. Error: {response.status_code}"
                
        except requests.exceptions.Timeout:
            logger.error("DeepSeek API timeout")
            return "I apologize for the delay. My response time is a bit slow right now."
        except requests.exceptions.RequestException as e:
            logger.error(f"DeepSeek API request error: {str(e)}")
            # Fallback responses for common queries
            return self._get_fallback_response(message)
        except Exception as e:
            logger.error(f"Unexpected error in DeepSeek service: {str(e)}")
            return "I encountered an unexpected error. Please try rephrasing your question."
    
    def _get_fallback_response(self, message: str) -> str:
        """
        Provide fallback responses when DeepSeek API is unavailable
        """
        message_lower = message.lower()
        
        # Common greetings and questions
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
            return "Hello! I'm Jarvis, your AI assistant. I can control the ironpet avatar and answer your questions. Try asking me to 'walk', 'fly', or 'fire'!"
        
        if any(word in message_lower for word in ['how are you', 'how do you feel']):
            return "I'm functioning optimally, thank you for asking! My systems are online and ready to assist you."
        
        if any(word in message_lower for word in ['what can you do', 'help', 'capabilities']):
            return "I can control the ironpet avatar with commands like walk, run, fly, jump, fire, and punch. I can also answer questions and have conversations. What would you like me to do?"
        
        if any(word in message_lower for word in ['weather', 'time', 'date']):
            return "I currently don't have access to real-time data like weather or time. But I can control your avatar and chat with you!"
        
        # Animation responses
        animations = ['walk', 'run', 'fly', 'jump', 'fire', 'punch', 'idle']
        for anim in animations:
            if anim in message_lower:
                return f"Executing {anim} animation for the ironpet avatar!"
        
        # Default response
        return "I'm currently running in offline mode. I can still control the ironpet avatar and provide basic responses. Try commands like 'walk', 'fly', or ask me simple questions!"
    
    def extract_animation_command(self, message: str) -> Optional[str]:
        """
        Extract animation commands from user message
        """
        message_lower = message.lower()
        
        # Animation command mapping
        animation_keywords = {
            'idle': ['idle', 'stop', 'rest', 'still'],
            'walk': ['walk', 'move', 'go'],
            'run': ['run', 'fast', 'sprint', 'hurry'],
            'jump': ['jump', 'leap', 'hop'],
            'fire': ['fire', 'shoot', 'attack', 'blast'],
            'punch': ['punch', 'hit', 'strike', 'fight'],
            'fly': ['fly', 'hover', 'float', 'soar'],
            'fly_fire': ['fly fire', 'flying fire', 'aerial attack'],
            'fly_groundfire': ['ground fire', 'fly groundfire', 'aerial ground attack'],
            'fly_speedup': ['fly fast', 'speed up', 'fly speedup', 'fast fly'],
            'fly_downhill': ['fly down', 'downward', 'descend']
        }
        
        for animation, keywords in animation_keywords.items():
            for keyword in keywords:
                if keyword in message_lower:
                    return animation
        
        return None
    
    async def process_command(self, message: str, conversation_history: List[Dict] = None) -> Dict:
        """
        Process a command and return appropriate response with action
        """
        # Check for animation commands first
        animation_command = self.extract_animation_command(message)
        
        if animation_command:
            return {
                "action": "animation",
                "animation": animation_command,
                "response": f"Executing {animation_command} animation."
            }
        
        # If no animation command, send to AI for general response
        ai_response = await self.chat_completion(message, conversation_history)
        
        return {
            "action": "response",
            "response": ai_response
        }