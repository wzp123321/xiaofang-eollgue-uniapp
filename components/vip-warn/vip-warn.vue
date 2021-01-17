<template>
	<uni-popup ref="vip_popup" type="center" :maskClick="mask" style="z-index: 1;">
		<view class="vip-warn">
			<view class="pop-title">
				VIP用户有{{operation}}该文的权限，快来成为VIP吧
			</view>
			<button type="default" @tap="linkToVipPage">我要成为VIP</button>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			mask: {
				type: Boolean,
				default: false
			},
			operation: {
				type: String,
				default: '阅读'
			}
		},
		methods: {
			// 打开弹框
			setVipWarnShow(value) {
				if (value) {
					this.$refs.vip_popup.open()
				} else {
					this.$refs.vip_popup.close()
				}
			},
			// 跳转到购买vip页面
			linkToVipPage() {
				uni.navigateTo({
					url: '/pages/personal-module/vip-purchase/vip-purchase'
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.vip-warn {
		padding: 64rpx;
		border-radius: 12rpx;
		background: #fff;
		text-align: center;

		.pop-title {
			font-size: 30rpx;
			color: #333;
		}

		uni-button {
			width: 300rpx;
			font-size: 32rpx;
			color: #333;
			border-radius: 40rpx;
			background: #FCD002;
			margin-top: 48rpx;
		}
	}
</style>
