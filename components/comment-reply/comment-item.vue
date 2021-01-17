<template>
	<view class="reply-content-wrapper">
		<view class="comment-reply-data" v-for="(item,index) in commentChildren" :key="index">
			<commentItem :commentInfo="item" @child_reply="handleCommentInputPopupShow"></commentItem>
			<replyComment v-if="item.children" :commentChildren="item.children" @child_reply="handleCommentInputPopupShow"></replyComment>
		</view>
	</view>
</template>

<script>
	import commentItem from '../comment-item/comment-item.vue'
	export default {
		name: 'replyComment',
		props: {
			commentChildren: {
				type: Array,
				default: []
			}
		},
		components: {
			commentItem
		},
		data() {
			return {

			};
		},
		methods: {
			// 评论
			handleCommentInputPopupShow(item) {
				this.$emit('child_reply', item)
			}
		}
	}
</script>
