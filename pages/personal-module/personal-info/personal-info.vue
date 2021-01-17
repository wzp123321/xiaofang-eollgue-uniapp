<template>
	<view class="personal-info-wrapper">
		<view class="personal-info-header flex-row">
			<userAvatar :headimage="personalInfo.headimage"></userAvatar>
			<view class="flex-column" style="margin-left:10px">
				<view class="flex-row">
					<view class="name">{{ personalInfo.nickName }}</view>
					<view class="sex">
						<image :src="personalInfo.sex === '女' ? '/static/personal/woman.svg' : '/static/personal/man.svg'" mode=""></image>
					</view>
				</view>
				<view class="work">{{ personalInfo.introduction }}</view>
			</view>
		</view>
		<view class="title">基本资料</view>
		<view v-if="personalInfo.ispublic === 1" class="base-data">
			<view class="flex-row-space data-item">
				<view class="flex-row">
					<image src="../../../static/personal/birthday.svg" mode=""></image>
					<text>生日</text>
				</view>
				<view class="data">{{ personalInfo.birthday }}</view>
			</view>
			<view class="flex-row-space  data-item">
				<view class="flex-row">
					<image src="../../../static/personal/workunit.svg" mode=""></image>
					<text>单位</text>
				</view>
				<view class="data">{{ personalInfo.company }}</view>
			</view>
			<view class="flex-row-space  data-item">
				<view class="flex-row">
					<image src="../../../static/personal/workunit.svg" mode=""></image>
					<text>职务</text>
				</view>
				<view class="data">{{ personalInfo.idstatus }}</view>
			</view>
			<view class="flex-row-space  data-item" style="border-bottom: none;">
				<view class="flex-row">
					<image src="../../../static/personal/address.svg" mode=""></image>
					<text>居住地</text>
				</view>
				<view class="data">{{ personalInfo.livecity }}</view>
			</view>
		</view>
		<view v-else class="no-data">
			<image src="../../../static/personal/no-open.png" mode=""></image>
			<view class="description">用户没有公开个人信息</view>
		</view>
	</view>
</template>

<script>
	import {
		viewUserInfo
	} from '../../../service/personal.js'
	import userAvatar from '../../../components/user-avatar/user-avatar.vue'
	export default {
		components: {
			userAvatar
		},
		data() {
			return {
				personalInfo: {}
			};
		},
		methods: {
			async getUserInfo(id) {
				uni.showLoading({
					title: '加载中'
				})
				const res = await viewUserInfo(id)
				if (res) {
					this.personalInfo = res
				}
				uni.hideLoading()
			}
		},
		onLoad(options) {
			const id = options.id || 2;
			this.$nextTick(function() {
				this.getUserInfo(id)
			})
		}
	};
</script>

<style lang="less" scoped>
	.personal-info-wrapper {
		position: relative;
		margin: 0 28upx;

		.personal-info-header {
			padding: 28upx;
			margin-top: 32upx;
			box-shadow: 0px 6upx 33upx 0px rgba(124, 124, 124, 0.18);
			border-radius: 12upx;
			font-size: 32upx;
			color: #333;

			.sex {
				image {
					width: 28upx;
					height: 28upx;
					margin-left: 10upx;
				}
			}

			.work {
				font-size: 24upx;
				color: #666666;
				margin-top: 18upx;
			}
		}

		.title {
			font-size: 36upx;
			color: #333;
			margin-top: 48upx;
		}

		.base-data {
			.data-item {
				font-size: 28upx;
				color: #333;
				padding: 30upx 0;
				border-bottom: 2upx solid #ededed;

				image {
					width: 30upx;
					height: 30upx;
					margin-right: 10upx;
				}
			}
		}

		.no-data {
			font-size: 24upx;
			color: #999;
			padding-top: 101upx;
			text-align: center;

			image {
				width: 128upx;
				height: 110upx;
				margin: 0 auto;
			}

			.description {
				margin-top: 28upx;
			}
		}
	}
</style>
