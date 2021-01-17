<template>
	<view class="paper-item" :class="{ islast: isLast }" @tap="toDetail">
		<view class="paper-item-preview">
			<image mode="aspectFill" class="paper-item-preview-img" :src="detail.coverImage || '/static/normative/guifan.png'"></image>
		</view>
		<view class="paper-item-content">
			<view class="paper-item-content-title">{{detail.title}}</view>
			<view class="paper-item-content-subtitle">编号：{{ detail.normsNo }}</view>
			<view class="paper-item-content-pubdate">实施日期: {{detail.startDate}}</view>
			<view class="paper-item-content-date">
				<text>上传日期: {{ datetime(detail.createTime) }}</text>
				<text class="icon iconyueduliang views">{{ detail.pv }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		isLast: {
			type: Boolean,
			default: () => false
		},
		detail: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		toDetail() {
			uni.navigateTo({
				url: '/pages/np/np?normsNo=' + this.detail.normsNo + '&title=' + encodeURIComponent(this.detail.title)
			})
		},
		datetime(timestamp) {
			return this.$formatDateTime(timestamp)
		}
	}
};
</script>

<style lang="less" scoped>
.paper-item {
	padding: 28rpx 0;
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	border-bottom-width: 1rpx;
	border-bottom-color: #ededed;
	border-style: solid;
	border-top-width: 0;
	border-left-width: 0;
	border-right: 0;
}
.paper-item.islast {
	padding-bottom: 0;
	border-bottom: none;
}
.paper-item-preview {
	width: 200rpx;
	height: 212rpx;
	flex-shrink: 0;
}
.paper-item-preview-img {
	width: 200rpx;
	height: 212rpx;
}
.paper-item-content {
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}
.paper-item-content-title {
	height: 80rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.paper-item-content-title,
.paper-item-content-subtitle {
	word-break: break-all;
	word-wrap: break-word;
	font-size: 28rpx;
	font-weight: 500;
	width: 416rpx;
	line-height: 40rpx;
}
.paper-item-content-subtitle {
	color: #666;
	font-weight: 400;
	margin: 12rpx 0;
	line-height: 40rpx;
}
.paper-item-content-pubdate,
.paper-item-content-date {
	font-size: 20rpx;
	color: #999;
	font-weight: 400;
	line-height: 28rpx;
}
.paper-item-content-date {
	margin-top: 12rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.paper-item-content-date .views {
	font-size: 20rpx;
}
.paper-item-content-date .views::before {
	margin-right: 12rpx;
}
</style>
