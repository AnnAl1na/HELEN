import { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition from "../SpeechRecognition"; 
import TextToSpeech from "../TextToSpeech"; 


const Test = () => {
  const [pdfs, setPdfs] = useState<{ name: string; path: string }[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "computer" }[]
  >([]);
  const [replyText, setReplyText] = useState<string>(""); 
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(true); 
  const [isLearning, setIsLearning] = useState<boolean>(false); // State to track if learning is in progress
  const [question, setQuestion] = useState<string>(""); // Store the question

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pdfs");
        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    };
    fetchPdfs();
  }, []);

  const handlePdfClick = (pdfName: string) => {
    setSelectedPdf(pdfName);
  };

  const handleBackClick = () => {
    setSelectedPdf(null);
  };

  const handleLearnClick = async () => {
    if (selectedPdf) {
      setIsLearning(true);
      try {
        const response = await axios.post("http://localhost:5000/ask_question", {
          pdfName: selectedPdf,
        });
        console.log("Backend response:", response.data);  // Log the response to check its structure
  
        const { reply } = response.data;  // Ensure 'reply' is extracted correctly
  
        if (reply) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: reply, sender: "computer" },  // Add reply to chat messages
          ]);
          setReplyText(reply);  // Optionally set reply text for text-to-speech
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Sorry, I couldn't get a response.", sender: "computer" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error fetching answer", sender: "computer" },
        ]);
      }
    }
  };

  const handleAnswerSubmit = async () => {
    if (inputValue.trim()) {
      try {
        const response = await axios.post("http://localhost:5000/submit_answer", {
          text: inputValue,
          pdfName: selectedPdf,
        });
        const feedback = response.data.reply || "Error processing answer";
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: inputValue, sender: "user" },
          { text: feedback, sender: "computer" },
        ]);
        setIsLearning(false); // Learning process is complete
      } catch (error) {
        console.error("Error submitting answer:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error processing answer", sender: "computer" },
        ]);
      }
      setInputValue("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "g") {
        handleAnswerSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue]);

  const handleSpeechRecognized = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="flex min-h-screen overflow-hidden relative bg-gray-100">
      <div className="w-2/3 p-6 relative overflow-hidden">
        {selectedPdf && (
          <button
            onClick={handleBackClick}
            className="absolute top-4 left-4 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
          >
            &lt;
          </button>
        )}

        {!selectedPdf ? (
          <div className="grid grid-cols-6 gap-4 mb-6">
            {pdfs.map((pdf) => (
              <div
                key={pdf.path}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handlePdfClick(pdf.name)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4726/4726010.png"
                  alt="PDF Icon"
                  className="w-16 h-16 mb-2"
                />
                <div className="text-xs font-medium text-gray-700">
                  {pdf.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <iframe
            src={`http://localhost:5000/uploads/${selectedPdf}`}
            width="100%"
            height="100%"
            title="PDF Viewer"
            frameBorder="0"
            className="h-full w-full"
          />
        )}
      </div>

      <div className="w-1/3 p-6 border-l flex flex-col justify-between overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Chatbox</h2>
        <div
          className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-4 max-w-xs rounded-lg ${
                  msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div id="messagesEnd" />
        </div>
          
        <div className="flex items-center space-x-2 mt-4">
          {isLearning ? (
            <>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
              />
              <button
                onClick={handleAnswerSubmit}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button
              onClick={handleLearnClick}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
            >
              Learn
            </button>
          )}
        </div>
      </div>

      <SpeechRecognition onSpeechRecognized={handleSpeechRecognized} />
      <TextToSpeech text={replyText} enabled={isTtsEnabled} />
      
      <button
        className="fixed bottom-4 left-4 p-3 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition duration-300"
        onClick={() => setIsTtsEnabled((prev) => !prev)}
      >
        {isTtsEnabled ? "enable voice mode" : "disable voice mode"}
      </button>
    </div>
  );
};

export default Test;
