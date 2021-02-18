<template>
	<view class="login-wrap" :style="{ height: contentHeight + 'px' }">
		<view class="login-wrap-logo">
			<image class="login-wrap-logo-img" src="/static/login/logo.png"></image>
			<text class="login-wrap-logo-txt">消防学院</text>
		</view>
		<view class="login-wrap-form">
			<view class="login-wrap-form-item">
				<view class="login-wrap-form-item-label">
					<image src="/static/svg/phone.svg" class="login-wrap-form-item-label-img"></image>
					<text class="login-wrap-form-item-label-txt">手机</text>
				</view>
				<view class="login-wrap-form-item-input">
					<view class="login-wrap-form-item-input-pre">
						<text>+{{ areaCode }}</text>
						<view class="icon iconjiantouarrow486" style="margin-left: 22rpx;" @tap="handleAreaCodeOpenClose('open')"></view>
					</view>
					<input placeholder="请输入手机号码" v-model="formData.phoneNumber" type="number" style="margin-left: 66rpx;"
					 placeholder-style="color: #929292" class="ipt" />
				</view>
			</view>
			<view class="login-wrap-form-item">
				<view class="login-wrap-form-item-label">
					<image src="/static/svg/code.svg" class="login-wrap-form-item-label-img"></image>
					<text class="login-wrap-form-item-label-txt">验证码</text>
				</view>
				<view class="login-wrap-form-item-input" style="justify-content: space-between; border-bottom: none">
					<view class="code-ipt"><input type="number" placeholder="请输入验证码" v-model="formData.code" class="ipt"
						 placeholder-style="color: #929292" /></view>
					<button class="btn" @tap="getCodeHandler" :class="{ disabled: isCountDown }" :disabled="isCountDown">
						{{ isCountDown ? countDownTime + '秒后重新获取' : '获取验证码' }}
					</button>
				</view>
			</view>
			<!-- 邀请码 -->
			<view class="login-wrap-form-item" v-if="!is_first_login">
				<view class="login-wrap-form-item-label">
					<image src="/static/svg/invitecode.svg" class="login-wrap-form-item-label-img"></image>
					<text class="login-wrap-form-item-label-txt">邀请码</text>
				</view>
				<view class="login-wrap-form-item-input">
					<input placeholder="请输入邀请码(非必填)" v-model="formData.invitecode" type="text" placeholder-style="color: #929292"
					 class="ipt" />
				</view>
			</view>
			<view class="login-wrap-form-item" style="margin-bottom: 36rpx;">
				<button class="login-wrap-form-item-submit" @tap="loginHandler" :disabled="!formData.phoneNumber">登录</button>
			</view>
		</view>
		<view class="login-wrap-reads">
			<view class="login-wrap-reads-icon icon iconweixuanzhong" @tap="agreeHandler">
				<view class="login-wrap-reads-icon-inerIcon icon iconxuanze" v-if="formData.isAgree" style="color:#FCD002;"></view>
			</view>
			<text class="login-wrap-reads-txt">
				我已阅读并同意
				<text style="color: #FCD002" @tap="linkToServiceAgreement(1)">《消防学院用户服务协议》</text>
				和
				<text style="color: #FCD002;" @tap="linkToServiceAgreement(0)">《隐私政策》</text>
			</text>
		</view>
		<!-- <view class="login-wrap-other">
			<view class="login-wrap-other-title">其他方式登录</view>
			<view class="login-wrap-other-btn">
				<image class="login-wrap-other-btn-wechat" src="/static/svg/wechat.svg" @click="weichatLogin"></image>
				<text class="login-wrap-other-btn-txt">微信登录</text>
			</view>
		</view> -->
		<!-- 地区编号弹框 -->
		<uniPopup type="bottom" ref="code_popup">
			<view class="login-wrap-area-code">
				<view class="login-wrap-area-code-header">地区编号</view>
				<image class="login-wrap-area-code-close" src="../../../static/close.svg" mode="" @tap="handleAreaCodeOpenClose('close')"></image>
				<scroll-view class="login-wrap-area-code-scroll" scroll-y="true">
					<view v-for="(areaItem,areaIndex) in areaCodes" :key="areaIndex" class="login-wrap-area-code-scroll-data flex-row-space"
					 @tap="handleAreaCodeChoose(areaItem.code)">
						<view class="title">
							{{areaItem.title}}
						</view>
						<view class="code">
							+{{areaItem.code}}
						</view>
					</view>
				</scroll-view>
			</view>
		</uniPopup>
	</view>
