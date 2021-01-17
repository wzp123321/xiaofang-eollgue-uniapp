<template>
	<view class="bind-phone">
		<form @submit="formSubmit">
			<view class="uni-form-item uni-column item-shadow">
				<input class="uni-input" v-model="phone" name="phone" placeholder="请输入手机号" />
			</view>
			<view class="uni-form-item uni-column item-shadow flex-row-space">
				<input class="uni-input" name="valicode" placeholder="请输入验证码" />
				<button @tap="handleCaptcha" class="captcha-btn" :disabled="seconds!==60" :style="{'background':seconds!==60?'#EBEBEB':''}">{{btn_tips}}</button>
			</view>
			<view class="uni-form-item uni-column">
				<button form-type="submit" class="sub-btn">完成</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		getCode
	} from '../../../service/login.js'
	import {
		getPhonebind
	} from '../../../service/personal.js'
	// 引入表单校验
	var graceChecker = require("../../../utils/graceChecker.js");
	export default {
		data() {
			return {
				btn_tips: "获取验证码",
				phone: '', // 手机号码
				seconds: 60,
				timer: null,
				rule: [{
						name: "phone",
						checkType: "notnull",
						errorMsg: "手机号码不能为空"
					}, {
						name: "phone",
						checkType: "reg",
						checkRule: "^0?(13|14|15|18|17)[0-9]{9}$",
						errorMsg: "手机号码应为11位有效数字"
					},
					{
						name: "valicode",
						checkType: "notnull",
						errorMsg: "验证码不能为空"
					}
				]
			};
		},
		methods: {
			async formSubmit(e) {
				const {
					rule
				} = this;
				var formdata = e.detail.value;
				var checkRes = graceChecker.check(formdata, rule);
				if (checkRes) {
					try {
						const res = await getPhonebind(formdata)
						if (res) {
							uni.showToast({
								icon: 'none',
								title: '手机号码绑定成功'
							})
							// 重置token
							uni.setStorageSync('Authorization', res)
							uni.reLaunch({
								url: '/pages/personal-module/personal/personal'
							})
						}
					} catch (e) {
						uni.showToast({
							icon: 'none',
							title: e.data.message
						})
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			// 请求验证码
			async handleCaptcha() {
				const {
					phone
				} = this
				const reg = new RegExp(/^0?(13|14|15|18|17)[0-9]{9}$/)
				if (!phone) {
					uni.showToast({
						icon: 'none',
						title: '请填写手机号码'
					})
					return
				}
				if (!reg.test(phone)) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式错误'
					})
					return
				}
				// 请求发送验证码
				const res = await getCode(phone)
				if (res) {
					// 开启定时器
					this.timer = setInterval(() => {
						this.seconds -= 1;
						this.btn_tips = `${this.seconds}秒后重新获取`;
					}, 1000);
					uni.showToast({
						icon: 'none',
						title: '验证码发送成功'
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '验证码发送失败，请稍后重试'
					})
				}
			}
		},
		watch: {
			seconds: function(newVal, oldVal) {
				if (newVal === 0) {
					clearInterval(this.timer);
					this.seconds = 60;
					this.btn_tips = "获取验证码";
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.bind-phone {
		position: relative;
		padding: 40rpx 30rpx;

		.uni-form-item {
			margin-top: 40rpx;
			padding: 6rpx 0;

			uni-input {
				padding-left: 20rpx;
				height: 96rpx;
				color: #999;
			}

			.captcha-btn {
				height: 72rpx;
				margin: 14rpx 20rpx;
				color: #7C6A18;
				background: #fcd002;
				font-size: 24rpx;
				line-height: 72rpx;
				border-radius: 40rpx;
			}

			.sub-btn {
				margin-top: 60rpx;
				width: 100%;
				background: #fcd002;
				color: #333;
				border: none;
				border-radius: 40rpx;
			}
		}

		.item-shadow {
			box-shadow: 0px 6rpx 33rpx 0px rgba(124, 124, 124, 0.18);
		}
	}
</style>
