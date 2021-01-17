<template>
	<!-- 评论列表弹框 -->
	<view class="comment-list-popup">
		<uni-popup ref="create_popup" type="bottom" :maskClick="false">
			<view class="comemnt-list-data">
				<!-- 关闭按钮 -->
				<image class="close-ico" src="../../static/close.svg" mode="" @tap="hide"></image>
				<view class="comment-scroll-view" ref="comment_scroll">
					<!-- 总条数 -->
					<view class="comment-total">
						全部{{total+feaTotal}}条评论
					</view>
					<view class="comment-data-list flex-column-space">
						<scroll-view scroll-y="true" class="scoll-wrapper" :scroll-top="scrollTopData">
							<!-- 精选评论 -->
							<view class="featured-comment-list" v-if="feaTotal>0">
								<view class="title">
									精选评论({{feaTotal}})
								</view>
								<view class="comment-item" v-for="(item,index) in featuredCommentList" :key="index">
									<commentItem :commentInfo="item" @child_reply="handleCommentInputPopupShow"></commentItem>
									<!-- 回复 -->
									<replyComment style="padding-left: 68rpx;" :commentChildren="item.children" @child_reply="handleCommentInputPopupShow"></replyComment>
								</view>
							</view>

							<!--头部阴影占位图-->
							<view class="individ-placeholder-view" v-if="feaTotal>0"></view>

							<!-- 全部评论 -->
							<view class="featured-comment-list all-comment-list" v-if="total>0">
								<view class="title">
									评论({{total}})
								</view>
								<view class="comment-item" v-for="(item,index) in commentList" :key="index">
									<commentItem :commentInfo="item" @child_reply="handleCommentInputPopupShow"></commentItem>
									<!-- 回复 -->
									<replyComment style="padding-left: 68rpx;" :commentChildren="item.children" @child_reply="handleCommentInputPopupShow"></replyComment>
								</view>
								<!-- 加载更多 -->
								<view class="load-more" @tap="handleLoadMoreComment" v-if="total>=(page*10)">
									查看更多
								</view>
							</view>
							<!-- 缺省 -->
							<view v-if="JSON.stringify(featuredCommentList) ==='[]' && JSON.stringify(commentList) ==='[]'" class="no-data">
								<text>暂无评论，期待您的精彩评论</text>
							</view>
						</scroll-view>
						<view class="input-module flex-row">
							<view class="input flex-row" @tap="handleCommentInputPopupShow({})">
								<image src="/static/comment-ico.svg" mode=""></image>
								<text>我来说一下</text>
							</view>
							<image src="/static/sendmsg.svg" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 评论弹框 -->
		<uni-popup ref="comment_popup" type="bottom">
			<view class="comment-input-wrap">
				<image class="close-image" src="../../static/close.svg" mode="" @tap="handleCommentInputClose"></image>
				<!-- 针对评论进行评论 -->
				<view class="user-comment-input">
					<view v-if="JSON.stringify(replyInfo) !=='{}'" class="header flex-row">
						<text>评论给</text>
						<view class="username">
							{{replyInfo.criticName}}
						</view>
					</view>
					<textarea type="text" v-model="comment" :focus="true" ref='comment_content' :placeholder="JSON.stringify(replyInfo) !=='{}' ? '输入评论内容，最多100字。':'输入评论内容，最多300字。'"
					 :maxlength="JSON.stringify(replyInfo) !=='{}' ? 100 : 200" style="width: 340px;height:100px;word-break: break-all;font-size: 16px;"
					 :auto-height="true" />
					<!-- 图片展示 -->
					<commentImageList :images="images" @delete="handleUploadImageDelete"></commentImageList>
					<view class="operation flex-row-space">
						<image :style="{'z-index':JSON.stringify(replyInfo) ==='{}'?'1':'-1'}" src="../../static/upload.png" mode="" @tap="handleImageChoose"></image>
						<view class="submit" @tap="handleUserComment">
							发布
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		handleFileUpload
	} from '../../service/index.js'
	import replyComment from '../comment-reply/comment-item.vue'
	import uniPopup from '../uni-popup/uni-popup.vue';
	import commentImageList from '../comment-image-list/comment-image-list.vue'
	import commentItem from '../comment-item/comment-item.vue'
	import userAvatar from '../user-avatar/user-avatar.vue'
	export default {
		props: {
			// 精选评论
			featuredCommentList: {
				type: Array,
				default: () => []
			},
			// 评论
			commentList: {
				type: Array,
				default: () => []
			},
			// 上传的图
			images: {
				type: Array,
				default: () => []
			},
			// 总数
			total: {
				type: Number,
				default: () => 0
			},
			// 精选评论总数
			feaTotal: {
				type: Number,
				default: 0
			},
			// 页码
			page: {
				type: Number,
				default: () => 0
			},
			// 当前定位的评论id
			curCommentId:{
				type:String | Number,
				default:''
			}
		},
		components: {
			uniPopup,
			replyComment,
			commentImageList,
			userAvatar,
			commentItem
		},
		data() {
			return {
				replyInfo: {}, // 被评论的评论信息
				comment: '', // 评论内容
				uploadImages: [], // 评论时上传的图片
				isShow:false,
				scrollTopData:0
			};
		},
		methods: {
			// 格式化时间
			formatDate(time) {
				if (!time) {
					return ''
				}
				return this.$formateTime(time)
			},
			// 跳转个人信息页面
			linkToUserInfo(id) {
				uni.navigateTo({
					url: '/pages/personal-module/personal-info/personal-info?id=' + id
				})
			},
			// 显示
			show() {
				this.$refs.create_popup.open();
				this.isShow = true
			},
			// 隐藏
			hide() {
				this.$refs.comment_popup.close()
				this.$refs.create_popup.close();
				this.isShow = false
				console.log(121212)
				this.$emit('hideTan')
			},
			// 评论输入框弹框
			handleCommentInputPopupShow(replyInfo) {
				this.replyInfo = replyInfo;
				this.comment = ''
				this.$emit('setImages')
				this.$refs.comment_popup.open();
			},
			// 评论弹框关闭
			handleCommentInputClose() {
				this.$refs.comment_popup.close();
			},
			// 上传图片
			handleImageChoose() {
				this.$emit('upload')
			},
			// 删除图片
			handleUploadImageDelete(index) {
				this.$emit('delete', index)
			},
			// 发布评论
			handleUserComment() {
				const {
					id
				} = this.replyInfo
				if (!this.comment) {
					uni.showToast({
						icon: 'none',
						title: '评论内容不能为空'
					})
				}
				const newComment = this.$changeEmoji(this.comment)
				console.log('newComment--------------------------', newComment)
				const params = {
					parentId: id,
					comment: newComment
				}
				this.comment = ''
				this.$emit('comment', params)
			},
			// 加载更多
			handleLoadMoreComment() {
				this.$emit('load-more')
			}
		},
		// 初始化是否需要定位
		mounted() {
			
		},
		watch: {
			isShow:function(newVal,oldVal){
				let idx = 0
				if(this.commentList && this.commentList.length){
					this.commentList.forEach((item,index)=>{
						if(item.id === this.curCommentId){
							idx = index
						}
					})
				}
				
				if(newVal && this.curCommentId){
						const className = 'comment_'+this.curCommentId;
						setTimeout(() => {
							uni.createSelectorQuery().select(`.${className}`).boundingClientRect(data => { //目标位置的节点：类或者id
								console.log("data",data)
								uni.createSelectorQuery().select(".comment-scroll-view").boundingClientRect(res => { //最外层盒子的节点：类或者id
									console.log(data, res)
									if (data && res) {
										const len = this.featuredCommentList ? this.featuredCommentList.length : 0
										this.scrollTopData = (idx+len)*24
									}
								}).exec()
							}).exec();
						}, 1000)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment-list-popup {
		position: relative;

		.comemnt-list-data {
			position: relative;
			background: #fff;
			padding-top: 28rpx;
			border-radius: 18rpx 18rpx 0 0;
			-webkit-overflow-scrolling: touch;

			.close-ico {
				width: 23rpx;
				height: 23rpx;
				position: absolute;
				top: 44rpx;
				right: 28rpx;
			}

			.comment-total {
				font-size: 36rpx;
				color: #333;
				font-weight: 550;
				text-align: center;
			}

			.comment-data-list {
				max-height: 620px;
				min-height: 620px;

				.scoll-wrapper {
					max-height: 580px;
					min-height: 580px;

					.all-comment-list {
						margin-top: 20rpx;
						padding: 20rpx 28rpx 0 28rpx !important;

						.load-more {
							text-align: right;
							font-size: 24rpx;
							color: #3F88E7;
							padding: 15rpx 0;
						}
					}

					.no-data {
						max-height: 580px;
						min-height: 580px;
						font-size: 24rpx;
						color: #666;
						text-align: center;

						text {
							display: inline-block;
							margin-top: 150rpx;
						}
					}

					// 精选
					.featured-comment-list {
						background-color: #fff;
						padding: 0 28rpx;

						.title {
							font-size: 32rpx;
							color: #333;
							border-left: 6rpx solid #FCD002;
							padding-left: 10rpx;
							font-weight: 550;
						}

						.comment-item {
							font-size: 28rpx;
							color: #666;
							line-height: 48rpx;

							image {
								width: 48rpx;
								height: 48rpx;
								border-radius: 40rpx;
								margin-right: 20rpx;
							}
						}
					}

					.individ-placeholder-view {
						width: 100%;
						height: 20rpx;
						background-color: #f4f5f7;
					}
				}

				scroll-view ::-webkit-scrollbar {
					width: 0;
					height: 0;
					background-color: transparent;
				}

				.input-module {
					font-size: 32rpx;
					color: #999;
					padding: 18rpx 28rpx;
					border-top: 2rpx solid #CCCCCC;

					.input {
						width: 609rpx;
						height: 60rpx;
						line-height: 60rpx;
						border-bottom: 2rpx solid #CCCCCC;

						image {
							width: 32rpx;
							height: 32rpx;
							margin-right: 10rpx;
							margin-top: 14rpx;
						}
					}

					image {
						width: 60rpx;
						height: 60rpx;
						margin-left: 22rpx;
					}
				}
			}
		}

		// 评论输入弹框
		.comment-input-wrap {
			position: relative;
			border-radius: 18rpx 18rpx 0 0;
			background-color: #fff;

			padding: 40rpx 28rpx 37rpx 28rpx;

			.close-image {
				width: 23rpx;
				height: 23rpx;
				position: absolute;
				top: 40rpx;
				right: 28rpx;
				z-index: 999;
			}

			.user-comment-input {
				font-size: 24rpx;

				.header {
					color: #666;
					margin-bottom: 26rpx;

					.username {
						color: #333333;
						margin-left: 12rpx;
					}
				}

				uni-input {
					color: #999;
				}

				.image-wrapper {
					height: 332rpx;
				}

				.operation {
					font-size: 32rpx;
					color: #FCD002;

					image {
						width: 42rpx;
						height: 42rpx;
					}
				}
			}
		}
	}
</style>
