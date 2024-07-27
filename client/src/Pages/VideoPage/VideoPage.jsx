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
  const { vid } = useParams(); // Get current video ID from URL
  const videoRef = useRef(null); // Reference to video player
  const commentsRef = useRef(null); // Reference to comments section
  const [location, setLocation] = useState(""); // State for location name
  const [temperature, setTemperature] = useState(""); // State for temperature
  const dispatch = useDispatch(); // Redux dispatch
  const CurrentUser = useSelector((state) => state?.currentUserReducer); // Get current user from Redux store
  const navigate = useNavigate(); // Navigation hook from React Router

  const vids = useSelector((state) => state.videoReducer); // Get videos from Redux store

  // Find current video data
  const vv = vids?.data.find((q) => q._id === vid);

  // Function to add the video to history
  const handleHistory = useCallback(() => {
    if (!CurrentUser) return; // Ensure user is logged in
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  }, [dispatch, vid, CurrentUser]);

  // Function to increase the view count of the video
  const handleViews = useCallback(() => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  }, [dispatch, vid]);

  // UseEffect hook to add the video to history and increase view count on initial render
  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, [CurrentUser, handleHistory, handleViews]);

  // Function to fetch weather data
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

  // Function to get location and fetch weather data
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

  // Function to handle double tap events
  const handleDoubleTap = (direction) => {
    const currentTime = videoRef.current.currentTime;
    if (direction === "forward") {
      videoRef.current.currentTime = currentTime + 10; // Skip 10 seconds forward
    } else if (direction === "backward") {
      videoRef.current.currentTime = currentTime - 10; // Skip 10 seconds backward
    }
  };

  // Function to handle triple tap events
  const handleTripleTap = (element, direction) => {
    if (element === "video") {
      // Triple tap on video area
      if (direction === "backward") {
        commentsRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to comments
      } else if (direction === "forward") {
        window.location.href = "http://localhost:3000/"; // Navigate to home page
      }
    } else if (element === "rectangle") {
      // Triple tap on blue rectangle
      const nextVid = getNextVideoId(); // Get next video ID
      navigate(`/videopage/${nextVid}`); // Navigate to next video's route
    }
  };

  let tapCount = 0; // Track number of taps
  let tapTimeout; // Timeout for tap events

  // Function to handle tap events
  const handleTap = (element, direction) => {
    tapCount++;
    clearTimeout(tapTimeout);

    tapTimeout = setTimeout(() => {
      if (tapCount === 1) {
        if (element === "rectangle") {
          // Check if the tapped element is the blue rectangle
          increasePoints(); // Increase points on single tap
        }

        if (videoRef.current.paused) {
          videoRef.current.play(); // Play video on single tap
        } else {
          videoRef.current.pause(); // Pause video on single tap
        }
      } else if (tapCount === 2) {
        handleDoubleTap(direction); // Handle double tap
      } else if (tapCount === 3) {
        handleTripleTap(element, direction); // Handle triple tap
      }
      tapCount = 0;
    }, 300); // 300ms window for quicker detection
  };

  // Function to handle hold start events
  const handleHoldStart = (direction) => {
    if (direction === "forward") {
      videoRef.current.playbackRate = 2.0; // Set playback rate to 2x
    } else if (direction === "backward") {
      videoRef.current.playbackRate = 0.5; // Set playback rate to 0.5x
    }
  };

  // Function to handle hold end events
  const handleHoldEnd = () => {
    videoRef.current.playbackRate = 1.0; // Reset playback rate to normal
  };

  // Function to find the next video
  const getNextVideoId = () => {
    const currentIndex = vids?.data.findIndex((video) => video._id === vid);
    const nextIndex = (currentIndex - 1) % vids?.data.length; // Loop back to the first video if at the end
    if (currentIndex === vids?.data.length + 1) {
      // If at the last video, loop to the first video
      return vids?.data[0]._id;
    }
    return vids?.data[nextIndex]?._id;
  };

  const increasePoints = () => {
    setPoints(points + 5);
    console.log(points);
  };

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <video
            ref={videoRef}
            src={`http://localhost:5500/${vv?.filePath}`} // Video path
            className="video_ShowVideo_videoPage"
            controls
          ></video>
          <div
            className="weather-icon" // Weather icon for fetching location
            onClick={fetchLocationAndWeather}
          ></div>
          <div
            className="tap-left" // Left tap area for rewind
            onClick={() => handleTap("video", "backward")}
            onMouseDown={() => handleHoldStart("backward")}
            onMouseUp={handleHoldEnd}
            onTouchStart={() => handleHoldStart("backward")}
            onTouchEnd={handleHoldEnd}
            onDoubleClick={() => handleDoubleTap("backward")} // Add double-click handler
          ></div>
          <div
            className="tap-right" // Right tap area for forward
            onClick={() => handleTap("video", "forward")}
            onMouseDown={() => handleHoldStart("forward")}
            onMouseUp={handleHoldEnd}
            onTouchStart={() => handleHoldStart("forward")}
            onTouchEnd={handleHoldEnd}
            onDoubleClick={() => handleDoubleTap("forward")} // Add double-click handler
          ></div>

          {/* Blue rectangle for navigation to next video */}
          <div
            className="blue-rectangle" // Blue rectangle for triple tap navigation
            onClick={() => handleTap("rectangle", "forward")}
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
