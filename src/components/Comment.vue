<template>
    <article :class="['bg-white', 'sm:py-4', 'pb-4', 'px-4', 'sm:pr-20', 'rounded-md',{'sm:w-6/12': type === 'comment','w-11/12': type === 'comment', 'mb-2': type === 'comment', 'sm:ml-8': type === 'subcomment', 'mt-1': type === 'subcomment', 'mb-3': type === 'subcomment'} ]" >
      <div class="flex flex-col-reverse sm:flex-row w-full min-h-20 items-start" >
        <div class="flex w-full justify-between items-center" >
          <div class="flex sm:flex-col py-2 items-center mr-4 justify-between rounded-lg w-20 pl-2 pr-2 sm:w-10 sm:h-20 bg-slate-100" >
            <img @click="data.score++" class="cursor-pointer" src="@/assets/icon-plus.svg" alt="">
            <p class="text-cyan-700 font-bold text-xs sm:text-md" >{{data.score}}</p>
            <img @click="data.score--" class="cursor-pointer" src="@/assets/icon-minus.svg" alt="">
          </div>
          <div v-if="sm" :class="['flex', 'relative', 'sm:mt-0', 'sm:ml-0', 'w-full', 'justify-end', {'sm:w-1': type === 'comment', 'sm:w-2': type === 'subcomment'}]" >
                <div v-if="data.user.username === 'juliusomo'" @click="deleteComment" class="flex cursor-pointer" >
                  <img src="@/assets/icon-delete.svg" class="w-3 h-3" alt="">
                  <p class="text-rose-500 text-xs font-bold ml-1.5" >Delete</p>
                </div>
                <div @click="setTypeComment" v-if="data.user.username !== 'juliusomo'" class="flex cursor-pointer mr-3" >
                  <img src="@/assets/icon-reply.svg" class="w-3 sm:ml-5 h-3" alt="">
                  <p class="text-cyan-700 text-xs font-bold ml-1.5" >Reply</p>
                </div>
                <div v-else :class="['flex', 'cursor-pointer', 'mr-3']" @click="update = true" >
                  <img src="@/assets/icon-edit.svg" class="w-3 ml-5 h-3" alt="">
                  <p class="text-cyan-700 text-xs font-bold ml-1.5" >Edit</p>
                </div>
          </div>
        </div>
        <div class="flex flex-col mt-4 sm:mt-0 min-h-20 items-start w-full sm:min-w-full sm:pr-8" >
          <div class="flex w-full mb-3 justify-between">
            <div class="flex items-center" >
              <img :src="data.user.image.png" class="h-7 mr-3" alt="">
              <p class="text-cyan-900 mr-1 text-xs font-bold" >{{data.user.username}}</p>
              <div v-if="data.user.username === 'juliusomo'" class="flex justify-center items-center rounded-sm mr-3 h-4 w-6 bg-violet-600" >
                <p class="text-white text-xxs" >you</p>
              </div>
              <p class="text-xs text-slate-500" >{{data.createdAt}}</p>
            </div>
          </div>
          <div v-if="update === false" class="flex w-11/12" >
            <p  class="w-max text-sm text-slate-500 mb-3 sm:mb-0 sm:text-xs" >
              <span v-if="type === 'subcomment'" class="text-cyan-700 text-sm sm:text-xs" >@{{data.replyingTo}}</span>
              {{data.content}}
            </p>
          </div>
          <div v-else class="w-full pl-4 flex flex-col items-end sm:min-w-full" >
            <input v-model="updateComment" type="text"  class="w-full mb-2 h-20 mr-3 border-solid border pl-3 pb-10 rounded-md placeholder:text-slate-400 placeholder:text-xs border-slate-200" name="" id="">
            <button @click="editComment" class="rounded-md bg-violet-600 hover:bg-slate-300 mr-3  text-white w-20 h-9 text-xs font-medium " >UPDATE</button>
          </div>
        </div>
        <div v-if="!sm" :class="['flex', 'sm:mt-0', 'w-full', 'justify-end','mr-4', {'sm:w-1': type === 'comment', 'sm:w-2': type === 'subcomment'}]" >
                <div v-if="data.user.username === 'juliusomo'" @click="deleteComment" class="flex cursor-pointer" >
                  <img src="@/assets/icon-delete.svg" class="w-3 h-3" alt="">
                  <p class="text-rose-500 text-xs font-bold ml-1.5" >Delete</p>
                </div>
                <div @click="setTypeComment" v-if="data.user.username !== 'juliusomo'" class="flex cursor-pointer mr-3" >
                  <img src="@/assets/icon-reply.svg" class="w-3 sm:ml-5 h-3" alt="">
                  <p class="text-cyan-700 text-xs font-bold ml-1.5" >Reply</p>
                </div>
                <div v-else :class="['flex', 'cursor-pointer', 'mr-3']" @click="update = true" >
                  <img src="@/assets/icon-edit.svg" class="w-3 ml-5 h-3" alt="">
                  <p class="text-cyan-700 text-xs font-bold ml-1.5" >Edit</p>
                </div>
            </div>
      </div>
    </article>
    <div class="sm:w-3/6 w-11/12 sm:pl-9 pl-0 h-auto" >
      <slot></slot>
    </div>
    <CommentInput v-if="reply === true" :replyingTo="data.user.username" :superCommentId="commentId" :commentId="data.id" :type="typeComment" />
    <DeleteModal :open="openModal" @onDelete="onDeleteComment" />
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import CommentInput from './CommentInput.vue';
import DeleteModal from './DeleteModal.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

export default {
    props: {
        data: {
            type: Object,
            default: {
                id: 1,
                content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
                createdAt: "1 month ago",
                score: 12,
                user: {
                    image: {
                        png: require("@/assets/images/avatars/image-amyrobson.png")
                    },
                    username: "amyrobson"
                },
                replies: []
            }
        },
        type: {
            type: String,
            default: "comment"
        },
        commentIndex:{
          type: Number
        },
        subCommentIndex:{
          type: Number
        },
        commentId:{
          type:Number
        }
    },
    setup(props) {
        const reply = ref(false);
        const typeComment = ref("");
        const update = ref(false);
        const openModal = ref(false);
        const updateComment = ref(props.data.content)
        const store = useStore();

        const breakpoints = useBreakpoints(breakpointsTailwind);

        const sm = breakpoints.isSmallerOrEqual('sm');

        const setTypeComment = () => {
          if(props.type === "subcomment"){
            typeComment.value = "subcomment"
          }else{
            typeComment.value = "comment"
          }
          reply.value = true
        }

        const editComment = () => {
             store.commit("updateComment", {commentIndex: props.commentIndex, subCommentIndex: props.subCommentIndex, type: props.type, content: updateComment.value});
             update.value = false;
        }

        const onDeleteComment = () => {
          store.commit("deleteComment", {commentIndex: props.commentIndex, subCommentIndex: props.subCommentIndex, type: props.type});
          openModal.value = false;  
        }

        const deleteComment = () => {
          return openModal.value = true;
        }

        console.log(`Comentario tamanho: ${props.data.content.length}`);

        return {
            reply,
            setTypeComment,
            typeComment,
            update,
            updateComment,
            editComment,
            deleteComment,
            openModal,
            onDeleteComment,
            sm
        };
    },
    components: { CommentInput, DeleteModal }
}
</script>

<style scoped>
  .w-subcomment{
    width: 700%
  }
  .text-xxs{
    font-size: 0.6rem
  }
</style>