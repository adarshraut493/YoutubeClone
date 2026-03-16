import React from 'react'
import ShowVideo from '../ShowVideo/ShowVideo'
import './ShowVideoGrid.css'

function ShowVideoGrid({ vids, setVidUploadPage, onDelete }) {
  return (
    <div className='Container_ShowVideoGrid'>
      {vids?.map(vi => (
        <div key={vi._id} className="video_box_app">
          <ShowVideo vid={vi} />
          {onDelete && (
            <div className="delete_video_row">
              <button className="delete_video_btn" onClick={() => onDelete(vi._id)}>
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ShowVideoGrid
