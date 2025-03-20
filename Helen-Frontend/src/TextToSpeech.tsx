import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text,enabled }: { text: string, enabled:boolean }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]);
      setIsLoading(false);
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  const speakText = (text: string) => {
    if (text === "") {
      alert("Please enter some text to speak!");
      return;
    }

    if (isLoading || !selectedVoice) {
      alert("Voices are still loading, please wait.");
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (text) {
      if(enabled){

        speakText(text);
      }
    }
  }, [text]);

  return (
    <div className="relative">
      {/* Settings Icon */}
      <button
  className="absolute top-4 right-4 w-12 h-12 text-white rounded-full flex items-center justify-center transition duration-300"
  onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
>
  <img
    src="https://icons.veryicon.com/png/o/miscellaneous/life-linear-icon/gear-29.png"
    alt="settings-icon"
    className="w-8 h-8 transition-transform transform hover:scale-125"
  />
</button>


      {/* Settings Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-16 right-4 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Text-to-Speech Settings
          </h3>

          {isLoading ? (
            <p>Loading voices...</p>
          ) : (
            <div className="space-y-4">
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choose Voice
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setSelectedVoice(
                      voices.find((voice) => voice.name === e.target.value) ||
                        null
                    )
                  }
                  value={selectedVoice?.name || ""}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pitch Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pitch: {pitch.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Rate Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rate: {rate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Volume Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Volume: {volume.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Close Dropdown */}
          <button
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => setIsDropdownOpen(false)} // Close dropdown on button click
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;