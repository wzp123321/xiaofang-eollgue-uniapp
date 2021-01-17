<template>
	<view :class="['entry-module', 'flex-row',{'has-border':hasBorder}]" @tap="linkToModuleInfo(moduleInfo.url)">
		<image :src="moduleInfo.imgUrl" mode=""></image>
		<view class="title">
			{{moduleInfo.title}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			moduleInfo: {
				type: Object,
				default: {}
			},
			hasBorder: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			// 跳转到响应模块页面
			linkToModuleInfo(url) {
				if (!url) {
					const that = this
					uni.showModal({
						title: '退出登录',
						content: '你确认退出登录吗?',
						success: (res) => {
							if (res.confirm) {
								that.logout()
							} else if (res.cancel) {

							}
						}
					})
				}
				uni.navigateTo({
					url
				})
			},
			logout() {
				// #ifdef APP-PLUS
				getApp().globalData.weixinAuth.logout((success) => {
					uni.removeStorageSync('Authorization')
					uni.removeStorageSync('xf_userInfo')
				})
				uni.removeStorageSync('Authorization')
				uni.removeStorageSync('xf_userInfo')
				uni.reLaunch({
					url: '/pages/login/index/index'
				})
				// #endif
				// #ifdef H5
				uni.removeStorageSync('Authorization')
				uni.removeStorageSync('xf_userInfo')
				uni.reLaunch({
					url: '/pages/login/index/index'
				})
				// #endif
			}
		}
	}
</script>

<style lang="less" scoped>
	.entry-module {
		position: relative;
		padding: 33upx 0;
		font-size: 28upx;
		margin: 0 28upx;
		color: #333;

		image {
			width: 28upx;
			height: 28upx;
			margin-right: 8upx;
			position: relative;
			top: 4upx;
		}

		&::after {
			font-family: "iconfont" !important;
			font-size: 48upx;
			font-style: normal;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			content: '\e653';
			position: absolute;
			top: 34upx;
			right: 0;
		}
	}

	.has-border {
		border-bottom: 2rpx solid #EDEDED;
	}
</style>
