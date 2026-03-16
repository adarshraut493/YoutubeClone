import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo, deleteVideo } from "../../actions/video";

function CustomControls({ videoRef, isPlaying, togglePlay }) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [videoRef]);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    videoRef.current.volume = v;
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  return (
    <div className="custom_controls">
      <div className="progress_bar" onClick={handleSeek}>
        <div className="progress_fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="controls_row">
        <button className="ctrl_btn" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span className="ctrl_time">{formatTime(currentTime)} / {formatTime(duration)}</span>
        <div className="ctrl_volume">
          <span>🔊</span>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolume} className="volume_slider" />
        </div>
        <button className="ctrl_btn ctrl_fullscreen" onClick={handleFullscreen}>⛶</button>
      </div>
    </div>
  );
}

function VideoPage() {
  const { vid } = useParams();
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const tapTimerRef = useRef(null);
  const tapCountRef = useRef(0);
  const holdTimerRef = useRef(null);

  const [seekIndicator, setSeekIndicator] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed2x, setSpeed2x] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data?.find((q) => q._id === vid);

  const handleHistory = useCallback(() => {
    if (!CurrentUser) return;
    dispatch(addToHistory({ videoId: vid, Viewer: CurrentUser?.result._id }));
  }, [dispatch, vid, CurrentUser]);

  const handleViews = useCallback(() => {
    dispatch(viewVideo({ id: vid }));
  }, [dispatch, vid]);

  useEffect(() => {
    if (CurrentUser) handleHistory();
    handleViews();
  }, [CurrentUser, handleHistory, handleViews]);

  const showSeekIndicator = (direction) => {
    setSeekIndicator(direction);
    setTimeout(() => setSeekIndicator(null), 700);
  };

  const seek = (direction) => {
    if (!videoRef.current) return;
    if (direction === "forward") {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
      showSeekIndicator("forward");
    } else {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
      showSeekIndicator("backward");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleZoneClick = (direction) => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      if (tapCountRef.current === 1) {
        togglePlay();
      } else if (tapCountRef.current >= 2) {
        seek(direction);
      }
      tapCountRef.current = 0;
    }, 250);
  };

  const handleHoldStart = () => {
    holdTimerRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 2.0;
        setSpeed2x(true);
      }
    }, 500);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimerRef.current);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      setSpeed2x(false);
    }
  };

  if (!vv) return <div style={{ color: "white", padding: "24px" }}>Loading...</div>;

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">

          <div className="video_wrapper_videoPage">
            <video
              ref={videoRef}
              src={`${process.env.REACT_APP_API_URL || "http://localhost:5500"}/${vv?.filePath}`}
              className="video_ShowVideo_videoPage"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* 2x speed indicator */}
            {speed2x && (
              <div className="speed_indicator">▶▶ 2x</div>
            )}

            {/* Left tap zone */}
            <div
              className="tap_zone tap_zone_left"
              onClick={() => handleZoneClick("backward")}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              {seekIndicator === "backward" && (
                <div className="seek_indicator seek_indicator_left">
                  <div className="seek_ripple" />
                  <span>◀◀ 10s</span>
                </div>
              )}
            </div>

            {/* Center zone - play/pause */}
            <div
              className="tap_zone tap_zone_center"
              onClick={togglePlay}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            />

            {/* Right tap zone */}
            <div
              className="tap_zone tap_zone_right"
              onClick={() => handleZoneClick("forward")}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              {seekIndicator === "forward" && (
                <div className="seek_indicator seek_indicator_right">
                  <div className="seek_ripple" />
                  <span>10s ▶▶</span>
                </div>
              )}
            </div>

            {/* Center play icon when paused */}
            {!isPlaying && (
              <div className="center_play_icon" onClick={togglePlay}>▶</div>
            )}

            <CustomControls videoRef={videoRef} isPlaying={isPlaying} togglePlay={togglePlay} />
          </div>

          <div className="video_btns_title_VideoPage_cont">
            <p className="video_title_VideoPage">{vv?.videoTitle}</p>
            <div className="views_date_btns_VideoPage">
              <div className="views_videoPage">
                {vv?.Views} views <div className="dot"></div>
                {moment(vv?.createdAt).fromNow()}
              </div>
              <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
            </div>
            {CurrentUser?.result?._id === vv?.videoChanel && (
              <button
                className="delete_video_btn"
                onClick={() => {
                  if (window.confirm("Delete this video permanently?")) {
                    dispatch(deleteVideo(vid));
                    navigate("/");
                  }
                }}
              >
                🗑 Delete Video
              </button>
            )}
          </div>

          <Link to={`/chanel/${vv?.videoChanel}`} className="chanel_details_videoPage">
            <div className="chanel_logo_videoPage">
              <p>{vv?.Uploder?.charAt(0).toUpperCase()}</p>
            </div>
            <p className="chanel_name_videoPage">{vv?.Uploder}</p>
          </Link>

          <div className="comments_VideoPage" ref={commentsRef}>
            <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "500" }}>Comments</h2>
            <Comments videoId={vv._id} />
          </div>
        </div>

        <div className="moreVideoBar">More Videos</div>
      </div>
    </div>
  );
}

export default VideoPage;
