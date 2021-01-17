<template>
	<view :class="['vip-purchase', isIOS ? '' : 'flex-column-space']">
		<view class="vip-purchase-type">
			<!-- vip类型 -->
			<VipTypeChoose :vipList="vipList" :goodInfo.sync="goodInfo" :isIOS="isIOS"></VipTypeChoose>

			<view class="vip-purchase-type-title" v-if="!isIOS"> 支付方式 </view>

			<!-- 支付方式 -->
			<PayTypeChoose :payTypes="payTypes" :payType.sync="payType" v-if="!isIOS"></PayTypeChoose>
			<image class="vip-purchase-type-rights" src="../../../static/personal/vip-rights.png" mode=""></image>
		</view>
		<view class="vip-purchase-btn flex-column-space" v-if="!isIOS">
			<view class="pay-operation flex-row-space">
				<label class="radio">
					<radio value="true" :checked="isRead === true" @tap="
              () => {
                isRead = !isRead;
              }
            " /><text
					 @tap="linkToServiceAgreement">已阅读并同意《消防学院会员用户协议》</text>
				</label>
				<button type="default" @tap="handlePay">
					立即支付<text style="font-size: 11px">￥{{ goodInfo.rebatePrice || goodInfo.price }}</text>
				</button>
			</view>
		</view>
		<!-- ios支付按钮 -->
		<view v-else class="ios-pay-btn">
			<button type="default" @tap="getApplePay" :loading="loading">
				{{ loading ? '支付中' : '立即支付' }}
			</button>
			<label class="radio">
				<radio value="true" :checked="isRead === true" @tap="
            () => {
              isRead = !isRead;
            }
          " /><text
				 @tap="linkToServiceAgreement">已阅读并同意《消防学院会员用户协议》</text>
			</label>
		</view>
	</view>
</template>

