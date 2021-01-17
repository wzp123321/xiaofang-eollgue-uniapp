<template>
	<view class="comment-reply-user">
		<view class="comment-root-header flex-row">
			<userAvatar :headimage="commentInfo.criticImg" :width="36" :height="36"></userAvatar>
			<view class="username" @tap="linkToUserInfo(commentInfo.criticId)">
				{{commentInfo.criticName}}
			</view>
		</view>
		<!-- 锚点 -->
		<view :class="getClassName()">

		</view>
		<view class="replycomment-content">
			<text v-if="commentInfo.reCriticName">回复</text><text class="replyer" v-if="commentInfo.reCriticName">{{commentInfo.reCriticName}}</text>
			<text>{{commentInfo.comment}}</text>
		</view>
		<view v-if="commentInfo.images.length!==0" class="comment-image">
			<image v-for="(imgItem,imgIndex) in commentInfo.images" :key="imgIndex" :src="imgItem" mode="" @tap="handleImagesPreview(imgIndex)"></image>
		</view>
		<view class="comment-data flex-row-space">
			<view class="create-time">
				{{formatDate(commentInfo.createTime)}}
			</view>
			<view class="operation-icon flex-row">
				<!-- 已点赞 -->
				<view class="operation-item comment-support" v-if="detail.operation===1">
					<i class="icon iconzan_after" @tap="handleCommentCancelUp(commentInfo.id)"></i>
					<text>{{detail.supportCount}}</text>
				</view>
				<!-- 未点赞 -->
				<view class="operation-item" v-else>
					<i class="icon iconzan_before" @tap="handleCommentUp(commentInfo.id)"></i>
					<text>{{detail.supportCount}}</text>
				</view>
				<!-- 已点踩 -->
				<view class="operation-item comment-support" v-if="detail.operation===-1">
					<i class="icon iconcai_after" @tap="handleCommentCancelDown(commentInfo.id)"></i>
					<text>{{detail.opposeCount}}</text>
				</view>
				<!-- 未点踩 -->
				<view class="operation-item" v-else>
					<i class="icon iconcai_before" @tap="handleCommentDown(commentInfo.id)"></i>
					<text>{{detail.opposeCount}}</text>
				</view>
				<view class="operation-item">
					<i class="icon iconpinglun" @tap="handleCommentInputPopupShow(commentInfo)"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommentSupport,
		getCommentSupportCancel,
		getCommentOppose,
		getCommentOpposeCancel
	} from '../../service/comment.js'
	import userAvatar from '../user-avatar/user-avatar.vue'
	export default {
		props: {
			commentInfo: {
				type: Object
			}
		},
		components: {
			userAvatar
		},
		data() {
			return {
				detail: {}, //当前评论对象
			};
		},
		methods: {
			// 设置锚点类名
			getClassName() {
				return 'comment_' + this.commentInfo.id
			},
			// 格式化时间
			formatDate(time) {
				if (!time) {
					return ''
				}
				return this.$formateTime(time)
			},
			//点赞回调
			async handleCommentUp(id) {
				try {
					const res = await getCommentSupport(id)
					if (res) {
						uni.showToast({
							icon: 'success',
							title: '点赞成功'
						})
						this.detail = res
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '您已踩过该评论了'
					})
				}
			},
			// 取消点赞
			async handleCommentCancelUp(id) {
				const res = await getCommentSupportCancel(id)
				if (res) {
					uni.showToast({
						icon: 'success',
						title: '取消点赞成功'
					})
					this.detail = res
				}
			},
			// 点踩回调
			async handleCommentDown(id) {
				try {
					const res = await getCommentOppose(id)
					if (res) {
						icon: 'none',
						uni.showToast({
							icon: 'success',
							title: '点踩成功'
						})
						this.detail = res
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '您已赞过该评论了'
					})
				}
			},
			// 取消点踩
			async handleCommentCancelDown(id) {
				const res = await getCommentOpposeCancel(id)
				if (res) {
					uni.showToast({
						icon: 'success',
						title: '取消点踩成功'
					})
					this.detail = res
				}
			},
			// 评论
			handleCommentInputPopupShow(item) {
				this.$emit('child_reply', item)
			},
			// 跳转个人信息页面
			linkToUserInfo(id) {
				uni.navigateTo({
					url: '/pages/personal-module/personal-info/personal-info?id=' + id
				})
			},
			// 图片预览
			handleImagesPreview(current) {
				uni.previewImage({
					current,
					urls: this.commentInfo.images,
					fail() {
						uni.showToast({
							title: '获取图片异常',
							icon: 'none'
						})
					}
				})
			}
		},
		mounted() {
			this.detail = this.commentInfo
		}
	}
</script>

<style lang="less">
	.comment-root-header {
		color: #333333;
		margin: 27rpx 0;

		.username {
			line-height: 72rpx;
			margin-left: 20rpx;
		}
	}

	.comment-root-user {
		border-bottom: 2rpx solid #eee;
	}

	.replycomment-content {
		margin-bottom: 20rpx;
		word-break: break-all;

		.replyer {
			display: inline-block;
			padding: 0 12rpx;
			color: #333333;
			position: relative;
			bottom: 2rpx;
		}
	}

	.comment-image {
		padding: 10rpx 0;

		image {
			width: 198rpx;
			height: 198rpx;
			margin-right: 20rpx;
			border-radius: 6rpx;
		}
	}

	.comment-data {
		color: #666;
		line-height: 20rpx;
		font-size: 20rpx;
		padding-bottom: 28rpx;
		border-bottom: 2rpx solid #EDEDED;

		.operation-icon {
			.operation-item {
				margin-left: 49rpx;

				.icon {
					font-size: 22rpx;
				}
			}

			// 点赞
			.comment-support {
				color: #FCD002;
				animation-name: support;
				animation-duration: 300ms;
				animation-iteration-count: 1;
				animation-fill-mode: forwards;
			}


			@keyframes support {
				0% {
					transform: scale(1) rotateZ(0);
				}

				25% {
					transform: scale(1) rotateZ(15deg);
				}

				50% {
					transform: scale(1.3) rotateZ(0);
				}

				75% {
					transform: scale(1) rotateZ(-15deg);
				}

				100% {
					transform: scale(1) rotateZ(0);
				}
			}
		}
	}
</style>
