<template>
	<view class="about-us">
		<image src="../../../static/login/logo.png" mode=""></image>
		<view class="version">
			消防学院
		</view>
		<view class="module-title">
			公司简介
		</view>
		<view class="data" style="text-indent: 2em;">
			“消防学院”是基于移动互联网的消防行业交流与学习的社区，是倡导消防设计公开透明，推动提高消防行业技术水平的先行者。我们的使命是帮助消防行业从业者建立公开自由的交流平台，建立消防规范理解的共识，帮助全国各地的从业者和消防相关专业的从业者能够准确的理解和运用规范。利用APP，带领大家快速查阅和使用规范，通过方便快捷的条文解释，图示和评论功能，快速让用户理解规范和行业经验。与此同时还举办各种线上线下沙龙活动和讲座，为用户创造更多形式的交流与学习机会。
			独学而无友，则孤陋寡闻。我们愿通过知识的传播去改变自己，造福消防产业。
		</view>
		<view class="module-title">
			联系方式
		</view>
		<view class="data">
			电话： 021-56450896
		</view>
		<view class="data">
			邮箱： firecollege@163.com
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		}
	}
</script>

<style lang="less" scoped>
	.about-us {
		padding: 60rpx 28rpx;

		.version {
			text-align: center;
			font-size: 32rpx;
			color: #FCD002;
			margin-top: 11rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			line-height: 45rpx;
		}

		image {
			width: 250rpx;
			height: 250rpx;
			border-radius: 50%;
			display: block;
			margin: 0 auto;
		}

		.module-title {
			color: #333;
			font-size: 36rpx;
			margin-top: 46rpx;
			margin-bottom: 20rpx;
		}

		.data {
			color: #666;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
	}
</style>
