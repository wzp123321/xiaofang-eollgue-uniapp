<template>
	<uniPopup type="bottom" ref="sharePopup">
		<view class="share-module">
			<image src="../../static/close.svg" mode="" class="close-image" @tap="handleSharePopClose"></image>
			<view class="title">
				分享到
			</view>
			<image src="../../static/weixin-share.png" mode="" class="weixin-share" @tap="handleShareWeixin"></image>
			<view class="descritpion">
				微信好友
			</view>
		</view>
	</uniPopup>
</template>

<script>
	import {
		handleWeixinShare
	} from '../../service/index.js'
	import {
		getShareinterpretation
	} from '../../service/normsInterpretation.js'
	import {
		shareClause
	} from '../../service/normative.js'
	// 配置
	import {
		shareGuideUrl
	} from '../../common/index.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		props: {
			// 分享类型 0-规范  1-解读
			shareType: {
				type: Number,
				default: 1
			},
			// 分享回调的入参
			shareData: {
				type: Object,
				default: () => {}
			},
			// 分享配置
			shareConfig: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			// 显示 - 隐藏
			setSharePopupShow(value) {
				if (value) {
					this.$refs.sharePopup.open()
				} else {
					this.$refs.sharePopup.close()
				}
			},
			// 关闭
			handleSharePopClose() {
				this.setSharePopupShow(false);
			},
			/**
			 * 分享
			 */
			async handleShareWeixin() {
				// imageUrl只能用https
				const {
					type,
					title,
					visitUrl,
					coverUrl,
					summary
				} = this.shareConfig
				const {
					id
				} = this
				const href = `${shareGuideUrl}?type=${type}&url=${visitUrl}`
				console.log(href)
				try {
					// 分享回调
					const {
						shareData
					} = this
					const shareRes = this.shareType === 0 ? await shareClause(shareData) : await getShareinterpretation(
						shareData.id)
					console.log('shareRes------------------------', shareRes)
					const res = await handleWeixinShare(title, coverUrl, href, summary)
					this.setSharePopupShow(false)

				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '分享失败'
					})
				}
			}
		}
	}
</script>

<style lang="less">
	// 分享弹框
	.share-module {
		position: relative;
		padding: 24rpx;
		background-color: white;
		border-radius: 16rpx 16rpx 0 0;
		min-height: 300rpx;
		text-align: center;
		font-size: 26rpx;
		color: #666666;

		.close-image {
			width: 23rpx;
			height: 23rpx;
			position: absolute;
			top: 28rpx;
			right: 24rpx;
		}

		.title {
			color: #333;
			font-size: 34rpx;
			font-weight: 500;
			margin-bottom: 40rpx;
		}

		.weixin-share {
			width: 82rpx;
			height: 82rpx;
			border-radius: 50%;
		}
	}
</style>
