<template>
	<view class="no-data-wrap">
		<image src="/static/no-data.png" class="no-data-wrap-img" />
		<text class="no-data-wrap-txt">{{ message }}</text>
	</view>
</template>

<script>
	export default {
		props: {
			message: {
				type: String,
				default: () => "没有搜索结果",
			},
		},
	};
</script>

<style lang="less" scoped>
	.no-data-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		&-img {
			width: 323rpx;
			height: 203rpx;
			flex-shrink: 0;
		}

		&-txt {
			font-size: 28rpx;
			color: #999999;
			line-height: 36rpx;
			padding-top: 48rpx;
		}
	}
</style>
