import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import axios from 'axios';

function VideoPage() {
  const { vid } = useParams();
  const videoRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState('');

  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  const handleHistory = useCallback(() => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  }, [dispatch, vid, CurrentUser]);

  const handleViews = useCallback(() => {
    dispatch(viewVideo({
      id: vid
    }));
  }, [dispatch, vid]);

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, [CurrentUser, handleHistory, handleViews]);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: "a35fc364b21d6422b38db06ce159175f",
          units: 'metric'
        }
      });
      setTemperature(response.data.main.temp);
      setLocation(response.data.name);
      alert(`Location: ${response.data.name}, Temperature: ${response.data.main.temp}°C`);
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
            window.close(); // Three-taps on the right side: close the website
          } else if (x < rect.width * 0.33) {
            document.querySelector('.comments_VideoPage').scrollIntoView({ behavior: 'smooth' }); // Three-taps on the left side: show the comment section
          } else {
            console.log("Three taps detected"); // Three-tap logic: example - do something on three taps
          }
        }
        e.preventDefault(); // Prevent default behavior for double-click (e.g., fullscreen)
      }

      // Single tap on the top right corner: show current location and temperature
      if (tapCount === 1 && x > rect.width * 0.75 && y < rect.height * 0.25) {
        fetchLocationAndWeather();
      }
    };

    const handleHold = (e) => {
      const rect = videoElement.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x > rect.width * 0.66) {
        videoElement.playbackRate = 2.0; // Hold on the right side: play at 2x speed
      } else if (x < rect.width * 0.33) {
        videoElement.playbackRate = 0.5; // Hold on the left side: play at 0.5x speed
      }
    };

    const handleHoldEnd = () => {
      videoElement.playbackRate = 1.0; // Reset playback rate
    };

    videoElement.addEventListener("click", handleGesture);
    videoElement.addEventListener("mousedown", handleHold);
    videoElement.addEventListener("mouseup", handleHoldEnd);
    videoElement.addEventListener("mouseleave", handleHoldEnd);

    return () => {
      videoElement.removeEventListener("click", handleGesture);
      videoElement.removeEventListener("mousedown", handleHold);
      videoElement.removeEventListener("mouseup", handleHoldEnd);
      videoElement.removeEventListener("mouseleave", handleHoldEnd);
    };
  }, [tapCount]);

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <video
            ref={videoRef}
            src={`http://localhost:5500/${vv?.filePath}`}
            // src={`https://youtubeclone1234.onrender.com/${vv?.filePath}`}
            className="video_ShowVideo_videoPage"
            controls
          ></video>
          <div className="weather-icon" onClick={fetchLocationAndWeather}></div>
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
