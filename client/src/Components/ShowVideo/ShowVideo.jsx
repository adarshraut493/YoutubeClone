import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './ShowVideo.css'

function ShowVideo({ vid }) {
  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <img
          src={vid?.filePath?.replace('/upload/', '/upload/so_0/').replace('.mp4', '.jpg')}
          className="video_ShowVideo"
          alt={vid?.videoTitle}
        />
      </Link>
      <div className='video_description'>
        <div className='Chanel_logo_App'>
          <div className='fstChar_logo_App'>
            <>{vid?.Uploder?.charAt(0).toUpperCase()}</>
          </div>
        </div>
        <div className='video_details'>
          <p className='title_vid_ShowVideo'>{vid?.videoTitle}</p>
          <pre className='vid_views_UploadTime'>{vid?.Uploder}</pre>
          <pre className='vid_views_UploadTime'>
            {vid?.Views} views <div className="dot"></div> {moment(vid?.createdAt).fromNow()}
          </pre>
        </div>
      </div>
    </>
  )
}

export default ShowVideo
