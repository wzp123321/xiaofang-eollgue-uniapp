<script>
	import {
		refreshToken
	} from "./service/login.js";
	import {
		getUserInfo
	} from "./service/personal.js";
	import {
		handleShareContent
	} from "./service/normsInterpretation.js";
	import {
		mapActions
	} from "vuex";
	import WeixinOauth from "@/utils/oauth.js";
	let weixinAuth = null;
	// #ifdef APP-PLUS
	weixinAuth = new WeixinOauth();
	// #endif

	export default {
		// #ifdef APP-PLUS
		globalData: {
			weixinAuth,
		},
		// #endif
		methods: {
			...mapActions([
				"setNavigateBarHeight",
				"setStatusBarHeight",
				"setUserInfo",
			]),
			// 计算导航栏高度
			getNavigateHeight() {
				let customBar = 0;
				uni.getSystemInfo({
					success: function(e) {
						let statusBar = e.statusBarHeight;
						// #ifndef MP
						if (e.platform == "android") {
							// customBar = e.statusBarHeight + 50
							customBar = 45; // 安卓机还要重新计算
						} else {
							// customBar = e.statusBarHeight + 45
							customBar = e.statusBarHeight;
						}
						// #endif
					},
				});
				return customBar;
			},
			// 计算状态栏高度
			getStatusBarHeight() {
				const statusBarHeight = plus.navigator.getStatusbarHeight();
				this.setStatusBarHeight(statusBarHeight);
			},
			// 获取用户信息
			async getUserInfo() {
				const res = await getUserInfo();
				if (res) {
					let userInfo = res;
					userInfo.vipExpiresTime = this.$formateTime(userInfo.vipExpiresTime);
					uni.setStorageSync("xf_userInfo", userInfo);
					this.setUserInfo(userInfo);
				}
			},
			/**
			 * 处理分享链接进入时页面跳转
			 */
			handleShareNavigate() {
				setTimeout(function() {
					var args = plus.runtime.arguments;
					if (args) {
						console.log(args);
						const urls = args.split("firecollegue://");
						console.log(" urls[1]", '/' + urls);
						uni.navigateTo({
							url: '/' + urls[1],
						});
					}
				}, 10);
			},
			/**
			 * 处理推送消息
			 */
			handleMessagePush() {
				// #ifdef APP-PLUS
				const _self = this;
				const _handlePush = async function(message) {
					// 获取设备类型
					const plateform = uni.getSystemInfoSync().platform;
					// 获取自定义信息
					const receMessage = JSON.parse(JSON.stringify(message));
					let payload = {};
					payload =
						plateform === "ios" ?
						JSON.parse(JSON.stringify(receMessage.payload)) :
						JSON.parse(receMessage.payload);
					console.log(payload);
					let type = Number(payload.type);
					let id = "";
					let normsNo = "";
					let title = payload.title;
					switch (type) {
						case 0:
							uni.navigateTo({
								url: "/pages/np/np?normsNo=" +
									payload.normsNo +
									"&title=" +
									payload.title,
							});
							break;
						case 1:
							console.log(payload.id);
							uni.navigateTo({
								url: "/pages/normative-interpretation/normative-interpretation-info/normative-interpretation-info?id=" +
									payload.id,
							});
							break;
							// 意见反馈
						case 2:
							uni.navigateTo({
								url: "/pages/personal-module/feedback/feedback",
							});
							break;
					}
				};
				// 事件处理
				plus.push.addEventListener("click", _handlePush);
				plus.push.addEventListener("receive", _handlePush);
				// #endif
			},
		},
		onLaunch: async function() {
			const customData = this.getNavigateHeight();
			this.setNavigateBarHeight(customData);
			// #ifdef APP-PLUS
			this.getStatusBarHeight();
			// #endif
		},
		onShow: async function() {
			this.getUserInfo();
			// #ifdef APP-PLUS
			//设置应用图标的数量
			plus.runtime.setBadgeNumber(0);
			this.handleShareNavigate();
			this.handleMessagePush();
			// #endif
			// 判断是否存在token，刷新token
			const Authorization = uni.getStorageSync("Authorization");
			if (Authorization) {
				try {
					const refreshRes = await refreshToken();
					if (refreshRes) {
						uni.setStorageSync("Authorization", refreshRes);
					}
				} catch (e) {
					const keys = Object.keys(e);
					if (
						keys.includes("isok") &&
						keys.includes("data") &&
						keys.includes("message")
					) {
						if (e && !e.isok) {
							uni.redirectTo({
								url: "/pages/login/index/index",
							});
							uni.showToast({
								title: e.message,
								icon: "none",
								position: "bottom",
								duration: 3 * 1000,
							});
						}
					}
				}
			} else {
				uni.redirectTo({
					url: "pages/login/index/index",
				});
			}
			// 检测网络变化
			uni.onNetworkStatusChange((res) => {
				if (!res.isConnected) {
					uni.showToast({
						title: "网络未连接，请检查网络",
						position: "bottom",
					});
				}
			});
		},
	};
</script>
<style lang="scss">
	@import url("./static/css/iconfont.css");
	@import url("./static/css/common.css");

	/deep/ .uni-radio-input {
		width: 32upx !important;
		height: 32upx !important;
		background: #fff !important;
		border: 2upx solid #cccccc !important;
	}

	/deep/ .uni-radio-input-checked {
		border: 2upx solid #ffcc66 !important;
	}

	/deep/ .uni-radio-input::before {
		content: "" !important;
		width: 32upx !important;
		height: 32upx !important;
		border-radius: 50%;
		top: 48% !important;
		left: 51% !important;
		background: #ffcc66 !important;
	}

	/deep/ .uni-checkbox-input {
		width: 32upx !important;
		height: 32upx !important;
		border-radius: 30upx !important;
	}

	/deep/ .uni-checkbox-input-checked {
		border: 2upx solid #fcd002 !important;
	}

	/deep/ .uni-checkbox-input-checked:before {
		content: "" !important;
		width: 32upx !important;
		height: 32upx !important;
		border-radius: 50%;
		background: #fcd002 !important;
	}

	/deep/ uni-button:after {
		border: none !important;
	}
</style>
