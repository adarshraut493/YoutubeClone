import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHistory } from "../../actions/History";
import "./WHLcss.css";
import WHLVideoList from "./WHLVideoList";

function WHL({ page, videoList }) {
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const dispatch = useDispatch();

  const handleClearHistory = () => {
    if (CurrentUser) {
      dispatch(clearHistory({ userId: CurrentUser?.result._id }));
    }
  };

  return (
    <div className="whl_page">
      <div className="whl_header">
        <h1 className="whl_title">{page}</h1>
        {page === "History" && CurrentUser && (
          <button className="whl_clear_btn" onClick={handleClearHistory}>
            Clear History
          </button>
        )}
      </div>
      <div className="whl_list">
        <WHLVideoList
          page={page}
          CurrentUser={CurrentUser?.result._id}
          videoList={videoList}
        />
      </div>
    </div>
  );
}

export default WHL;
