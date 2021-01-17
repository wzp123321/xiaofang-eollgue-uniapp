<template>
	<!-- 规范解读组件 -->
	<view class="specificationinterpretation-wrapper flex-column" :style="{borderBottom:`1px solid ${borderColor}`}">
		<view class="specificationinterpretation-title" @tap="linkToInfo">
			<view class="content">
				{{InterpretationInfo.title}}
			</view>
			<image v-if="InterpretationInfo.needVip" src="/static/interpretation/need-vip.svg" mode="aspectFill"></image>
		</view>
		<view class="specificationinterpretation-description" v-if="InterpretationInfo.description" @tap="linkToInfo">
			{{InterpretationInfo.description}}
		</view>
		<!-- 图片 -->
		<view class="specificationinterpretation-images" v-if="images.length>0">
			<image v-for="(item,index) in images" :key="index" :src="item" mode=""></image>
		</view>
		<view class="info flex-row-space">
			<text v-if="InterpretationInfo.createTime">{{formatDate(InterpretationInfo.createTime)}}</text>
			<view class="visit-count flex-row" v-if="InterpretationInfo.pv">
				<image src="../../static/interpretation/visitCount.svg" mode=""></image>
				<text>{{InterpretationInfo.pv}}</text>
			</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				images: []
			};
		},
		props: {
			InterpretationInfo: {
				type: Object,
				default: {}
			},
			borderColor: {
				type: String,
				default: '#EDEDED'
			},
			isCollect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			formatDate(time) {
				if (!time) {
					return ''
				}
				const times = time.split('T')
				return times[0]
			},
			linkToInfo() {
				const id = this.isCollect ? this.InterpretationInfo.interpretationId : this.InterpretationInfo.id
				uni.navigateTo({
					url: "/pages/normative-interpretation/normative-interpretation-info/normative-interpretation-info?id=" + id
				})
			}
		},
		mounted() {
			this.images = this.$getImgList(this.InterpretationInfo.content) || []
			this.images = this.images.splice(0, 3)
		}
	}
</script>

<style lang="less">
	.specificationinterpretation-wrapper {
		position: relative;
		padding: 28upx 0;
		margin: 0 28upx;
		font-size: 26upx;
		color: #333;

		.specificationinterpretation-title {
			margin-bottom: 20upx;

			.content {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				font-size: 32upx;
				max-width: 620upx;
			}

			image {
				position: absolute;
				top: 20rpx;
				right: 0;
				width: 55upx;
				height: 28upx;
			}
		}

		.specificationinterpretation-description {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			font-size: 24upx;
			color: #666;
			text-indent: 2em;
			margin-bottom: 20upx;
		}

		.specificationinterpretation-images {
			padding: 12rpx 0;

			uni-image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 12rpx;
				margin-right: 32rpx;
			}
		}

		.info {
			font-size: 20upx;
			color: #999;

			text {
				display: inline-block;
				margin-right: 30upx;
			}

			.visit-count {
				image {
					width: 28upx;
					height: 21upx;
					position: relative;
					top: 6upx;
				}

				text {
					font-size: 20rpx;
					color: #999;
					margin-right: 0;
				}
			}
		}
	}
</style>
