# Jarvis Avatar Assistant - API Contracts & Integration Plan

## API Contracts

### 1. Jarvis Chat Endpoint
```
POST /api/jarvis/chat
Request Body: { message: string }
Response: { response: string, confidence?: number }
```

### 2. Voice Command Processing
```
POST /api/jarvis/voice-command
Request Body: { transcript: string, context?: object }
Response: { 
  action: string, // 'animation' | 'response' | 'system'
  data: object,
  response?: string 
}
```

### 3. System Commands (Future)
```
POST /api/jarvis/system
Request Body: { command: string, parameters?: object }
Response: { success: boolean, result: string }
```

## Mock Data Integration Points

### Frontend Mock Data (to be replaced):
1. **mockSprites.js**: Placeholder sprite URLs will be replaced with actual ironpet PNG files
2. **Voice Recognition**: Currently using Web Speech API, will integrate with backend processing
3. **AI Responses**: Mock responses will be replaced with DeepSeek API integration

### Backend Implementation Plan:

1. **DeepSeek API Integration**:
   - API Key: sk-b5e42ee619a3491b9b1d5b1146639c53
   - Model: deepseek-chat or deepseek-coder
   - Context management for conversation history
   - Turkish/English language support

2. **Speech Processing**:
   - Integration with faster-whisper for offline STT
   - Wake word detection ("Jarvis")
   - Command interpretation and routing

3. **Animation Control**:
   - Map voice commands to avatar animations
   - Handle animation state transitions
   - Position and movement coordination

## Frontend & Backend Integration Strategy:

### Phase 1: Core AI Integration
- Replace mock chat responses with DeepSeek API
- Implement conversation context management
- Add error handling and fallbacks

### Phase 2: Enhanced Voice Processing  
- Backend speech-to-text processing
- Improved command recognition
- Multi-language support (Turkish/English)

### Phase 3: System Integration
- File system commands
- Application launching
- Web search integration

### Phase 4: Advanced Features
- Text-to-speech response
- Offline functionality
- Custom wake word training

## Data Flow:
1. Frontend captures voice input
2. Backend processes with faster-whisper
3. DeepSeek API generates response
4. Frontend updates avatar animation
5. Optional TTS playback of response

## File Structure Updates Needed:
- Replace placeholder sprites with actual ironpet PNGs
- Update sprite paths in mockSprites.js
- Configure proper animation timings
- Implement sprite preloading for smooth animations