<template>
	<view class="vip-warn">
		<view class="pop-title">
			VIP用户有阅读该文的权限，快来成为VIP吧
		</view>
		<button type="default" @tap="linkToVipPage">我要成为VIP</button>
	</view>
</template>

<script>
	export default {
		methods: {
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
