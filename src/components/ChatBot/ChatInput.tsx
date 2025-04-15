import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-2.5 border-t flex items-center bg-gray-100">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-3 border-none bg-white rounded-3xl focus:outline-none focus:ring-0"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-purple-700 p-3 rounded-full ml-2 hover:scale-110 transition hover:bg-purple-800"
      >
        <FaPaperPlane className="text-white" />
      </button>
    </div>
  );
};

export default ChatInput;
