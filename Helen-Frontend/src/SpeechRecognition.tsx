import React, { useState, useEffect, useRef } from 'react';

let recognition: any = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 10;
}

const SpeechRecognition = ({ onSpeechRecognized }: { onSpeechRecognized: (text: string) => void }) => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility

  const accumulatedTextRef = useRef<string>('');
  const recognitionActive = useRef<boolean>(false); // Track if recognition is active

  useEffect(() => {
    if (!recognition) {
      console.log('Speech recognition not supported');
      return;
    }

    recognition.onresult = (event: any) => {
      const speechToText = event.results[event.resultIndex][0].transcript;
      setInterimText(speechToText);

      if (event.results[event.resultIndex].isFinal) {
        accumulatedTextRef.current += ` ${speechToText}`;
        setSpokenText(accumulatedTextRef.current); // Update spoken text with the final result
        setShowModal(false); // Hide modal when speech recognition is finished
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setListening(false);
      recognitionActive.current = false; // Reset state on error
    };

    // Listen for 'F' key press and release
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !recognitionActive.current) {
        recognition.start();
        recognitionActive.current = true;
        setListening(true);
        setInterimText('');
        accumulatedTextRef.current = '';
        setSpokenText('');
        setShowModal(true); // Show the modal when speaking
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && recognitionActive.current) {
        recognition.stop();
        recognitionActive.current = false;
        setListening(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      recognition.stop(); // Clean up recognition on component unmount
    };
  }, [recognition]);

  // Trigger callback to parent when `spokenText` is updated
  useEffect(() => {
    if (spokenText.trim()) {
     
      onSpeechRecognized(spokenText);
    }
  }, [spokenText, onSpeechRecognized]);

  return (
    <div>
      {/* {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{listening ? 'Listening...' : 'Click & Hold to Speak'}</h3>
            <p>{interimText}</p> 
          </div>
        </div>
      )}
      <p><strong>Full Spoken Text:</strong></p>
      <p>{spokenText}</p> 
      {listening && <p>Release 'F' to stop...</p>} */}
    </div>
  );
};

export default SpeechRecognition;
