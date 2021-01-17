<template>
	<view class="welcome-images" :style="{'height':windowHeight+'px'}">
		<swiper class="swiper" :indicator-dots="false" @change="handleSwiperChange">
			<swiper-item v-for="(item,index) in images" :key="item">
				<image :src="item" mode=""></image>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				images: [
					'../../static/welcome/welcome_1.png',
					'../../static/welcome/welcome_2.png',
					'../../static/welcome/welcome_3.png',
					'../../static/welcome/welcome_4.png',
					'../../static/welcome/welcome_5.png',
					'../../static/welcome/welcome_6.png'
				],
				windowHeight: 600,
			}
		},
		methods: {
			// swiper切换
			handleSwiperChange(e) {
				if (e.detail.current === this.images.length-1) {
					uni.setStorageSync('xf_first_install', true)
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index/index'
						})
					}, 300)
				}
			}
		},
		onShow() {
			const sysInfo = uni.getSystemInfoSync()
			this.windowHeight = sysInfo.windowHeight
			const isFirst = uni.getStorageSync('xf_first_install') || false
			if (isFirst) {
				this.images = []
				uni.switchTab({
					url: '/pages/normative/index'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.welcome-images {
		position: relative;
		width: 100%;
		height: 600px;
		z-index: 999;

		.swiper {
			position: relative;
			width: 100%;
			height: 100%;
			border: 1px solid #eee;

			swiper-item {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
