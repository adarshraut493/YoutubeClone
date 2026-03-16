const videoReducer =(state= {data:null},action)=>{
    switch(action.type){
        case 'POST_VIDEO':
            return {...state};
        case 'POST_LIKE':
            return {...state};
        case 'FETCH_ALL_VIDEOS':
            return {...state,data:action.payload};
        case 'DELETE_VIDEO':
            return {...state, data: state.data?.filter(v => v._id !== action.payload)};
        default:
            return state;
    }
}

export default videoReducer