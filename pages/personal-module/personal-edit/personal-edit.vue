<template>
	<view class="personal-info">
		<view class="user-avatar flex-row">
			<view class="avatar-wrapper" @tap="handleAvatarUpload">
				<image class="avatar" :src="userInfo.headimage" mode=""></image>
				<image class="edit" src="../../../static/personal/avatar-edit.png" mode=""></image>
			</view>
			<view class="info flex-column-space">
				<view class="vip-module flex-row">
					<image :src="userInfo.isvip===1?'../../../static/personal/vip-back.png':'../../../static/personal/no-vip-back.png'"></image>
					<text v-if="userInfo.isvip===1">{{userInfo.vipExpiresTime}}到期</text>
				</view>
				<view class="invitation-code">
					我的邀请码:{{userInfo.myinvitecode}}
				</view>
			</view>
		</view>
		<view class="module-title">
			基本资料
		</view>
		<view class="userinfo-module">
			<view class="item flex-row-space">
				<view class="info">
					<text>手机号</text>{{userInfo.phone}}
				</view>
				<view class="btn" @tap="handlePhonebind">
					{{userInfo.phone?'更改手机号':'绑定手机号'}}
				</view>
			</view>
			<view class="item flex-row">
				<text>用户名</text><input type="text" v-model="userInfo.nickname" @blur="handleUsernameCheck" /> <text class="nickname-tips">{{nickNameTips}}</text>
			</view>
			<view class="item flex-row-space">
				<text>性别</text>
				<picker @change="bindSexChange" :range="sexArray" :value="userInfo.sex-1">{{userInfo.sex===1?'男':'女'}}</picker>
			</view>
			<view class="item flex-row-space">
				<text>生日</text>
				<picker mode="date" @change="bindDateChange">{{userInfo.birthday}}</picker>
			</view>
			<view class="item flex-row">
				<text>工作职务</text><input type="text" v-model="userInfo.idstatus" placeholder="输入例如:建筑设计师、消防技术咨询、学生" @blur="handleUserInfoSub"
				 maxlength="20" />
			</view>
			<view class="item flex-row">
				<text>单位</text><input type="text" v-model="userInfo.company" @blur="handleUserInfoSub" maxlength="20" placeholder="请输入您的工作单位"/>
			</view>
			<view class="item flex-row">
				<text>居住地</text><input type="text" v-model="userInfo.livecity" @blur="handleUserInfoSub" maxlength="20" placeholder="请输入您的居住城市"/>
			</view>
			<view class="item flex-column">
				<text>个人介绍</text><input type="text" v-model="userInfo.introduction" @blur="handleUserInfoSub" placeholder="一句话介绍自己的职业或兴趣"
				 style="text-align: left;margin-top: 10rpx;color: #999;" maxlength="50" />
			</view>
			<view class="item flex-row-space">
				<text>是否公开</text>
				<switch :checked="userInfo.ispublic===1" @change="bindisOpenChange" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		submitUserInfo,
		checkUserNameExit,
		getUserInfo
	} from '../../../service/personal.js'
	import {
		handleUserAvatarUpload
	} from '../../../service/index.js'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				sexArray: ['男', '女'],
				nickNameTips: '', // 用户名校验提示
			};
		},
		computed: {
			...mapGetters(['userInfo']),
		},
		methods: {
			...mapActions(['setUserInfo']),
			// 上传头像
			handleAvatarUpload() {
				const {
					id
				} = this.userInfo
				const that = this
				uni.chooseImage({
					async success(e) {
						let filePath = e.tempFilePaths[0]
						let files = e.tempFiles
						const res = await handleUserAvatarUpload(id, filePath)
						if (res && res.data) {
							uni.showToast({
								icon: 'none',
								title: '头像修改成功'
							})
							const info = JSON.parse(res.data)
							that.userInfo.headimage = info.data
							that.setUserInfo(that.userInfo)
						}
					},
					fail() {
						uni.showToast({
							icon: 'none',
							title: '文件选取失败'
						})
					}
				})
			},
			// 跳转手机号绑定
			handlePhonebind() {
				uni.navigateTo({
					url: '../bind-phone/bind-phone'
				})
			},
			// 用户名校验
			async handleUsernameCheck() {
				this.nickNameTips = '';
				const {
					nickname
				} = this.userInfo
				const res = await checkUserNameExit(nickname)
				if (res) {
					this.submitUserInfo();
				} else {
					this.nickNameTips = '用户名已被占用，请修改';
				}
			},
			// 生日
			bindDateChange(e) {
				this.userInfo.birthday = e.detail.value
				this.submitUserInfo();
			},
			// 性别  1:男  2:女
			bindSexChange(e) {
				this.userInfo.sex = e.detail.value + 1
				this.submitUserInfo();
			},
			// 工作职务 单位 居住地 个人介绍修改
			handleUserInfoSub() {
				this.submitUserInfo()
			},
			// 是否公开选择
			bindisOpenChange(e) {
				if (e.detail.value) {
					uni.showToast({
						icon: 'none',
						title: '若公开则其它用户可看到您的所有个人信息，但手机号和微信 UID 不会公开',
					})
				}
				setTimeout(() => {
					this.userInfo.ispublic = e.detail.value ? 1 : 0
					this.submitUserInfo();
				}, e.detail.value ? 1500 : 0)
			},
			// 获取用户信息
			async getUserInfo() {
				uni.showLoading({
					title: '加载中'
				})
				const res = await getUserInfo();
				if (res) {
					let userInfo = res
					userInfo.vipExpiresTime = this.$formateTime(res.vipExpiresTime)
					this.setUserInfo(userInfo)
				}
				uni.hideLoading()
			},
			// 提交个人信息
			async submitUserInfo() {
				const {
					nickname,
					sex,
					birthday,
					idstatus,
					company,
					livecity,
					introduction,
					ispublic
				} = this.userInfo
				const res = await submitUserInfo({
					nickname,
					sex,
					birthday,
					idstatus,
					company,
					livecity,
					introduction,
					ispublic
				})
				if (res) {
					uni.showToast({
						icon: 'none',
						title: '修改成功'
					})
					// 重置token
					uni.setStorageSync('Authorization', res)
					this.getUserInfo()
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.personal-info {
		padding: 20rpx;
		position: relative;

		.user-avatar {
			font-size: 26rpx;
			color: #FF0000;

			.avatar-wrapper {
				position: relative;
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				background-color: rgba(0, 0, 0, .7);
				margin-right: 30rpx;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					z-index: -1;
				}

				.edit {
					width: 54rpx;
					height: 54rpx;
					z-index: 999;
					position: absolute;
					top: 36rpx;
					left: 36rpx;
				}

			}



			.info {
				padding: 20rpx 0;
				font-size: 24rpx;
				color: #333;

				image {
					width: 90rpx;
					height: 30rpx;
					margin-right: 10rpx;
					margin-top: 2rpx;
				}

				.vip-module text {
					display: inline-block;
					font-size: 20rpx;
					line-height: 34rpx;
					color: #999;
				}

			}
		}

		.module-title {
			font-size: 36rpx;
			color: #333;
			margin: 20rpx 10rpx;
			font-weight: bold;
		}

		.userinfo-module {
			font-size: 28rpx;
			color: #333;
			text-align: left;

			.item {
				position: relative;
				padding: 28rpx 40rpx 28rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				text {
					display: inline-block;
					width: 120rpx;
					margin-right: 40rpx;
					text-align: left;
				}

				uni-input {
					flex: 1;
					text-align: right;
					font-size: 24rpx;
				}

				.btn {
					color: #3F88E7;
				}

				uni-picker::after {
					font-family: "iconfont" !important;
					font-size: 36rpx;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					content: '\e653';
					position: absolute;
					top: 30rpx;
					right: 2rpx;
				}

				/deep/ .uni-switch-input-checked {
					background: #FCD002 !important;
					border: none !important;
				}

				.nickname-tips {
					position: absolute;
					width: 220rpx;
					bottom: 6rpx;
					right: 2rpx;
					color: #E31313;
					font-size: 20rpx;
				}
			}
		}
	}
</style>
