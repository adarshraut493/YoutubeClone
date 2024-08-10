import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import axios from "axios";

function VideoPage({ points, setPoints }) {
  const { vid } = useParams();
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState("");

  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const navigate = useNavigate();

  const vids = useSelector((state) => state.videoReducer);

  const vv = vids?.data.find((q) => q._id === vid);

  const handleHistory = useCallback(() => {
    if (!CurrentUser) return;
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  }, [dispatch, vid, CurrentUser]);

  const handleViews = useCallback(() => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  }, [dispatch, vid]);

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, [CurrentUser, handleHistory, handleViews]);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: "a35fc364b21d6422b38db06ce159175f",
            units: "metric",
          },
        }
      );
      setTemperature(response.data.main.temp);
      setLocation(response.data.name);
      alert(
        `Location: ${response.data.name}, Temperature: ${response.data.main.temp}°C`
      );
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchLocationAndWeather = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const handleDoubleTap = (direction) => {
    const currentTime = videoRef.current.currentTime;
    if (direction === "forward") {
      videoRef.current.currentTime = currentTime + 10;
    } else if (direction === "backward") {
      videoRef.current.currentTime = currentTime - 10;
    }
  };

  const handleTripleTap = (element) => {
    if (element === "tap-right") {
      if (window.confirm("Are you sure you want to close the tab?")) {
        window.close();
      }
    } else if (element === "tap-left") {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (element === "blue-rectangle") {
      const nextVid = getNextVideoId();
      navigate(`/videopage/${nextVid}`);
    }
  };

  let tapCount = 0;
  let tapTimeout;

  const handleTap = (element, direction) => {
    tapCount++;
    clearTimeout(tapTimeout);

    tapTimeout = setTimeout(() => {
      if (tapCount === 1) {
        if (element === "blue-rectangle" || element === "tap-left" || element === "tap-right") {
          if (videoRef.current.paused) {
            increasePoints();
          }
        }

        if (videoRef.current.paused) {
          videoRef.current.play();
          increasePoints();
        } else {
          videoRef.current.pause();
        }
      } else if (tapCount === 2) {
        handleDoubleTap(direction);
      } else if (tapCount === 3) {
        handleTripleTap(element);
      }
      tapCount = 0;
    }, 300);
  };

  const handleHoldStart = (direction) => {
    if (direction === "forward") {
      videoRef.current.playbackRate = 2.0;
    } else if (direction === "backward") {
      videoRef.current.playbackRate = 0.5;
    }
  };

  const handleHoldEnd = () => {
    videoRef.current.playbackRate = 1.0;
  };

  const getNextVideoId = () => {
    const currentIndex = vids?.data.findIndex((video) => video._id === vid);
    const nextIndex = (currentIndex + 1) % vids?.data.length;

    return vids?.data[nextIndex]?._id;
  };

  const increasePoints = () => {
    const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos") || "[]");
    if (!watchedVideos.includes(vid)) {
      setPoints(prevPoints => prevPoints + 5);
      watchedVideos.push(vid);
      localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
    }
  };

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <video
            ref={videoRef}
            src={`http://localhost:5500/${vv?.filePath}`}
            // src={`https://youtubeclonegubkvcrt7yhjbcgdfty.onrender.com/${vv?.filePath}`}
            
            className="video_ShowVideo_videoPage"
            controls
          ></video>
          <div
            className="weather-icon"
            onClick={fetchLocationAndWeather}
          ></div>
          <div
            className="tap-left"
            onClick={() => handleTap("tap-left", "backward")}
            onMouseDown={() => handleHoldStart("backward")}
            onMouseUp={handleHoldEnd}
            onTouchStart={() => handleHoldStart("backward")}
            onTouchEnd={handleHoldEnd}
            onDoubleClick={() => handleDoubleTap("backward")}
          ></div>
          <div
            className="tap-right"
            onClick={() => handleTap("tap-right", "forward")}
            onMouseDown={() => handleHoldStart("forward")}
            onMouseUp={handleHoldEnd}
            onTouchStart={() => handleHoldStart("forward")}
            onTouchEnd={handleHoldEnd}
            onDoubleClick={() => handleDoubleTap("forward")}
          ></div>
          <div
            className="blue-rectangle"
            onClick={() => handleTap("blue-rectangle", "forward")}
          ></div>
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
              <p className="chanel_name_videoPage">{vv?.Uploder}</p>
            </Link>
            <div className="comments_VideoPage" ref={commentsRef}>
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