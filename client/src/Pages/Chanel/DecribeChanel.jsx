import React from "react";
import { FaEdit, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./DescribeChanel.css";

function DecribeChanel({ setEditCreateChanelBtn, Cid, setVidUploadPage }) {
  const chanels = useSelector((state) => state?.chanelReducers);
  const currentChanel = chanels.filter((c) => c._id === Cid)[0];
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  return (
    <div className="container3_chanel">
      <div className="chanel_banner"></div>
      <div className="chanel_info_section">
        <div className="chanel_header">
          <div className="chanel_logo_chanel">
            <b>{currentChanel?.name.charAt(0).toUpperCase()}</b>
          </div>
          <div className="description_chanel">
            <b>{currentChanel?.name}</b>
            <p>{currentChanel?.desc}</p>
            {CurrentUser?.result._id === currentChanel?._id && (
              <div className="chanel_actions">
                <button
                  className="editbtn_chanel"
                  onClick={() => setEditCreateChanelBtn(true)}
                >
                  <FaEdit />
                  Edit Channel
                </button>
                <button className="uploadbtn_chanel" onClick={() => setVidUploadPage(true)}>
                  <FaUpload />
                  Upload Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecribeChanel;
