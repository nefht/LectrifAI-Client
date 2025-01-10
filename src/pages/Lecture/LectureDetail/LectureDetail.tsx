import { useEffect, useState } from "react";
import { getUploadedSlideById } from "../../../services/uploadedSlideService";
import { useParams } from "react-router";

function LectureDetail() {
  const { id } = useParams<{ id: string }>();
  const [slide, setSlide] = useState<any | null>(null);
  useEffect(() => {
    const fetchSlide = async () => {
      if (id) {
        const res = await getUploadedSlideById(id);
        setSlide(res.fileName);
      }
    };
    fetchSlide();
  }, [id]);

  return <div>{slide}</div>;
}

export default LectureDetail;
