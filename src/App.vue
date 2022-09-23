<template>
  <Comment v-for="(comment, index) in comments" :data="comment" :commentId="comment.id" :commentIndex="index" :key="comment.id" >
    <div v-if="comment.replies" class="flex w-full h-auto mb-2" >
        <div class="flex flex-col justify-between h-auto w-full border-left-comment pl-3 sm:pl-1">
          <Comment type="subcomment" v-for="(subcomment, subcommentIndex) in comment.replies" :commentId="comment.id" :subCommentIndex="subcommentIndex" :commentIndex="index" :data="subcomment" :key="subcomment.id" />
        </div>
    </div>    
  </Comment>
  <CommentInput type="comment" />
</template>

<script>
import Comment from './components/Comment.vue';
import {ref} from "vue";
import { useStore } from 'vuex';
import CommentInput from './components/CommentInput.vue';
export default {
    setup() {
      const {state} = useStore();
      const comments = ref(state.comments);


      return {
        comments
      };
    },
    components: { Comment, CommentInput }
}
</script>

<style>
  #app {
    background-color: hsl(223, 19%, 93%);
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding-top: 70px;
    flex-direction: column;
    font-size: 1rem;
    width: 100%;
    }

    .border-left-comment{
      border-left: 3px solid #DEDDDD;
    }
</style>