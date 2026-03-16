import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ShowVideoGrid from "../../Components/ShowVideoGrid/ShowVideoGrid";
import { deleteVideo } from "../../actions/video";
import "./yourVideo.css";

function YourVideo() {
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const vids = useSelector(state => state.videoReducer)?.data?.filter(q => q?.videoChanel === CurrentUser?.result?._id).reverse();

  const handleDelete = (id) => {
    if (window.confirm("Delete this video?")) {
      dispatch(deleteVideo(id));
    }
  };

  return (
    <div className="container_yourvideo">
      <h1>Your Videos</h1>
      {CurrentUser ? (
        <ShowVideoGrid vids={vids} onDelete={handleDelete} />
      ) : (
        <h3>Please login to see your uploaded videos</h3>
      )}
    </div>
  );
}

export default YourVideo;
