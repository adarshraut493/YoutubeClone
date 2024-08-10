import React from 'react'
import ShowVideo from '../ShowVideo/ShowVideo'
import './ShowVideoGrid.css'
        function ShowVideoGrid({vids,points, setPoints ,  setVidUploadPage}) {
  return (
    <div className='Container_ShowVideoGrid'>
        {
          vids?.reverse().map(vi=>
            {
                return (
                    <div key={vi._id} className="video_box_app">
                      <ShowVideo vid={vi} points={points} setPoints={setPoints}  />
                    </div>
                )
            })  
        }
    </div>
  )
}

export default ShowVideoGrid