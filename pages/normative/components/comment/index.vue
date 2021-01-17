<template>
	<view class="comment-item" :class="{ islast: isLast }">
		<view class="comment-item-info">
			<view class="comment-item-info-avator" @tap="linkToUserInfo">
				<image class="comment-item-info-avator-img" :src="detail.criticImg || '/static/normative/avator.png'"></image>
			</view>
			<view class="comment-item-info-name">
				<view class="comment-item-info-name-username" @tap="linkToUserInfo">{{ detail.criticName }}</view>
				<view class="comment-item-info-name-date">{{ detail.createTime }}</view>
			</view>
		</view>
		<view class="comment-item-content">
			<view class="comment-item-content-title" @tap="toContent">{{ '《'+ detail.normsTitle+ '》' || ''}}——{{ detail.chapterTitle || '' }}
				<em v-html="getContent(detail.clauseContent)"></em>
			</view>
			<view class="comment-item-content-precontent">
				<text @tap="toContent">{{ getComment() }}</text>
				<text v-if="hasLong" style="color:#06a5ff;display: inline-block;margin-left: 8rpx;" @click="commentShow">{{show ?'展开全文' :'收起'}}</text>
			</view>
			<view class="comment-item-content-preimg" :class="{ single: detail.images && detail.images.length === 1 }">
				<image @tap="previewImg(idx)" :class="{ single: detail.images && detail.images.length === 1 }" mode="aspectFill"
				 :src="img || '/static/normative/preview.png'" v-for="(img, idx) in detail.images" class="comment-item-content-preimg-img"
				 :key="'img_url_' + idx"></image>
			</view>
			<view class="comment-item-content-actions" v-if="hasAction">
				<view :animation="animationDataZan" class="comment-item-content-actions-item icon" :class="{ iconzan_before: detail.operation !== 1, 'iconzan_after active': detail.operation === 1 }"
				 @tap="zanHandler">
					{{ detail.supportCount }}
				</view>
				<view :animation="animationDataCai" class="comment-item-content-actions-item icon" :class="{ iconcai_before: detail.operation !== -1, 'iconcai_after active': detail.operation === -1 }"
				 @tap="caiHandler">
					{{ detail.opposeCount }}
				</view>
				<view class="comment-item-content-actions-item icon iconpinglun">{{ detail.childrenCount }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchCai,
		fetchZan
	} from '../../../../service/normative.js';
	export default {
		data() {
			return {
				detail: {},
				animationDataZan: {},
				animationDataCai: {},
				show: true
			};
		},
		props: {
			count: {
				type: Number,
				default: () => 3
			},
			isLast: {
				type: Boolean,
				default: () => false
			},
			hasAction: {
				type: Boolean,
				default: () => false
			},
			item: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			hasLong: function() {
				return this.item.comment.length >= 130
			}
		},
		methods: {
			// 获取内容
			getContent(str) {
				if (str) {
					return str
						.replace(/<\[^<>\]+>/g, "")
						.replace(/ /gi, "");
				}
			},
			// 展开收起
			commentShow() {
				this.show = !this.show
			},
			// 获取评论
			getComment() {
				return this.show ? this.item.comment.substring(0, 120) + '...' : this.item.comment
			},
			toContent() {
				// 区分解读
				if (this.item.category === 1) {
					if (this.item.normsNo && this.item.chaptersNo) {
						uni.navigateTo({
							url: '/pages/np-content/np-content?normsNo=' + this.item.normsNo + '&chaptersNo=' + this.item.chaptersNo +'&chaptersPid=' + this.item.chaptersPid +
								'&tap=' + this.item.chaptersNo +
								'&clauseNo=' + this.item.clauseNo + "&commentId=" + this.item.id
						})
					}
				} else {
					uni.navigateTo({
						url: `/pages/normative-interpretation/normative-interpretation-info/normative-interpretation-info?id=${this.item.interpretationId}&commentId=${this.item.id}`
					})
				}

			},
			/**
			 * 跳转个人信息页面
			 */
			linkToUserInfo() {
				const id = this.detail.criticId
				uni.navigateTo({
					url: '/pages/personal-module/personal-info/personal-info?id=' + id
				})
			},
			previewImg(idx) {
				uni.previewImage({
					current: idx,
					urls: this.detail.images,
					fail() {
						uni.showToast({
							title: '获取图片异常',
							icon: 'none'
						})
					}
				})
			},
			// 赞
			async zanHandler() {
				if (this.detail.id) {
					try {
						const res = await fetchZan(this.detail.id);
						if (res) {
							if (this.detail.operation !== 1) {
								this.detail = Object.assign({}, this.detail, res)
								this.addAnimateZan()
								setTimeout(() => {
									this.animationDataZan = {}
								}, 300)
							}
						}
					} catch (e) {
						uni.showToast({
							title: e.data.message,
							icon: 'none',
							position: 'bottom'
						})
					}

				}
			},
			// 踩
			async caiHandler() {
				if (this.detail.id) {
					try {
						const res = await fetchCai(this.detail.id);
						if (res) {
							if (this.detail.operation !== -1) {
								this.detail = Object.assign({}, this.detail, res)
								this.addAnimateCai()
								setTimeout(() => {
									this.animationDataCai = {}
								}, 300)
							}
						}
					} catch (e) {
						uni.showToast({
							title: e.data.message,
							icon: 'none',
							position: 'bottom'
						})
					}
				}
			},
			// 创建动画
			animation() {
				const animate = uni.createAnimation({
					duration: 200,
					timingFunction: 'linear',
					delay: 0
				})
				this.animate = animate
			},
			// 点赞的动画
			addAnimateZan() {
				if (!this.animate) return
				this.animate.scale(1.3).rotateZ(-15).step()
				this.animate.rotateZ(15).step()
				this.animate.scale(1).rotateZ(0).step()
				this.animationDataZan = this.animate.export()
			},
			// 点踩的动画
			addAnimateCai() {
				if (!this.animate) return
				this.animate.scale(1.3).rotateZ(-15).step()
				this.animate.rotateZ(15).step()
				this.animate.scale(1).rotateZ(0).step()
				this.animationDataCai = this.animate.export()
			}
		},
		mounted() {
			this.detail = this.item
			this.animation()
		}
	};