<script>
	import {
		getVipList,
		getPaymentInfo,
		getIapPayCheck,
	} from "../../../service/personal.js";
	import {
		handleAliPay,
		handleWeixinPay
	} from "../../../service/index.js";
	import {
		payTypes
	} from "../config/index.js";
	import {
		mapGetters
	} from "vuex";
	import PayTypeChoose from "./components/PayTypeChoose.vue";
	import VipTypeChoose from "./components/VipTypeChoose.vue";

	const zdIospay = uni.requireNativePlugin("ZD-Iospay");

	export default {
		data() {
			return {
				goodInfo: {}, // 当前选择vip
				vipList: [],
				payType: "1", // 当前选择支付方式
				payTypes,
				isRead: true,
				iapChannel: "", // 苹果支付通道
				loading: false,
			};
		},
		components: {
			PayTypeChoose,
			VipTypeChoose,
		},
		computed: {
			userInfo() {
				return this.$store.state.userModule.userInfo;
			},
			/**
			 * 是否为ios
			 */
			isIOS: function() {
				let isios = false;
				uni.getSystemInfo({
					success(res) {
						isios = res.platform === "ios";
					},
				});
				return isios;
			},
		},
		methods: {
			// 跳转用户协议
			linkToServiceAgreement() {
				uni.navigateTo({
					url: "/pages/service-argeement/service-argeement",
				});
			},
			// 点击支付
			handlePay() {
				if (!this.isRead) {
					uni.showToast({
						icon: "none",
						title: "请勾选用户协议",
					});
					return;
				}
				if (this.payType === "1") {
					this.handleWeiXinpay();
				} else if (this.payType === "2") {
					this.handleAlipay();
				}
			},
			/**
			 * 支付宝支付
			 */
			async handleAlipay() {
				const orderInfo = await this.getPaymentInfo();
				console.log("orderInfo-----------------", orderInfo);
				try {
					const res = await handleAliPay(orderInfo);
					if (res && Object.keys(res).length) {
						uni.showToast({
							icon: "success",
							title: "支付成功",
						});
						// 返回上一级
						uni.navigateBack();
					}
				} catch (e) {
					uni.showToast({
						icon: "none",
						title: "支付失败",
					});
				}
			},
			/**
			 * 微信支付
			 */
			async handleWeiXinpay() {
				const orderInfo = await this.getPaymentInfo();
				try {
					const res = await handleWeixinPay(orderInfo);
					if (res && Object.keys(res).length) {
						uni.showToast({
							icon: "success",
							title: "支付成功",
						});
						// 返回上一级
						uni.navigateBack();
					}
				} catch (e) {
					console.log("e", e);
					uni.showToast({
						icon: "none",
						title: "支付失败",
					});
				}
			},
			/**
			 * 获取订单信息
			 */
			async getPaymentInfo() {
				const {
					id
				} = this.userInfo;
				const {
					payType
				} = this;
				const {
					goodsId,
					rebateId,
					rebatePrice,
					price
				} = this.goodInfo;
				let orderInfo = "";
				try {
					const res = await getPaymentInfo({
						payType: Number(payType),
						goodsId,
						rebateId: Number(rebateId),
						amount: rebatePrice ? rebatePrice.toFixed(2) : price.toFixed(2),
					});
					if (res) {
						orderInfo = res;
					}
				} catch (e) {
					uni.showToast({
						icon: "none",
						title: "拉取订单信息失败，请稍后重试",
					});
				}
				return orderInfo;
			},
			/**
			 * 苹果支付
			 */
			getApplePay() {
				if (!this.isRead) {
					uni.showToast({
						icon: "none",
						title: "请勾选用户协议",
					});
					return;
				}
				const {
					userInfo,
					iapChannel
				} = this;
				const {
					productid
				} = this.goodInfo;
				const that = this;
				const transactionDateresult = zdIospay.ZdIospayFunctionSync(productid);
				const transactionDate = eval("(" + transactionDateresult + ")");
				console.log(transactionDate);
				try {
					console.log(iapChannel, productid);
					that.loading = true;
					// plus.payment.request(
					//   iapChannel,
					//   {
					//     productid,
					//   },
					//   function (result) {
					//     console.log("result------------------------------", result);
					//     this.getIapPayChecked(result);
					//   },
					//   function (err) {
					//     console.log("err-------", err);
					//     that.loading = false;
					//   }
					// );
					uni.requestPayment({
						provider: "appleiap",
						orderInfo: {
							productid: productid,
						},
						success: (result) => {
							console.log("success--------------------", result);
							this.getIapPayChecked(result);
						},
						fail: (e) => {
							uni.showToast({
								title: '支付失败'
							})
							that.loading = false;
						},
						complete: () => {
							console.log("payment结束");
							that.loading = false;
						},
					});
				} catch (e) {
					uni.showToast({
						title: '支付失败'
					})
					console.log("e----------", e);
					that.loading = false;
				}
			},
			/**
			 * 苹果支付校验
			 */
			async getIapPayChecked(result) {
				const {
					payment,
					transactionDate,
					transactionIdentifier,
					transactionReceipt,
				} = result;
				console.log(
					payment,
					transactionDate,
					transactionIdentifier,
					transactionReceipt
				);
				try {
					const res = await getIapPayCheck({
						productid: payment.productid,
						transactionDate,
						transactionIdentifier,
						transactionReceipt,
					});
					console.log("res-----------", res);
					if (res) {
						/**
						 * {
						 *   "code": 0000,
						 *   "message": 验证通过,
						 * }
						 */
						uni.showToast({
							icon: "success",
							title: "支付成功",
						});
						this.loading = false;
						// 返回上一级
						uni.navigateBack();
					}
				} catch (error) {
					console.log("error---------------------", error);
					this.loading = false;
				}

				// 返回上一级
				uni.navigateBack();
			},
			/**
			 * 苹果支付  获取支付通道 https://www.jianshu.com/p/644d136801e9
			 */
			plusReady() {
				uni.showLoading({
					title: "加载中",
				});
				const that = this;
				const IAPOrders = ["1", "4", "3"];
				//uni-app中将此function里的代码放入vue页面的onLoad生命周期中
				plus.payment.getChannels(
					function(channels) {
						console.log("channels-------------", channels);
						for (var i in channels) {
							if (channels[i].id == "appleiap") {
								console.log("channels[i]-----------", channels[i]);
								that.iapChannel = channels[i];
								that.iapChannel.requestOrder(
									IAPOrders,
									function(event) {
										console.log(event, event.length);
										uni.hideLoading();
										for (var j in event) {
											that.vipList.push(
												Object.assign(event[j], {
													id: event[j].productid,
													goodsName: event[j].title,
												})
											);
											that.goodInfo = that.vipList[0];
											console.log(that.vipList);
										}
									},
									function(errormsg) {
										console.log(
											"获取支付通道失败：" +
											JSON.stringify(errormsg) +
											"-" +
											errormsg.message
										);
										uni.showToast({
											title: '获取会员信息失败，请稍后重试'
										})
										uni.navigateBack()
										uni.hideLoading();
									}
								);
							}
						}
					},
					function(e) {
						console.log("获取支付通道失败：" + e.message);
					}
				);
			},
			/**
			 * 获取vip列表
			 */
			async getVipList() {
				uni.showLoading({
					title: "加载中",
				});
				const res = await getVipList();
				if (res) {
					const list = res.map((item) => {
						return Object.assign(item, {
							id: item.goodsId,
						});
					});
					this.vipList = list;
					this.goodInfo = list[0];
				}
				uni.hideLoading();
			},
		},
		/**
		 * 初始化
		 */
		onLoad() {
			if (this.isIOS) {
				this.plusReady();
			} else {
				this.getVipList();
			}
		},
	};
</script>

<style lang="less" scoped>
	.vip-purchase {
		position: relative;
		height: 100%;

		&-type {
			padding: 0 20upx;

			&-title {
				font-size: 36upx;
				font-weight: 500;
				margin: 48upx 0 28upx 0;
			}

			&-rights {
				width: 100%;
				height: 411upx;
			}
		}

		&-btn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;

			.pay-operation {
				font-size: 20upx;
				color: #333;
				padding: 20upx 32upx;
				line-height: 72upx;
				border-top: 2upx solid #cccccc;
				text-align: center;

				uni-button {
					margin: 0;
					background: #fcd002;
					font-size: 28upx;
					height: 72upx;
					line-height: 72upx;
					border-radius: 40upx;
				}

				.radio {
					white-space: nowrap;
				}
			}
		}

		.ios-pay-btn {
			uni-button {
				width: 90%;
				margin-left: 5%;
				background: #fcd002;
				font-size: 28upx;
				height: 80upx;
				border-radius: 40upx;
				line-height: 80upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: bold;
				color: #333333;
			}

			.radio {
				margin-left: 5%;
				font-size: 20upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				line-height: 28upx;
				margin-top: 30upx;
				display: inline-block;

				uni-text {
					position: relative;
					top: 4upx;
				}
			}
		}
	}
</style>
