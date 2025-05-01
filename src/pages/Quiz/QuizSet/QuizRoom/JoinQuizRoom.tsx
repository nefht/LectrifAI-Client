import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import quizService from "../../services/quizService";
import { useAuth } from "../../../../hooks/useAuth";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function JoinQuizRoom() {
  const { token: inviteToken } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const joinQuizRoom = async () => {
      if (!inviteToken) return;
      //   const response = await quizService.joinMultiplePlayersRoom(inviteToken);

      const socket = io(SERVER_URL, { query: { token } });

      // Gửi sự kiện join-quiz-room đến server
      socket.emit("join-quiz-room", {
        inviteToken,
        user,
      });

      // Lắng nghe sự kiện 'joined-quiz-room' từ server
      socket.on("joined-quiz-room", (data) => {
        console.log(data.message);
        navigate(`/quiz-room/${data.roomId}`); 
      });

      // Lắng nghe lỗi từ server
      socket.on("error", (data) => {
        console.error(data.message);
      });
    };

    joinQuizRoom();
  }, [inviteToken]);
  return <></>;
}

export default JoinQuizRoom;
