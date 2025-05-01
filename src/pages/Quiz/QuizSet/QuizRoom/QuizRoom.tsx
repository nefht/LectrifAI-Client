import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import quizService from "../../services/quizService";
import { useAuth } from "../../../../hooks/useAuth";
import { useToast } from "../../../../hooks/useToast";
import CustomSpinner from "../../../../components/LoadingSpinner/CustomSpinner";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

function QuizRoom() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [roomInfo, setRoomInfo] = useState<any>({} as any);
  const [inviteLink, setInviteLink] = useState("");
  const [players, setPlayers] = useState<string[]>([]); // Danh sách người chơi
  const [newPlayer, setNewPlayer] = useState({} as any); // Người chơi mới

  const [socket, setSocket] = useState<any>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm để yêu cầu trạng thái phòng hiện tại
  const requestRoomState = useCallback(() => {
    if (socket && isSocketConnected && id) {
      console.log("Requesting current room state...");
      socket.emit("request-room-state", { roomId: id });
    }
  }, [socket, isSocketConnected, id]);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      query: { token },
    });

    setSocket(socket);

    // Kết nối với socket server khi component mount
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsSocketConnected(true);
    });

    // Lắng nghe sự kiện 'quiz-room-updated' từ server
    socket.on("quiz-room-updated", (data: any) => {
      console.log("Received quiz-room-updated:", data);
      setNewPlayer(data.newPlayer);
      setPlayers(data.players);
    });

    // Add listener for quiz-room-state event
    socket.on("quiz-room-state", (data: any) => {
      console.log("Received quiz-room-state:", data);
      setRoomInfo(data);
      setPlayers(data?.players || []);
      setInviteLink(`${CLIENT_URL}/quiz-room/join/${data?.inviteToken}`);
      setIsLoading(false);
    });

    // Lắng nghe sự kiện 'error' từ server
    socket.on("error", (data: any) => {
      console.error("Socket error:", data.message);
      showToast("error", data.message || "An error occurred");
    });

    // Lắng nghe sự kiện disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, showToast]);

  // Join vào socket room khi đã kết nối socket và id sẵn sàng
  useEffect(() => {
    if (socket && isSocketConnected && id) {
      console.log("Joining socket room:", id);
      socket.emit("join-socket-room", { roomId: id });
    }
  }, [socket, isSocketConnected, id]);

  // Request room state after joining socket room
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (socket && isSocketConnected && id) {
      // Request room state after a short delay to allow join event to complete
      timeoutId = setTimeout(() => {
        requestRoomState();
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [socket, isSocketConnected, id, requestRoomState]);

  // Tải thông tin phòng từ API nếu socket không hoạt động
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchRoomInfo = async () => {
      if (!id) return;
      try {
        const response = await quizService.getRoomById(id);
        console.log("Room info from API:", response);
        setRoomInfo(response);
        setPlayers(response?.players || []);
        setInviteLink(`${CLIENT_URL}/quiz-room/join/${response?.inviteToken}`);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room info:", error);
        showToast("error", "Could not load quiz room information");
        setIsLoading(false);
      }
    };

    // Fall back to API if socket doesn't work within 3 seconds
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log("Falling back to API call due to socket timeout");
        fetchRoomInfo();
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, isLoading, showToast]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => showToast("success", "Link copied to clipboard!"))
      .catch((err) => console.error("Could not copy link:", err));
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <>
        <CustomSpinner isLoading={isLoading} message={"Loading quiz room..."} />
      </>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row p-4 pt-8">
      <div className="flex flex-col flex-1 items-center justify-center mb-6 md:mb-0">
        <h1 className="text-2xl font-bold mb-4">
          {roomInfo?.name || "Quiz Room"}
        </h1>
        {inviteLink && (
          <div className="flex flex-col items-center">
            <QRCodeSVG value={inviteLink} size={200} />
            <p className="mt-2 text-sm text-gray-600">Scan to join</p>
          </div>
        )}
        {user?.id === roomInfo.userId && (
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
            Start Quiz
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col md:pr-20">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Room Details</h2>
          <div className="mb-1">
            Number of players:{" "}
            <span className="font-medium">{players?.length}</span>
          </div>
          <div className="mb-1">
            Time limit:{" "}
            <span className="font-medium">{roomInfo?.timeLimit} seconds</span>
          </div>
          <div className="mb-1">
            Max players:{" "}
            <span className="font-medium">{roomInfo?.maxPlayers}</span>
          </div>
          <div className="mb-4">
            <span>Join link: </span>
            <a href={inviteLink} className="text-blue-500 break-all">
              {inviteLink}
            </a>
            <button
              className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded"
              onClick={copyToClipboard}
            >
              Copy
            </button>
          </div>
          <div className="text-sm">
            Socket status:
            <span
              className={
                isSocketConnected ? "text-green-500 ml-1" : "text-red-500 ml-1"
              }
            >
              {isSocketConnected ? "Connected" : "Disconnected"}
            </span>
            {!isSocketConnected && (
              <button
                className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded"
                onClick={() => window.location.reload()}
              >
                Reconnect
              </button>
            )}
          </div>
        </div>

        {newPlayer && newPlayer.fullName && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg animate-pulse">
            <strong>{newPlayer.fullName || newPlayer.account}</strong> has
            joined the quiz room!
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Players ({players.length})</h3>
            <button
              className="text-sm bg-gray-100 px-2 py-1 rounded"
              onClick={requestRoomState}
              title="Refresh player list"
            >
              Refresh
            </button>
          </div>

          {players.length === 0 ? (
            <p className="text-gray-500">No players have joined yet</p>
          ) : (
            <ul className="divide-y">
              {players.map((player: any, index) => (
                <li key={index} className="py-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    {(player.fullName ||
                      player.account ||
                      "?")[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">
                      {player.fullName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.account}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRoom;
