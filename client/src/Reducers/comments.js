const commentReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "POST_COMMENT":
      return { ...state };

    case "EDIT_COMMENT":
      return { ...state };

      // 'FETCH_ALL_COMMENTS' updates data with all comments (action.payload)
    case "FETCH_ALL_COMMENTS":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default commentReducer