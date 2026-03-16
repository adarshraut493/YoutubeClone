import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../actions/comments";
import "./comments.css";
import DisplayComments from "./DisplayComments";

function Comments({ videoId }) {
  const [commentText, setCommentText] = useState("");
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const commentsList = useSelector((s) => s.commentReducer);
  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!CurrentUser) {
      alert("Please sign in to post a comment.");
      return;
    }
    if (!commentText.trim()) return;
    dispatch(
      postComment({
        videoId: videoId,
        userId: CurrentUser?.result._id,
        commentBody: commentText.trim(),
        userCommented: CurrentUser?.result.name || CurrentUser?.result.email,
      })
    );
    setCommentText("");
  };

  return (
    <>
      <form className="comments_sub_form_comments" onSubmit={handleOnSubmit}>
        <input
          type="text"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={CurrentUser ? "Add a comment..." : "Sign in to comment"}
          value={commentText}
          className="comment_ibox"
        />
        <input type="submit" value="Post" className="comment_add_btn_comments" />
      </form>
      <div className="display_comment_container">
        {commentsList?.data
          ?.filter((q) => videoId === q?.videoId)
          .reverse()
          .map((m) => (
            <DisplayComments
              key={m._id}
              cId={m._id}
              userId={m.userId}
              commentBody={m.commentBody}
              commentOn={m.CommentOn}
              userCommented={m.userCommented}
            />
          ))}
      </div>
    </>
  );
}

export default Comments;
