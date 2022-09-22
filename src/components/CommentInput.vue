<template>
    <div v-if="sm" :class="['bg-white', 'rounded-md', 'mb-3', 'h-auto', 'py-4', 'px-4', 'flex-col', {'sm:w-3/6': type === 'comment','w-11/12': type === 'comment', 'sm:w-6/6': type === 'subcomment', 'sm:ml-9': type === 'subcomment'}]" >
      <input v-model="commentContent" type="text" class="w-full mb-3 h-20 mr-3 border-solid border pl-3 pb-10 rounded-md placholder:text-slate-400 placeholder:text-xs border-slate-200" placeholder="Add a comment..." >
      <div class="flex justify-between w-full" >
        <img :src="require(`@/assets/images/avatars/image-juliusomo.png`)" class="w-8 h-8 mr-3">
        <button @click="addComment" class="rounded-md hover:bg-slate-300 bg-violet-600 text-white w-20 h-9 text-xs font-medium " >SEND</button>
      </div>
    </div>
    <div v-else :class="['bg-white', 'rounded-md','mb-3', 'h-auto', 'py-4', 'px-4', 'flex', {'sm:w-3/6': type === 'comment','w-11/12': type === 'comment', 'sm:w-6/6': type === 'subcomment', 'sm:ml-9': type === 'subcomment'}]" >
      <img :src="require(`@/assets/images/avatars/image-juliusomo.png`)" class="w-8 h-8 mr-3">  
      <input v-model="commentContent" type="text" class="w-10/12 h-20 mr-3 border-solid border pl-3 pb-10 rounded-md placholder:text-slate-400 placeholder:text-xs border-slate-200" placeholder="Add a comment..." >
      <button @click="addComment" class="rounded-md hover:bg-slate-300 bg-violet-600 text-white w-20 h-9 text-xs font-medium " >SEND</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export default {
    props:{
        type:{
            type: String,
            default: "comment"
        },
        commentId:{
            type: Number,
            default: 0
        },
        replyingTo:{
            type: String,
            required: false
        },
        superCommentId:{
            type: Number
        }
    },
    setup (props, context) {
        
        const store = useStore();
        const commentContent = ref("");
        const breakpoints = useBreakpoints(breakpointsTailwind);

        const sm = breakpoints.isSmallerOrEqual('sm');

        const addComment = () => {
            if(commentContent.value && !props.replyingTo){
                return store.commit("addComment", {id: props.commentId, 
                                                   content: {content: commentContent.value, 
                                                             createdAt: "1 second ago", 
                                                             score: 0, 
                                                             user: { image: { png: require("@/assets/images/avatars/image-juliusomo.png")}, 
                                                                              username: "juliusomo" }, 
                                                             replies:[]}})

            }else if(commentContent.value && props.replyingTo){
                return store.commit("addComment", {id: props.superCommentId, 
                                                   content: {content: commentContent.value, 
                                                             createdAt: "1 second ago", 
                                                             score: 0,
                                                             replyingTo: props.replyingTo,
                                                             user: { image: { png: require("@/assets/images/avatars/image-juliusomo.png")}, 
                                                                              username: "juliusomo" }, 
                                                             replies:[]}})
            }else{
                return;
            }
        }

        return {
            commentContent,
            addComment,
            sm
        }
    }
}
</script>

<style lang="scss" scoped>

</style>