</template>

<script>
	import {
		wxLogin,
		wxLoginNative,
		getCode,
		getAuthorizationByPhoneCode
	} from '../../../service/login.js';
	import {
		getWeixinInfo
	} from '../../../service/index.js';
	import {
		getUserInfo
	} from '../../../service/personal.js';
	import {
		mapActions
	} from 'vuex';
	import {
		areaCodes
	} from '../../../common/index.js';

	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	let timer = null;
	const weixinOath = getApp().globalData.weixinAuth
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				contentHeight: 574,
				formData: {
					phoneNumber: '',
					code: '',
					isAgree: false
				},
				isCountDown: false,
				countDownTime: 60,
				areaCode: '86',
				hasInviteCode: '', // 已填邀请码
				areaCodes,
				clientId: '', // 设备id
				is_first_login: false,
			};
		},
		methods: {
			...mapActions(['setUserInfo']),
			// 跳转服务协议&隐私政策
			linkToServiceAgreement(type) {
				const url = type === 1 ? '/pages/service-argeement/service-argeement' : '/pages/privacy-policy/privacy-policy';
				uni.navigateTo({
					url
				});
			},
			// 打开地区弹框
			handleAreaCodeOpenClose(type) {
				if (type === 'open') {
					this.$refs.code_popup.open();
				} else {
					this.$refs.code_popup.close();
				}
			},
			// 地区选择
			handleAreaCodeChoose(code) {
				this.areaCode = code;
				this.$refs.code_popup.close();
			},
			// 获取用户信息
			async getUserInfo() {
				const res = await getUserInfo();
				if (res) {
					let userInfo = res;
					userInfo.vipExpiresTime = this.$formateTime(userInfo.vipExpiresTime);
					this.setUserInfo(userInfo);
				}
			},
			// 计算内容区域的高度
			async getContentHeight() {
				const sysInfo = uni.getSystemInfoSync();
				const query = uni.createSelectorQuery().in(this);
				const tabBar = query.select('.tab-bar');
				const tabbarNodeRes = await this.syncBoundingClientRect(tabBar);
				const pageHeight = sysInfo.windowHeight - sysInfo.statusBarHeight;
				this.contentHeight = pageHeight;
			},
			syncBoundingClientRect(nodeobj) {
				return new Promise((resolve, reject) => {
					nodeobj
						.boundingClientRect(data => {
							resolve(data);
						})
						.exec();
				});
			},
			// 微信登陆
			weichatLogin() {
				if (!this.formData.isAgree) {
					uni.showToast({
						title: '请先阅读条款并同意',
						icon: 'none',
						position: 'bottom'
					});
					return;
				}

				weixinOath.authorizeWeixin(success => {
					this.loginSuccess(success)
				})
				// weixinOath.loginSuccess = this.loginSuccess;
			},
			// 登录成功
			async loginSuccess(result) {
				console.log(result)
				const openid = result.authInfo.openid;
				const accessToken = result.authInfo.access_token;
				const clientId = this.clientId
				const wxLoginRes = await wxLogin(openid, accessToken, clientId);
				if (wxLoginRes.token) {
					uni.setStorageSync('Authorization', wxLoginRes.token);
					console.log(' wxLoginRes.token)', wxLoginRes.token)
					// 获取用户信息
					this.getUserInfo();
					// 如果已经进入过，则以后不进来了，除非删除app
					if (!wxLoginRes.isFirst) {
						uni.switchTab({
							url: '/pages/normative/index',
							animationType: 'pop-in'
						});
					} else {
						uni.navigateTo({
							url: '/pages/login/complete/complete?userInfo=' + encodeURIComponent(JSON.stringify(result.userInfo)),
							animationType: 'pop-in'
						});
					}
				}
			},
			// 获取验证码
			async getCodeHandler() {
				try {
					if (!this.formData.phoneNumber) {
						uni.showToast({
							title: '请输入手机号',
							icon: 'none'
						});
						return;
					}
					const res = await getCode(this.formData.phoneNumber);
					// 获取验证码成功，倒计时
					if (res) {
						this.countDown();
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
					}
				} catch (e) {
					//TODO handle the exception
					uni.showToast({
						title: e.data.message || '发送失败',
						icon: 'none'
					});
				}
			},
			// 点击验证码后，倒计时
			countDown() {
				// 如果存在定时，则不操作
				if (timer) {
					return;
				}
				this.isCountDown = true;
				timer = setInterval(() => {
					this.countDownTime -= 1;
					if (this.countDownTime === 0) {
						timer = null;
						this.isCountDown = false;
						this.countDownTime = 60;
					}
				}, 1 * 1000);
			},
			// 是否同意条款
			agreeHandler() {
				this.formData.isAgree = !this.formData.isAgree;
			},
			// 登录
			async loginHandler() {
				if (!this.formData.phoneNumber) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.isAgree) {
					uni.showToast({
						title: '请先阅读条款并同意',
						icon: 'none'
					});
					return;
				}
				try {
					const res = await getAuthorizationByPhoneCode({
						phone: this.formData.phoneNumber,
						valicode: this.formData.code,
						invitecode: this.formData.invitecode,
						clientId: this.clientId
					});
					if (res.token) {
						uni.setStorageSync('Authorization', res.token);
						uni.setStorageSync('is_first_login', true);
						// 获取用户信息
						this.getUserInfo();
						// 如果已经填过了邀请码，本地存储
						if (res.hasInviteCode) {
							uni.setStorageSync('hasInviteCode', res.hasInviteCode);
						}
						// 如果已经进入过，则以后不进来了，除非删除app
						if (!res.isFirst) {
							uni.switchTab({
								url: '/pages/normative/index',
								animationType: 'pop-in'
							});
						} else {
							uni.navigateTo({
								url: '/pages/login/complete/complete?phoneNumber=' + this.formData.phoneNumber,
								animationType: 'pop-in'
							});
						}
					}
				} catch (e) {
					//TODO handle the exception
					uni.showToast({
						title: e.data.message,
						icon: 'none'
					});
				}
			},
			checkWeixin() {
				// #ifdef APP-PLUS
				return plus.runtime.isApplicationExist({
					pname: 'com.tencent.mm',
					action: 'weixin://'
				})
				console.log(plus.runtime.isApplicationExist({
					pname: 'com.tencent.mm',
					action: 'weixin://'
				}))
				// #endif
			}
		},
		onReady() {
			this.$nextTick(() => {
				// 判断是否显示过欢迎语
				const isInstall = uni.getStorageSync('xf_first_install')
				if(!isInstall){
					uni.navigateTo({
						url:'/pages/welcome/welcome'
					})
				}
				
				// #ifdef APP-PLUS
				let info = plus.push.getClientInfo();
				this.clientId = info.clientid;
				// #endif
				this.getContentHeight();
				this.hasInviteCode = uni.getStorageSync('hasInviteCode') || '';
				this.is_first_login = uni.getStorageSync('is_first_login') || false;
			});
		}
	};
