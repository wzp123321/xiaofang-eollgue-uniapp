<template>
	<view class="same-origin-item" @tap="toContent">
		<view class="same-origin-item-title">{{ item.title }}</view>
		<view class="same-origin-item-subtitle">
			<view class="same-origin-item-subtitle-normsNo">编号: {{ item.normsNo }}</view>
			<view class="same-origin-item-subtitle-from">{{ item.normsRegion || '标准' }}</view>
		</view>
		<view class="same-origin-item-content">
			<view class="same-origin-item-content-item">
				<view class="content" v-html="item.content"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		highLight() {},
		toContent() {
			uni.navigateTo({
				url: '/pages/np-content/np-content?normsNo=' + this.item.normsNo + '&chaptersNo=' + this.item.chaptersPid + '&tap=' + this.item.chaptersNo
			})
		}
	}
};
</script>

<style scoped lang="less">
.same-origin-item {
	background-color: #ffffff;
	box-shadow: 0px 6px 33px 0px rgba(124, 124, 124, 0.18);
	border-radius: 12rpx;
	padding: 27rpx 20rpx;
	box-sizing: border-box;
	margin-top: 36rpx;
	&-title {
		font-size: 32rpx;
		line-height: 45rpx;
		color: #333333;
	}
	&-subtitle {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999999;
		margin: 14rpx 0 0;
	}
	&-content {
		display: flex;
		flex-direction: column;
		&-item {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #ededed;
			color: #333333;
			line-height: 40rpx;
			font-size: 28rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			box-sizing: border-box;
			&.last {
				border-bottom: none;
			}
		}
	}
}
.high-light {
	color: #fcd002;
}
.content {
	overflow: hidden;
}
</style>
