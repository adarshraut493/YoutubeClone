import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";

function VideoPage() {
  const { vid } = useParams();
  const videoRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);

  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  };

  const handleViews = () => {
    dispatch(viewVideo({
      id: vid
    }));
  };

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    let timer;
    let lastTap = 0;

    const handleGesture = (e) => {
      const currentTime = new Date().getTime();
      const tapInterval = currentTime - lastTap;
      lastTap = currentTime;
      setTapCount((prev) => prev + 1);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setTapCount(0);
      }, 300);

      const rect = videoElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (tapInterval < 300) {
        if (tapCount === 1) {
          if (x > rect.width * 0.66) {
            videoElement.currentTime += 10; // Double-tap right
          } else if (x < rect.width * 0.33) {
            videoElement.currentTime -= 10; // Double-tap left
          } else {
            videoElement.paused ? videoElement.play() : videoElement.pause(); // Single-tap center
          }
        } else if (tapCount === 2) {
          if (x > rect.width * 0.66) {
            // Three-tap right
            window.close(); // or another action to close the website
          } else if (x < rect.width * 0.33) {
            // Three-tap left
            document.querySelector(".comments_VideoPage").scrollIntoView({ behavior: "smooth" }); // Show comments
          } else {
            // Three-tap center
            // Move to the next video logic here
          }
        }
      } else if (tapCount === 1) {
        if (x > rect.width * 0.8 && y < rect.height * 0.2) {
          // Single-tap top right corner
          alert("Current Location and Temperature"); // Replace with actual location and temperature logic
        }
      }
    };

    const handleMouseDown = (e) => {
      const rect = videoElement.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x > rect.width * 0.5) {
        videoElement.playbackRate = 2.0; // 2X speed
      } else {
        videoElement.playbackRate = 0.5; // 0.5X speed
      }
    };

    const handleMouseUp = () => {
      videoElement.playbackRate = 1.0; // Normal speed
    };

    videoElement.addEventListener("click", handleGesture);
    videoElement.addEventListener("mousedown", handleMouseDown);
    videoElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      videoElement.removeEventListener("click", handleGesture);
      videoElement.removeEventListener("mousedown", handleMouseDown);
      videoElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, [tapCount]);

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <video
            ref={videoRef}
            src={`http://localhost:5500/${vv?.filePath}`}
            className="video_ShowVideo_videoPage"
            controls
          ></video>
          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.videoTitle}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.Views} views <div className="dot"></div>{" "}
                  {moment(vv?.createdAt).fromNow()}
                </div>
                <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
              </div>
            </div>
            <Link
              to={`/chanel/${vv?.videoChanel}`}
              className="chanel_details_videoPage"
            >
              <b className="chanel_logo_videoPage">
                <p>{vv?.Uploder.charAt(0).toUpperCase()}</p>
              </b>
              <p className="chanel_name_videoPage">{vv?.Uploder}</p>
            </Link>
            <div className="comments_VideoPage">
              <h2>
                <u>Comments</u>
              </h2>
              <Comments videoId={vv._id} />
            </div>
          </div>
        </div>
        <div className="moreVideoBar">More video</div>
      </div>
    </div>
  );
}

export default VideoPage;
