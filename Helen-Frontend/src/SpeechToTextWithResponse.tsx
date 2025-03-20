import React, { useState, useEffect } from 'react';
import SpeechRecognition from './SpeechRecognition';
import TextToSpeech from './TextToSpeech';

const SpeechToTextWithResponse = () => {
  const [spokenText, setSpokenText] = useState('');
  
  const [responseText, setResponseText] = useState('');

  // Handle user input text to determine response
  const generateResponse = (input: string) => {
    let response = '';

    // Simple logic based on spoken input
    if (input.toLowerCase().includes('hi')) {
      response = 'Hello!';
    } else if (input.toLowerCase().includes('how are you')) {
      response = 'I am doing well, thank you!';
    } else if (input.toLowerCase().includes('bye')) {
      response = 'Goodbye! Have a nice day!';
    } else {
      response = 'I didn\'t understand that. Could you please say it again?';
    }

    return response;
  };

  // Handler when new speech input is available
  const handleSpeechInput = (inputText: string) => {
    setSpokenText(inputText); // Store the spoken text
    const response = generateResponse(inputText);  // Generate response based on input
    setResponseText(response);  // Set the response text to be spoken back
  };

  const handleCommandInput = (inputText: string) => {
    setSpokenText(inputText); // Store the spoken text
    const response = generateResponse(inputText);  // Generate response based on input
    setResponseText(response);  // Set the response text to be spoken back
  };


  // Use useEffect to trigger text-to-speech when responseText changes
  useEffect(() => {
    if (responseText) {
      // You can add logic here to make sure the text-to-speech is triggered
      console.log('Speaking:', responseText); // Debugging log
    }
  }, [responseText]); // This effect will run whenever responseText changes

  return (
    <div>
      <h2>Speech to Text with Response</h2>

      {/* Speech recognition component */}
      <SpeechRecognition onSpeechRecognized={handleSpeechInput} onCommandRecognized={handleCommandInput}/>

      {/* Display spoken text */}
      <div>
        <h3>Spoken Text:</h3>
        <p>{spokenText}</p>
      </div>

      {/* Text-to-Speech component */}
      <TextToSpeech text={responseText} />
    </div>
  );
};

export default SpeechToTextWithResponse;
