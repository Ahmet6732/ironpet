import React, { useState, useEffect, useRef, useCallback } from 'react';
import { mockSprites, animationConfig } from '../data/mockSprites';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2,
  Settings,
  MessageCircle,
  Move,
  Zap
} from 'lucide-react';

const Avatar = () => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [position, setPosition] = useState({ x: 400, y: 300 });
  const [isListening, setIsListening] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showChatInput, setShowChatInput] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const animationTimerRef = useRef(null);
  const movementTimerRef = useRef(null);
  const avatarRef = useRef(null);

  // Animation loop
  useEffect(() => {
    const config = animationConfig[currentAnimation];
    if (!config) return;

    animationTimerRef.current = setInterval(() => {
      setCurrentFrame(prevFrame => {
        const nextFrame = prevFrame + 1;
        if (nextFrame >= config.frames) {
          if (config.loop) {
            return 0;
          } else {
            // Single-play animation complete, return to idle
            setTimeout(() => setCurrentAnimation('idle'), 100);
            return prevFrame;
          }
        }
        return nextFrame;
      });
    }, config.speed);

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [currentAnimation]);

  // Movement logic for walk/run animations
  useEffect(() => {
    if (currentAnimation === 'walk' || currentAnimation === 'run') {
      const speed = currentAnimation === 'run' ? 3 : 1.5;
      setIsMoving(true);
      
      movementTimerRef.current = setInterval(() => {
        setPosition(prev => {
          const newX = prev.x + speed;
          // Bounce back when hitting screen edge
          if (newX > window.innerWidth - 120) {
            setCurrentAnimation('idle');
            return { ...prev, x: window.innerWidth - 120 };
          }
          return { ...prev, x: newX };
        });
      }, 50);
    } else {
      setIsMoving(false);
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
      }
    }

    return () => {
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
      }
    };
  }, [currentAnimation]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      const rect = avatarRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 120, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const executeAnimation = (animationType) => {
    if (animationType !== currentAnimation) {
      setCurrentAnimation(animationType);
      setCurrentFrame(0);
    }
  };

  const handleVoiceCommand = async (command) => {
    setIsThinking(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jarvis/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: command,
          session_id: 'main_session'
        })
      });
      
      const data = await response.json();
      
      // Handle animation commands
      if (data.action === 'animation' && data.animation) {
        executeAnimation(data.animation);
      }
      
      // Show AI response
      if (data.response) {
        setCurrentResponse(data.response);
        setShowSpeechBubble(true);
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
          setShowSpeechBubble(false);
          setCurrentResponse('');
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error communicating with Jarvis:', error);
      setCurrentResponse('Sorry, I had trouble processing that command.');
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 3000);
    }
    
    setIsThinking(false);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const message = chatMessage;
    setChatMessage('');
    await handleVoiceCommand(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };
    setIsListening(true);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Voice command received:', transcript);
        
        if (transcript.toLowerCase().includes('jarvis')) {
          const command = transcript.toLowerCase().replace('jarvis', '').trim();
          if (command) {
            handleVoiceCommand(command);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Restart if still listening
        }
      };
      
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const currentSprite = mockSprites[currentAnimation] ? 
    mockSprites[currentAnimation][currentFrame] : mockSprites.idle[0];

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>
      
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 p-4 bg-black/80 border-purple-500/30 backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Stop' : 'Listen'}
            </Button>
            
            {isThinking && (
              <div className="flex items-center gap-2 text-purple-400">
                <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            Say "Jarvis" + command
          </div>
        </div>
      </Card>

      {/* Animation Controls */}
      <Card className="absolute top-4 right-4 p-4 bg-black/80 border-purple-500/30 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(mockSprites).map((animation) => (
            <Button
              key={animation}
              onClick={() => executeAnimation(animation)}
              variant={currentAnimation === animation ? "default" : "outline"}
              size="sm"
              className="text-xs capitalize"
            >
              {animation.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </Card>

      {/* Avatar */}
      <div
        ref={avatarRef}
        className="absolute cursor-move select-none transition-all duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
          filter: isThinking ? 'brightness(1.3) drop-shadow(0 0 20px rgba(147, 51, 234, 0.7))' : 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <img
          src={currentSprite}
          alt={`ironpet ${currentAnimation} ${currentFrame}`}
          className="w-24 h-24 pixelated drop-shadow-lg"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Speech Bubble */}
        {showSpeechBubble && currentResponse && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 max-w-xs">
            <div className="bg-white rounded-lg p-3 shadow-lg border border-gray-200 relative animate-fade-in">
              <p className="text-sm text-gray-800">{currentResponse}</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div className="absolute bottom-4 left-4">
        <Card className="p-3 bg-black/80 border-purple-500/30 backdrop-blur-sm">
          <div className="text-sm text-gray-300">
            <div>Animation: <span className="text-purple-400">{currentAnimation}</span></div>
            <div>Frame: <span className="text-purple-400">{currentFrame + 1}</span></div>
            <div>Position: <span className="text-purple-400">{Math.round(position.x)}, {Math.round(position.y)}</span></div>
            <div>Status: <span className="text-purple-400">{isListening ? 'Listening...' : 'Ready'}</span></div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        
        .pixelated {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default Avatar;