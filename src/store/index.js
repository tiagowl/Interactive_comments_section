import { createStore } from 'vuex'
import data from '@/data';

export default createStore({
  state: {
    comments: data.comments
  },
  getters: {
  },
  mutations: {
    addComment(state, payload){
      if(payload.id !== 0){
        let commentIndex = state.comments.findIndex((comment)=>comment.id === payload.id);
        let newIdComment = state.comments[commentIndex].replies.length === 0 ? 1 : state.comments[commentIndex].replies[state.comments[commentIndex].replies.length - 1].id + 1;
        state.comments[commentIndex].replies.push({...payload.content, id: newIdComment});
      }else{
        let newCommentId = state.comments[state.comments.length - 1].id + 1;
        state.comments.unshift({...payload.content, id: newCommentId});
      }
    },
    updateComment(state, payload){
      if(payload.type === "subcomment"){
        state.comments[payload.commentIndex].replies[payload.subCommentIndex].content = payload.content;
      }else{
        state.comments[payload.commentIndex].content = payload.content;
      }
    },
    deleteComment(state, payload){
      if(payload.type === "subcomment"){
        return state.comments[payload.commentIndex].replies.splice(payload.subCommentIndex, 1);
      }else{
        return state.comments.splice(payload.commentIndex, 1);
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
