import bg1 from "../assets/ClassroomCardBackground/bg1.svg";
import bg2 from "../assets/ClassroomCardBackground/bg2.svg";
import bg3 from "../assets/ClassroomCardBackground/bg3.svg";
import bg4 from "../assets/ClassroomCardBackground/bg4.svg";
import bg5 from "../assets/ClassroomCardBackground/bg5.svg";
import bg6 from "../assets/ClassroomCardBackground/bg6.svg";
import bg7 from "../assets/ClassroomCardBackground/bg7.svg";
import bg8 from "../assets/ClassroomCardBackground/bg8.svg";
import bg9 from "../assets/ClassroomCardBackground/bg9.svg";
import bg10 from "../assets/ClassroomCardBackground/bg10.svg";
import bg11 from "../assets/ClassroomCardBackground/bg11.svg";

function ClassroomCardBackground({ classroomId }: { classroomId: string }) {
  // Tính toán hash từ id
  let hash = 0;
  for (let i = 0; i < classroomId.length; i++) {
    hash = (hash << 5) - hash + classroomId.charCodeAt(i);
  }

  const getBackgroundImage = (hash: number) => {
    const images = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11];
    return images[Math.abs(hash) % images.length];
  };

  return (
    <img
      src={getBackgroundImage(hash)}
      alt="Classroom Background"
      className="w-full h-full object-cover"
    />
  );
}

export default ClassroomCardBackground;
