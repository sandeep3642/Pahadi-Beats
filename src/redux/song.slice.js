import { createSlice } from "@reduxjs/toolkit";

const songSlice = createSlice({
    name:"song",
    initialState:{currentSong:null,songIndex:0,isPlaying:false},
    reducers:{
        addSong:(state,action)=>{
            const {currentSong,songIndex,isPlaying}= action.payload;
            state.currentSong=currentSong
            state.songIndex=songIndex
            state.isPlaying=isPlaying
        }
    }
});

export const {addSong}= songSlice.actions
export default songSlice.reducer