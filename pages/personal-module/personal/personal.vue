<template>
	<view class="user-info flex-column">
		<view class="user-info-logo flex-row">
			<image class="avatar-back" src="/static/personal/queen.png" mode=""></image>
			<image class="user-avatar" :src="userInfo.headimage || '/static/personal/default_avatar.png'" mode="" @tap="linkToInfo('/pages/personal-module/personal-edit/personal-edit')"></image>
			<view class="user-name" @tap="linkToInfo('/pages/personal-module/personal-edit/personal-edit')">
				{{userInfo.nickname}}
			</view>
			<view :class="['vip-module', 'flex-row-space',userInfo.isvip===1?'is-vip':'no-vip']">
				<view v-if="userInfo.isvip===1" class="flex-row">
					<image src="/static/personal/vip-ico.svg" mode=""></image>
					<text>
						VIP会员
					</text>
					<text class="enddate">
						{{userInfo.vipExpiresTime}}到期
					</text>
				</view>
				<view v-else>
					您还不是VIP会员
				</view>
				<view class="flex-row">
					<text class="vip-link">{{userInfo.isvip===1?'续费':'我要成为VIP'}}</text>
					<image src="../../../static/personal/vip-right.svg" mode="" @tap="linkToInfo('/pages/personal-module/vip-purchase/vip-purchase')"></image>
				</view>
			</view>
		</view>
		<view class="user-info-module">
			<view v-for="(item,index) in userModules" :key="index">
				<EntryModule :moduleInfo="item" :hasBorder="index!==2"></EntryModule>
				<view class="user-info-perch" v-if="index===2">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserInfo
	} from '../../../service/personal.js'
	import {
		userModules
	} from '../config/index.js'
	import EntryModule from './components/EntryItem.vue'
	import {
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				userModules,
				userInfo: {}
			};
		},
		components: {
			EntryModule
		},
		methods: {
			...mapActions(['setUserInfo']),
			linkToInfo(url) {
				uni.navigateTo({
					url
				})
			},
			// 获取用户信息
			async getUserInfo() {
				uni.showLoading({
					title: '加载中'
				})
				const res = await getUserInfo();
				if (res) {
					let userInfo = res;
					userInfo.vipExpiresTime = this.$formateTime(res.vipExpiresTime)
					this.userInfo = userInfo
					this.setUserInfo(userInfo)
					console.log(this.userInfo,this.$store.state.userModule)
				}
				uni.hideLoading()
			}
		},
		onShow() {
			this.getUserInfo();
		}
	}
</script>

<style lang="less" scoped>
	.user-info {
		height: 100%;

		&-logo {
			position: relative;
			background: #251E1E;
			padding: 26upx 28upx 123upx 28upx;
			color: #eee;
			font-size: 32upx;
			overflow: hidden;

			.user-avatar {
				width: 88upx;
				height: 88upx;
				border-radius: 50%;
				margin-right: 20upx;
				z-index: 2;
				margin-left: 3upx;
				margin-top: -3upx;
			}

			.avatar-back {
				position: absolute;
				width: 100upx;
				height: 100upx;
				top: 14upx;
				left: 28upx;
				z-index: 1;
			}

			.user-name {
				line-height: 96upx;
				font-size: 32upx;
				font-weight: bold;
			}

			.is-vip {
				color: #6F3F12;
				background: linear-gradient(to right, #F8F0C7, #FFBD59);
			}

			.no-vip {
				color: #666;
				background: #C9C9C9;
			}

			.vip-module {
				position: absolute;
				bottom: -16upx;
				left: 3.73%;
				width: 85.53%;
				padding: 28upx 26upx;
				border-radius: 20upx;
				font-size: 28upx;
				line-height: 40upx;


				image {
					width: 28upx;
					height: 28upx;
					position: relative;
					top: 6upx;
				}

				text {
					display: inline-block;
					margin: 0 6upx;
				}

				.enddate {
					font-size: 20upx;
				}

				.vip-link {
					font-size: 24upx;
				}
			}
		}

		&-module {
			.user-info-perch {
				width: 100%;
				height: 20rpx;
				background-color: #F8F8F8;
			}
		}
	}
</style>
