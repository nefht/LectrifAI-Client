import { useState } from "react";
import uploadedSlideService from "../../../services/uploadedSlideService";
import { Link } from "react-router";

function SlidesList() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedSlides, setUploadedSlides] = useState<any[]>([]);

  const handleGetUploadedSlides = async () => {
    try {
      const response = await uploadedSlideService.getUploadedSlides();
      setUploadedSlides(response);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  const handleGetUploadedSlideDetail = async (id: string) => {
    try {
      const response = await uploadedSlideService.getUploadedSlideById(id);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  const handleDownloadSlide = async (id: string) => {
    try {
      await uploadedSlideService.downloadSlide(id);
    } catch (error) {
      alert(error);
    }
  };

  const handleUploadSlide = async () => {
    if (!file) {
      alert("Please choose file");
      return;
    }

    try {
      const response = await uploadedSlideService.uploadSlide(file);

      if (response.status === 200) {
        alert("Upload successfully");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div>Slides list</div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files ? e.target.files[0] : null);
          if (e.target.files) {
            console.log(e.target.files[0]);
          }
        }}
      />
      <button onClick={handleUploadSlide}>Upload</button>
      <button onClick={handleGetUploadedSlides}>Get slides</button>
      {uploadedSlides?.map((file, index) => (
        <div key={index}>
          <span>File {index + 1} </span>
          <Link to={`/slide/detail/${file._id}`}>{file.fileName}</Link>
          <button onClick={() => handleDownloadSlide(file._id)}>
            Download
          </button>
        </div>
      ))}
      <canvas
        style={{ display: "block", width: "511.2px", height: "729.6px" }}
        data-engine="three.js r157"
        width="639"
        height="912"
      ></canvas>
    </>
  );
}

export default SlidesList;
