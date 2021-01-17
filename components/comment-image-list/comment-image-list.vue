<template>
	<view class="comment-image-list flex-row">
		<view class="image-item" v-for="(imgItem,imgIndex) in images" :key="imgIndex">
			<image :src="imgItem" mode=""></image>
			<image src="../../static/delete-image.png" mode="" class="delete-image" @tap="handleImagedelete(imgIndex)"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'commentImageList',
		props: {
			images: {
				type: Array,
				default: []
			}
		},
		methods: {
			// 移除图片
			handleImagedelete(index) {
				this.$emit('delete', index)
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment-image-list {
		height: 230rpx;

		.image-item {
			padding-top: 20rpx;
			padding-bottom: 24rpx;
			position: relative;

			image {
				width: 198rpx;
				height: 198rpx;
				margin-right: 40rpx;
				position: relative;
			}

			.delete-image {
				width: 32rpx;
				height: 32rpx;
				position: absolute;
				top: 8rpx;
				right: -18rpx;
				z-index: 999;
			}
		}
	}
</style>
