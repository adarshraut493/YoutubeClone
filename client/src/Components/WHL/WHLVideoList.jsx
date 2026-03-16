import React from 'react'
import ShwoVideoList from '../ShowVideoList/ShwoVideoList'

const EMPTY_ICONS = {
  History: '🕐',
  'Watch Later': '🕒',
  'Liked Video': '👍',
};

function WHLVideoList({ page, CurrentUser, videoList }) {
  if (!CurrentUser) {
    return <p className="whl_login_msg">Sign in to see your {page}.</p>;
  }

  const seen = new Set();
  const items = videoList?.data
    ?.filter(q => q?.Viewer === CurrentUser)
    .reverse()
    .filter(m => {
      if (seen.has(m?.videoId)) return false;
      seen.add(m?.videoId);
      return true;
    }) ?? [];

  if (items.length === 0) {
    return (
      <div className="whl_empty">
        <span className="whl_empty_icon">{EMPTY_ICONS[page] ?? '📭'}</span>
        <h3>No videos here yet</h3>
        <p>Videos you {page === 'History' ? 'watch' : page === 'Watch Later' ? 'save for later' : 'like'} will show up here.</p>
      </div>
    );
  }

  return (
    <>
      {items.map(m => (
        <ShwoVideoList videoId={m?.videoId} key={m?._id} />
      ))}
    </>
  );
}

export default WHLVideoList
