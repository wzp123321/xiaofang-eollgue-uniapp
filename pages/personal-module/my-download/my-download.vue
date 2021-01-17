<template>
	<view class="my-download-wrapper">
		<!-- 自定义导航栏 -->
		<uni-nav-bar :fixed="true" :statusBar="true">
			<view class="customer-bar-header flex-row-space">
				<i class="icon iconxiangzuo" @tap="handleNavigateBack"></i>
				<text class="navigate-title">我的下载</text>
				<text class="navigate-text" @tap="handleDownloadEdit">{{isEdit?'取消':'编辑'}}</text>
			</view>
		</uni-nav-bar>
		<view class="total flex-row">
			<image src="../../../static/personal/download-ico.svg" mode=""></image>全部下载<text>（{{downloadList.length}}本）</text>
		</view>
		<me-select ref="meSelect" @change="changeList" @finish="finish" @itemClick="itemClick" :datalist="downloadList"
		 :options="options" class="data-list">
			<view slot-scope="slot" :class="[isEdit?'':'item']">
				<view class="title" @tap="linkToInfo(slot.slotScope.item)">{{slot.slotScope.item.title}}</view>
				<view class="code">编号:{{slot.slotScope.item.normsNo}}</view>
			</view>
		</me-select>
	</view>
</template>

<script>
	import meSelect from "@/components/me-select/me-select.vue"
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		getDownloadList
	} from '../../../store/modules/download.js'
	export default {
		data() {
			return {
				options: {
					flags: ['id'], //设置需要返回的参数这个参数必须在 dataList 中的item中存在（不配置默认全部返回）
					itemCanSelect: true //是否开启点击列表页选择配置
				},
				isEdit: false,
				downloadList: []
			};
		},
		components: {
			meSelect
		},
		onShow() {
			this.downloadList = getDownloadList() || []
		},
		methods: {
			...mapActions(['deleteXFDownloadVersions']),
			// 详情页
			linkToInfo(item) {
				uni.navigateTo({
					url: '/pages/np/np?normsNo=' + item.normsNo + '&title=' + encodeURIComponent(item
						.title)
				});
			},
			// 返回
			handleNavigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//编辑
			handleDownloadEdit() {
				if (this.downloadList.length === 0) {
					return
				}
				this.isEdit = !this.isEdit
				this.changeModel();
			},
			changeModel() {
				this.$refs.meSelect.changeModel()
			},
			itemClick(e) {
				console.log('列表点击了：', e)
			},
			// 删除选中的数据
			finish(e) {
				const that = this
				uni.showModal({
					title: '删除下载',
					content: '你确定要删除下载内容吗?',
					async success(res) {
						if (res.confirm) {
							const ids = e.map(item => {
								return item.id
							})
							that.deleteXFDownloadVersions(ids)
							that.isEdit = false
							that.changeModel()
							uni.showToast({
								icon: 'success',
								title: '删除成功'
							})
							that.downloadList = getDownloadList() || []
						} else if (res.cancel) {
							that.isEdit = false
							that.changeModel()
						}
					}
				})
			},
			changeList(e) {}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="less" scoped>
	.my-download-wrapper {
		position: relative;

		.customer-bar-header {
			width: 100%;
			padding: 0 28rpx;

			.iconfont,
			text {
				display: inline-block;
			}

			.navigate-title {
				font-size: 36rpx;
				color: #333;
				font-weight: 500;
			}

			.navigate-text {
				font-size: 28rpx;
				color: #666666;
			}
		}

		.total {
			font-size: 36rpx;
			color: #333;
			padding: 35rpx 28rpx;
			font-weight: bold;
			border-bottom: 2rpx solid #EDEDED;
			line-height: 47rpx;

			image {
				width: 35rpx;
				height: 35rpx;
				margin-right: 10rpx;
				position: relative;
				top: 8rpx;
			}

			text {
				font-size: 24rpx;
				color: #666;
				margin-left: 10rpx;
				position: relative;
				top: 4rpx;
			}
		}

		.data-list {
			margin-bottom: 100rpx;
			overflow-y: scroll;

			.item::after {
				font-family: "iconfont" !important;
				font-size: 36rpx;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				content: '\e653';
				position: absolute;
				top: 50rpx;
				right: 2rpx;
			}

			.title {
				font-size: 28rpx;
				color: #666666;
			}

			.code {
				font-size: 24rpx;
				color: #999;
				margin-top: 14rpx;
			}
		}
	}
</style>
