import axios from "axios"
import { CoachingOptions } from "./Options";

// Gemini API integration for AI functionality
export const AIModel = async (topic, coachingOption, lastTwoConversation) => {
    const option = CoachingOptions.find((item) => item.name == coachingOption);
    const PROMPT = (option.prompt).replace('{user_topic}', topic);

    const response = await axios.post('/api/gemini', {
        messages: [
            { role: 'system', content: PROMPT },
            ...lastTwoConversation
        ],
    });

    return response.data.message;
}

export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation) => {
    const option = CoachingOptions.find((item) => item.name == coachingOption);
    const PROMPT = option.summeryPrompt;

    const response = await axios.post('/api/gemini', {
        messages: [
            ...conversation,
            { role: 'system', content: PROMPT },
        ],
    });

    return response.data.message;
}

// Deepgram TTS using REST API for better reliability
export const ConvertTextToSpeech = async (text, expertName) => {
    return new Promise((resolve, reject) => {
        if (!text || text.trim().length === 0) {
            resolve('No text to speak');
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
        if (!apiKey) {
            reject(new Error('Deepgram API key not found'));
            return;
        }

        // Map expert names to Deepgram voices
        const voiceMap = {
            // old names (for compatibility)
            'Matthew': 'aura-helios-en',
            'Joanna': 'aura-luna-en', 
            // new names
            'Ethan': 'aura-helios-en',
            'Sofia': 'aura-luna-en',
            'Justin': 'aura-zeus-en',
            'Amy': 'aura-stella-en',
            'Brian': 'aura-zeus-en',
            'default': 'aura-asteria-en'
        };

        const voice = voiceMap[expertName] || voiceMap.default;
        
        // Use Deepgram REST API for TTS
        fetch(`https://api.deepgram.com/v1/speak?model=${voice}&encoding=linear16&sample_rate=24000`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(audioData => {
            // Create and play audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            audioContext.decodeAudioData(audioData)
                .then(audioBuffer => {
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    
                    source.onended = () => {
                        resolve('TTS completed');
                    };
                    
                    source.start(0);
                })
                .catch(decodeError => {
                    console.error('Audio decode error:', decodeError);
                    reject(decodeError);
                });
        })
        .catch(fetchError => {
            console.error('TTS fetch error:', fetchError);
            reject(fetchError);
        });
    });
};

// Deepgram STT streaming service
export class DeepgramSTTService {
    constructor() {
        this.socket = null;
        this.mediaStream = null;
        this.audioContext = null;
        this.processor = null;
        this.isListening = false;
        this.onTranscript = null;
        this.onFinalTranscript = null;
        this.onError = null;
        
        // Speech completion detection
        this.speechBuffer = '';
        this.silenceTimer = null;
        this.speechTimeout = 1500; // 1.5 seconds of silence before sending
        this.lastSpeechTime = Date.now();
    }

    async initialize() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Media devices not supported');
        }

        this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                sampleRate: 16000,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000
        });

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    start() {
        if (this.isListening) return;
        
        const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || 'deepgram_api_key';
        
        this.socket = new WebSocket(
            `wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true&smart_format=true`,
            ['token', apiKey]
        );

        this.socket.onopen = () => {
            console.log('Deepgram STT connected');
            this.startAudioStream();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.channel && data.channel.alternatives && data.channel.alternatives[0]) {
                const alternative = data.channel.alternatives[0];
                const transcript = alternative.transcript;
                
                if (transcript && transcript.trim() !== '') {
                    // Update last speech time
                    this.lastSpeechTime = Date.now();
                    
                    // Show interim transcript
                    if (this.onTranscript) {
                        this.onTranscript(transcript);
                    }
                    
                    // Handle final transcript
                    if (data.is_final) {
                        this.speechBuffer += transcript + ' ';
                        this.resetSilenceTimer();
                    }
                }
            }
        };

        this.socket.onerror = (error) => {
            console.error('Deepgram STT error:', error);
            if (this.onError) {
                this.onError(error);
            }
        };

        this.socket.onclose = () => {
            console.log('Deepgram STT disconnected');
            this.isListening = false;
        };

        this.isListening = true;
    }

    startAudioStream() {
        if (!this.mediaStream || !this.audioContext) return;

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        
        // Create a ScriptProcessor to capture audio data
        this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
        
        this.processor.onaudioprocess = (event) => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const inputData = event.inputBuffer.getChannelData(0);
                
                // Convert float32 to int16
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
                }
                
                this.socket.send(pcmData.buffer);
            }
        };

        source.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
    }

    resetSilenceTimer() {
        // Clear existing timer
        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
        }
        
        // Set new timer for speech completion detection
        this.silenceTimer = setTimeout(() => {
            if (this.speechBuffer.trim() && this.onFinalTranscript) {
                console.log('Speech completed after silence, sending:', this.speechBuffer.trim());
                this.onFinalTranscript(this.speechBuffer.trim());
                this.speechBuffer = ''; // Clear buffer after sending
            }
        }, this.speechTimeout);
    }

    stop() {
        this.isListening = false;
        
        // Clear silence timer
        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
        }
        
        // Send any remaining speech before stopping
        if (this.speechBuffer.trim() && this.onFinalTranscript) {
            this.onFinalTranscript(this.speechBuffer.trim());
            this.speechBuffer = '';
        }
        
        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }
        
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
        
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }

    setOnTranscript(callback) {
        this.onTranscript = callback;
    }

    setOnFinalTranscript(callback) {
        this.onFinalTranscript = callback;
    }

    setOnError(callback) {
        this.onError = callback;
    }
}