</script>

<style lang="less" scoped>
	.login-wrap {
		height: 100px;
		padding-top: 123rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		box-sizing: border-box;

		&-logo {
			width: 150rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			text-align: center;

			&-img {
				width: 150rpx;
				height: 150rpx;
				flex-shrink: 0;
			}

			&-txt {
				font-size: 32rpx;
				font-weight: 600;
				color: #fcd002;
				line-height: 45rpx;
				margin-top: 12rpx;
			}
		}

		&-form {
			padding: 47rpx 28rpx 0;
			width: 100%;
			box-sizing: border-box;
			flex-shrink: 0;

			&-item {
				display: flex;
				flex-direction: column;
				margin-bottom: 60rpx;

				&-label {
					display: flex;
					justify-content: flex-start;
					flex-direction: row;
					align-items: center;
					flex-shrink: 0;

					&-img {
						width: 36rpx;
						height: 36rpx;
					}

					&-txt {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #333;
						margin-left: 15rpx;
						font-weight: 400;
					}
				}

				&-input {
					border-bottom-width: 1rpx;
					border-bottom-color: #d8d8d8;
					border-bottom-style: solid;
					padding: 14rpx 0;
					margin-top: 14rpx;
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-direction: row;

					&-pre {
						position: relative;
						display: flex;
						justify-content: space-between;
						flex-direction: row;
						align-items: center;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #666;
					}

					&>.code-ipt {
						width: 434rpx;
						border-bottom-width: 1rpx;
						border-bottom-color: #d8d8d8;
						border-bottom-style: solid;
						padding: 14rpx 0;

						&>.ipt {
							line-height: 40rpx;
							font-size: 28rpx;
						}
					}

					&>.ipt {
						line-height: 40rpx;
						font-size: 28rpx;
						width: 100%;
					}

					&>.btn {
						width: 230rpx;
						height: 60rpx;
						background-color: #fcd002;
						color: #7c6a18;
						font-size: 24rpx;
						border-radius: 30rpx;
						font-weight: 500;
						margin: 0;

						&.disabled {
							background-color: #eee;
							color: #ccc;
						}
					}
				}

				&-submit {
					padding-top: 5rpx;
					width: 100%;
					height: 88rpx;
					background-color: #fcd002;
					border-radius: 44rpx;
					font-size: 32rpx;
					font-weight: 400;
				}
			}
		}

		&-reads {
			display: flex;
			justify-content: flex-start;
			flex-direction: row;
			padding: 0 28rpx;
			align-items: center;

			&-icon {
				width: 32rpx;
				height: 32rpx;
				color: #cccccc;
				margin-right: 14rpx;
				font-size: 28rpx;
				line-height: 32rpx;
				text-align: center;
				position: relative;

				&-inerIcon {
					position: absolute;
					font-size: 18rpx;
					top: 50%;
					left: 50%;
					transform: translate3d(-50%, -50%, 0);
				}
			}

			&-txt {
				font-size: 24rpx;
				color: #999999;
				line-height: 34rpx;
			}
		}

		&-other {
			margin-top: 33rpx;
			width: 100%;

			&-title {
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 45rpx;
				position: relative;
				text-align: center;

				&::before,
				&::after {
					content: '';
					position: absolute;
					width: 154rpx;
					height: 1rpx;
					background-color: #d8d8d8;
					top: 50%;
					transform: translateY(-50%);
				}

				&::before {
					left: 96rpx;
				}

				&::after {
					right: 96rpx;
				}
			}

			&-btn {
				text-align: center;
				margin-top: 43rpx;

				text {
					display: block;
					font-size: 24rpx;
					color: #666;
				}

				&-wechat {
					width: 88rpx;
					height: 88rpx;
				}
			}

		}

		&-area-code {
			position: relative;
			background-color: white;
			padding: 28rpx;
			border-radius: 24rpx 24rpx 0 0;

			&-header {
				text-align: center;
				color: #333;
				font-size: 34rpx;
			}

			&-close {
				width: 23rpx;
				height: 23rpx;
				position: absolute;
				top: 40rpx;
				right: 28rpx;
			}

			&-scroll {
				height: 1080rpx;

				&-data {
					font-size: 28rpx;
					padding: 28rpx 0;
					border-bottom: 1rpx solid #ededed;
				}
			}
		}

		.debug-view {
			white-space: wrap;
			word-break: break-all;
		}
	}

	.debug-view {
		white-space: wrap;
		word-break: break-all;
	}
</style>
