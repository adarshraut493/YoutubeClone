import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ShowVideoGrid from '../../Components/ShowVideoGrid/ShowVideoGrid';
import DecribeChanel from './DecribeChanel'

function Chanel({ setEditCreateChanelBtn, setVidUploadPage }) {
  const { Cid } = useParams();
  const vids = useSelector(state => state.videoReducer)?.data?.filter(q => q?.videoChanel === Cid).reverse();

  return (
    <div>
      <DecribeChanel
        Cid={Cid}
        setVidUploadPage={setVidUploadPage}
        setEditCreateChanelBtn={setEditCreateChanelBtn} />
      <ShowVideoGrid vids={vids} />
    </div>
  );
}

export default Chanel
