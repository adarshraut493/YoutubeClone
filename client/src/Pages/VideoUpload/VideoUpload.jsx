import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../actions/video";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./VideoUpload.css";

function VideoUpload({ setVidUploadPage }) {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSetVideoFile = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const fileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
      if (percentage === 100) {
        setTimeout(function () {}, 3000);
        setVidUploadPage(false);
      }
    },
  };

  const uploadVideoFile = () => {
    if (!title) {
      alert("Please enter a title for the video");
    } else if (!videoFile) {
      alert("Please select a video file");
    } else if (videoFile.size > 1000000) {
      alert("Please select a video file smaller than 1 MB");
    } else {
      const fileData = new FormData();
      fileData.append("file", videoFile);
      fileData.append("title", title);
      fileData.append("chanel", CurrentUser?.result._id);
      fileData.append("Uploder", CurrentUser?.result.name);
      dispatch(
        uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions,
        })
      );
    }
  };

  return (
    <div className="container_VidUpload" onClick={() => setVidUploadPage(false)}>
      <div className="container2_VidUpload" onClick={(e) => e.stopPropagation()}>

        <div className="vidupload_header">
          <h2 className="vidupload_title">Upload Video</h2>
          <button className="vidupload_close" onClick={() => setVidUploadPage(false)}>✕</button>
        </div>

        <div className="vidupload_divider" />

        <div className="vidupload_body">
          <label className="vidupload_label">Video Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="ibox_vidupload"
            maxLength={30}
            placeholder="Enter a title for your video"
            value={title}
          />

          <label className="vidupload_label">Video File</label>
          <label htmlFor="vid_file_input" className="vidupload_filedrop">
            <span className="vidupload_fileicon">🎬</span>
            <span className="vidupload_filename">
              {videoFile ? videoFile.name : "Click to choose a video file"}
            </span>
            <span className="vidupload_filesub">
              {videoFile
                ? `${(videoFile.size / 1024).toFixed(1)} KB`
                : "MP4 only · max 1 MB"}
            </span>
            <input
              id="vid_file_input"
              type="file"
              accept="video/mp4"
              onChange={handleSetVideoFile}
              style={{ display: "none" }}
            />
          </label>

          <button onClick={uploadVideoFile} className="btn_vidUpload">
            Upload
          </button>

          {progress > 0 && (
            <div className="vidupload_progress">
              <div className="loader">
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    strokeLinecap: "round",
                    textSize: "18px",
                    pathTransitionDuration: 0.5,
                    pathColor: "#3ea6ff",
                    textColor: "#fff",
                    trailColor: "#3a3a3a",
                  })}
                />
              </div>
              <p className="vidupload_progress_label">
                {progress < 100 ? "Uploading..." : "Done!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
