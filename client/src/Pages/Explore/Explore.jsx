import React from 'react';
import ShowVideoGrid from '../../Components/ShowVideoGrid/ShowVideoGrid';
import { useSelector } from 'react-redux';
import './Explore.css';

function Explore() {
  const vids = useSelector((state) => state.videoReducer)?.data?.filter(q => q).reverse();

  return (
    <div className="explore_container">
      <h1>Explore</h1>
      <ShowVideoGrid vids={vids} />
    </div>
  );
}

export default Explore;
