try:
    import speech_recognition as sr
    SPEECH_RECOGNITION_AVAILABLE = True
except ImportError:
    SPEECH_RECOGNITION_AVAILABLE = False
    
import threading
import queue
import logging
from typing import Optional, Callable

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        if not SPEECH_RECOGNITION_AVAILABLE:
            logger.warning("Speech recognition not available - PyAudio not installed")
            self.recognizer = None
            self.microphone = None
            self.is_available = False
            return
            
        try:
            self.recognizer = sr.Recognizer()
            self.microphone = sr.Microphone()
            self.is_listening = False
            self.wake_word = "jarvis"
            self.command_queue = queue.Queue()
            self.listening_thread = None
            self.is_available = True
            
            # Adjust for ambient noise
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                logger.info("Voice service initialized and calibrated for ambient noise")
        except Exception as e:
            logger.error(f"Failed to initialize microphone: {str(e)}")
            self.is_available = False
            self.recognizer = None
            self.microphone = None
    
    def start_listening(self, callback: Callable[[str], None]):
        """
        Start continuous listening for voice commands
        """
        if not self.is_available:
            logger.warning("Voice service not available")
            return
            
        if self.is_listening:
            return
            
        self.is_listening = True
        self.listening_thread = threading.Thread(
            target=self._listen_continuously,
            args=(callback,),
            daemon=True
        )
        self.listening_thread.start()
        logger.info("Started voice recognition")
    
    def stop_listening(self):
        """
        Stop voice recognition
        """
        self.is_listening = False
        if self.listening_thread:
            self.listening_thread.join(timeout=1)
        logger.info("Stopped voice recognition")
    
    def _listen_continuously(self, callback: Callable[[str], None]):
        """
        Continuously listen for voice commands in a separate thread
        """
        while self.is_listening:
            try:
                # Listen for audio with timeout
                with self.microphone as source:
                    # Adjust recognition parameters
                    self.recognizer.energy_threshold = 300
                    self.recognizer.dynamic_energy_threshold = True
                    self.recognizer.pause_threshold = 0.8
                    
                    audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=5)
                
                try:
                    # Use Google's speech recognition
                    text = self.recognizer.recognize_google(audio, language="en-US")
                    logger.info(f"Recognized speech: {text}")
                    
                    # Check for wake word
                    if self.wake_word.lower() in text.lower():
                        # Extract command after wake word
                        command = text.lower().replace(self.wake_word.lower(), "").strip()
                        if command:
                            callback(command)
                        else:
                            callback("listening")  # Acknowledge wake word
                    
                except sr.UnknownValueError:
                    # Speech was unintelligible
                    pass
                except sr.RequestError as e:
                    logger.error(f"Google Speech Recognition error: {e}")
                    
            except sr.WaitTimeoutError:
                # No audio detected, continue listening
                pass
            except Exception as e:
                logger.error(f"Error in voice recognition loop: {str(e)}")
                break
    
    def recognize_speech_from_audio(self, audio_data: bytes) -> Optional[str]:
        """
        Recognize speech from audio data (for direct processing)
        """
        try:
            audio = sr.AudioData(audio_data, 16000, 2)  # Sample rate and width
            text = self.recognizer.recognize_google(audio, language="en-US")
            return text
        except sr.UnknownValueError:
            logger.warning("Could not understand audio")
            return None
        except sr.RequestError as e:
            logger.error(f"Speech recognition request failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Error recognizing speech: {str(e)}")
            return None