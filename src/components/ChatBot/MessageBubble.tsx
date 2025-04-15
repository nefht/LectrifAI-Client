import ReactMarkdown from "react-markdown";
interface MessageBubbleProps {
  text: string;
  role: "user" | "model";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, role }) => {
  return (
    <div
      className={`p-3 rounded-lg max-w-[75%] text-sm ${
        role === "user"
          ? "ml-auto bg-purple-700 text-white shadow-md"
          : "mr-auto bg-purple-200 text-gray-900 shadow-sm"
      }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default MessageBubble;