</script>

<style lang="less" scoped>
	.comment-item {
		display: flex;
		padding: 32rpx 0 16rpx;
		border-bottom-width: 1rpx;
		border-color: #ededed;
		border-style: solid;
		flex-direction: column;
		border-top-width: 0;
		border-right: 0;
		border-left-width: 0;

		&.islast {
			padding-bottom: 0;
			border-bottom: 0;
		}

		&-info {
			display: flex;
			justify-content: flex-start;
			flex-direction: row;

			&-avator {
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				// background: #007aff;
				overflow: hidden;

				&-img {
					width: 72rpx;
					height: 72rpx;
				}
			}

			&-name {
				margin-left: 20rpx;

				&-username {
					font-size: 28rpx;
					line-height: 40rpx;
					font-weight: 400;
					color: #333330;
				}

				&-date {
					font-size: 20rpx;
					line-height: 28rpx;
					font-weight: 400;
					color: #666;
				}
			}
		}

		&-content {
			&-title {
				max-height: 80rpx;
				line-height: 40rpx;
				display: inline-block;
				font-size: 28rpx;
				margin: 20rpx 0 10rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;

				&::before {
					content: '评论';
					margin-right: 10rpx;
					color: #666;
				}
			}

			&-precontent {
				font-size: 24rpx;
				color: #666;
				line-height: 33rpx;
				font-weight: 400;
				margin: 10rpx 0;
				word-break: break-all;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			&-preimg {
				display: flex;
				justify-content: flex-start;
				flex-direction: row;
				flex-wrap: wrap;
				margin-right: -29rpx;

				&.single {
					margin-right: 0;
				}

				&-img {
					width: 197rpx;
					height: 197rpx;
					margin: 14rpx 28rpx 14rpx 0;

					&.single {
						margin: 14rpx 0;
						width: 100%;
						height: 287rpx;
					}
				}
			}

			&-actions {
				display: flex;
				padding: 18rpx 0;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				color: #9c9fa5;

				&-item {
					font-size: 24rpx;
					line-height: 33rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: row;

					&::before {
						font-size: 28rpx;
						margin-right: 10rpx;
					}

					&.active {
						color: #fcd002;
						// animation: ani 500ms linear forwards;
					}
				}
			}
		}
	}

	@keyframes ani {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.5);
		}

		70% {
			transform: scale(1.5) rotateZ(-15deg);
		}

		90% {
			transform: scale(1.5) rotateZ(15deg);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
