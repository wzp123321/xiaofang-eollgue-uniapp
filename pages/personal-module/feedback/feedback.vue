<template>
	<view class="feed-back-wrapper">
		<view class="feedback-content">您的建议是我们前进的方向，有您的帮助我们才能走的更远！</view>
		<radio-group class="feedback-type flex-row-space" @change="radioChange">
			<label v-for="(item,index) in feedBackTypes" :key="index">
				<view class="type-item flex-row">
					<radio :value="item.key" :checked="item.key === type" />
					<view>{{item.value}}</view>
				</view>
			</label>
		</radio-group>
		<form class="feedback-form" @submit="formSubmit">
			<view class="uni-form-item uni-column flex-row-space">
				<view class="title">手机号</view>
				<input class="uni-input" v-model="phone" name="phone" placeholder="请输入手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">反馈内容</view>
				<textarea class="uni-input" v-model="content" name="content" maxlength="100" placeholder="反馈内容，最多100字"></textarea>
			</view>
			<view class="uni-form-item uni-column">
				<button form-type="submit" type="default">提交</button>
			</view>
		</form>
		<!-- 历史反馈 -->
		<view class="history-feedback" v-if="JSON.stringify(feedbakcList) !=='[]'">
			<view class="title">我的反馈:</view>
			<view class="history-item" v-for="(item,index) in feedbakcList" :key="index">
				<view class="flex-row">
					<view class="type-title">{{calculateData(item.type)}}</view>
					<view class="service-reply">
						<view class="content">{{item.content}}</view>
						<view class="time">{{formatDate(item.createTime,' ')}}</view>
					</view>
				</view>
				<view v-if="item.mark" class="flex-row" style="padding-top:20rpx">
					<view class="type-title">管理员回复</view>
					<view class="service-reply">
						<view class="content">{{item.mark}}</view>
						<view class="time">{{formatDate(item.backTime,'T')}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserFeedback,
		submitUserfeedback
	} from '../../../service/personal.js'
	import {
		feedBackTypes
	} from '../config/index.js'
	// 引入表单校验
	var graceChecker = require("../../../utils/graceChecker.js");
	export default {
		data() {
			return {
				type: "0",
				feedBackTypes,
				phone: "",
				feedbakcList: [],
				phone: '',
				content: '',
				rule: [{
						name: "phone",
						checkType: "notnull",
						errorMsg: "手机号码不能为空"
					},
					{
						name: "phone",
						checkType: "reg",
						checkRule: "^0?(13|14|15|18|17)[0-9]{9}$",
						errorMsg: "手机号码应为11位有效数字"
					},
					{
						name: "content",
						checkType: "notnull",
						errorMsg: "反馈内容不能为空"
					}
				]
			};
		},
		methods: {
			// 类型
			radioChange(e) {
				this.type = e.detail.value;
			},
			// 提交
			async formSubmit(e) {
				const {
					rule,
					type
				} = this;
				var formdata = e.detail.value;
				var checkRes = graceChecker.check(formdata, rule);
				if (checkRes) {
					const params = Object.assign(formdata, {
						type: Number(type)
					})
					const res = await submitUserfeedback(params)
					if (res) {
						uni.showToast({
							icon: 'none',
							title: '反馈成功'
						})
						this.phone = '';
						this.content = ''
						this.getFeedbackList();
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			// 封装数据
			calculateData(type) {
				let value = '';
				this.feedBackTypes.forEach(item => {
					if (Number(item.key) === type) {
						value = item.value
					}
				})
				return value;
			},
			// 处理时间
			formatDate(time, split) {
				return this.$formateTime(time, split)
			},
			// 获取反馈列表
			async getFeedbackList() {
				uni.showLoading({
					title: '加载中'
				})
				const res = await getUserFeedback()
				if (res) {
					const feedbakcList = res
					this.feedbakcList = feedbakcList
				}
				uni.hideLoading()
				uni.stopPullDownRefresh()
			}
		},
		onReady() {
			this.$nextTick(function() {
				this.getFeedbackList();
			});
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getFeedbackList();
		}
	};
</script>

<style lang="less">
	.feed-back-wrapper {
		padding: 28rpx 0;
		font-size: 28rpx;
		color: #333;

		.feedback-content {
			padding: 0 28rpx;
		}

		// 单选
		.feedback-type {
			padding: 0 28rpx;
			margin-top: 24rpx;

			.type-item {
				width: 192rpx;
				height: 88rpx;
				line-height: 88rpx;
				padding-left: 20rpx;
				background: #fff;
				border-radius: 12rpx;
				box-shadow: 0px 6px 33px 0px rgba(124, 124, 124, 0.18);

				uni-view {
					position: relative;
					top: 3rpx;
				}
			}
		}

		.feedback-form {
			.uni-form-item {
				background: #fff;
				margin: 30rpx 20rpx;
				padding: 0 20rpx;
			}

			.uni-form-item:nth-child(1),
			.uni-form-item:nth-child(2) {
				box-shadow: 0px 6px 33px 0px rgba(124, 124, 124, 0.18);
			}

			.title {
				line-height: 88rpx;
			}

			.uni-form-item:nth-child(1),
			.uni-form-item:nth-child(2) {
				box-shadow: 0px 6rpx 33rpx 0px rgba(124, 124, 124, 0.18);
			}

			input {
				width: 210rpx;
				height: 88rpx;
			}

			uni-button {
				width: 100%;
				border-radius: 50rpx;
				background: #fcd002;
				margin-top: 50rpx;
				border: #fcd002;
			}

			uni-textarea {
				width: 100%;
			}
		}

		.history-feedback {
			font-size: 28rpx;
			color: #999999;
			background: #f8f8f8;

			.title {
				font-weight: 500;
				padding: 28rpx 20rpx;
				font-size: 36rpx;
				color: #333;
				background: #fff;
			}

			.history-item {
				padding: 20rpx;
				font-size: 28rpx;
				margin-bottom: 19rpx;
				background: #fff;
				color: #666666;

				.type-title {
					width: 171rpx;
					text-align: left;
				}

				.service-reply {
					flex: 1;

					.content {
						color: #999999;
						word-break: break-all;
						word-wrap: break-word;
					}

					.time {
						text-align: right;
						font-size: 20rpx;
						margin-top: 16rpx;
						color: #999999;
						padding: 20rpx 0;
						border-bottom: 2rpx solid #ededed;
					}
				}
			}
		}
	}
</style>
