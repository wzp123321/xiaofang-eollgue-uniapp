<template>
	<view class="collection-detail flex-column" @tap="handleDropDownHide">
		<uni-nav-bar :fixed="true" :statusBar="true">
			<view class="customer-bar-header flex-row-space">
				<i class="icon iconxiangzuo" @tap.stop="handleNavigateBack"></i>
				<text class="navigate-title">{{ title }}</text>
				<view class="operation-image">
					<image class="navigate-image" src="/static/personal/navigate-more.svg" mode="" @tap.stop="handleOperationModal"></image>
					<view v-if="isEdit" class="operation flex-column-space">
						<view class="operation-item flex-row" @tap.stop="handleCollectionEdit">
							<image src="/static/personal/edit-collection.svg" mode=""></image>
							<view class="edit"> 编辑收藏夹 </view>
						</view>
						<view class="operation-item flex-row" @tap.stop="handleDeleteSure(0)">
							<image src="/static/personal/delete-collection.svg" mode=""></image>
							<view class="delete"> 删除收藏夹 </view>
						</view>
					</view>
				</view>
			</view>
		</uni-nav-bar>
		<view v-for="(item, index) in dataList" :key="index">
			<!-- 规范 -->
			<NormInfo v-if="category === '1'" :SpecificationInfo="item">
				<view class="delete-image" @tap.stop="handleDeletePopover(item.id)">
					<image src="/static/personal/edit-more.svg" mode=""></image>
					<view class="delete flex-row" v-show="isDelete && id === item.id" @tap.stop="handleDeleteSure(1)">
						<image src="../../../static/personal/delete-collection.svg" mode=""></image>
						<text>删除</text>
					</view>
				</view>
			</NormInfo>
			<!-- 规范解读 -->
			<specificationInterpretation v-else :InterpretationInfo="item" :isCollect="true">
				<view class="delete-image" @tap.stop="handleDeletePopover(item.id)">
					<image src="/static/personal/edit-more.svg" mode=""></image>
					<view class="delete flex-row" v-show="isDelete && id === item.id" @tap.stop="handleDeleteSure(1)">
						<image src="../../../static/personal/delete-collection.svg" mode=""></image>
						<text>删除</text>
					</view>
				</view>
			</specificationInterpretation>
		</view>
		<!-- 编辑收藏夹 -->
		<collectlistEditPopup ref="createPopup" :parentId="parentId" :id="id" :title="title" :description="description"
		 @success="handleCollCreateSuccess"></collectlistEditPopup>
	</view>
</template>

<script>
	import {
		getFavoritesDelete,
		getFavoritesContent,
		getFavoritesContentDelete,
	} from "../../../service/personal.js";
	import specificationInterpretation from "../../../components/specification-Interpretation/specification-Interpretation.vue";
	import NormInfo from "./components/NormInfo.vue";
	import collectlistEditPopup from "../../../components/collectlist-edit-popup/collectlist-edit-popup.vue";
	export default {
		data() {
			return {
				favoriteId: "", // 收藏夹id
				id: "", // 当前选中的收藏夹内容id
				parentId: "", // 当前收藏夹父级收藏夹id
				title: "", // 收藏夹名称
				description: "", // 收藏夹描述
				dataList: [],
				isDelete: false,
				isEdit: false,
				pagination: {
					page: 1,
					total: 10,
					limit: 10,
				},
				delType: 0, // 删除模块 0:删除收藏夹   1:删除内容
				category: 1, //1：规范   2：规范解读
			};
		},
		components: {
			specificationInterpretation,
			NormInfo,
			collectlistEditPopup,
		},
		methods: {
			// 返回
			handleNavigateBack() {
				uni.navigateBack({
					delta: 1,
				});
			},
			handleDropDownHide() {
				this.isDelete = false;
				this.isEdit = false;
			},
			// 打开对话框
			handleDeletePopover(id) {
				this.id = id;
				this.isDelete = true;
			},
			// 顶部
			handleOperationModal() {
				this.isEdit = true;
			},
			// 删除收藏夹收藏内容
			handleDeleteSure(type) {
				this.delType = type;
				this.isDelete = false;
				const {
					favoriteId,
					id
				} = this;
				const that = this;
				uni.showModal({
					title: "删除收藏",
					content: type === 0 ? "你确认删除该收藏夹吗?" : "你确认删除该收藏内容吗?",
					async success(delRes) {
						if (delRes.confirm) {
							const PromiseArr =
								type === 0 ?
								[getFavoritesDelete(favoriteId)] :
								[getFavoritesContentDelete(id)];
							try {
								const res = await Promise.all(PromiseArr);
								if (res && res.length && res[0]) {
									uni.showToast({
										icon: "success",
										title: "删除成功",
									});
									that.isDelete = false;
									that.isEdit = false;
									if (type === 0) {
										uni.navigateBack({});
									} else {
										that.pagination.page = 1;
										that.dataList = [];
										that.getFavoritesContentList();
									}
								}
							} catch (e) {
								uni.showToast({
									icon: "none",
									title: e.data.message,
								});
							}
						} else if (delRes.cancel) {
							that.isDelete = false;
							that.isEdit = false;
						}
					},
				});
			},
			// 打开编辑弹框
			handleCollectionEdit() {
				this.isEdit = false;
				this.$refs.createPopup.setSharePopupShow(true);
			},
			// 编辑收藏夹回调
			handleCollCreateSuccess(value) {
				uni.showToast({
					icon: "success",
					title: "编辑成功",
				});
				this.title = value.title;
				this.$refs.createPopup.setSharePopupShow(false);
			},
			// 分页获取收藏夹内容
			async getFavoritesContentList() {
				uni.showLoading({
					title: "加载中",
				});
				const {
					page,
					limit
				} = this.pagination;
				const favoriteId = this.favoriteId;
				try {
					const res = await getFavoritesContent({
						favoriteId,
						page,
						limit,
					});
					if (res) {
						const list = res.records;
						const total = res.total;
						this.dataList = [...this.dataList, ...list];
						this.pagination.total = total;
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				} catch (error) {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			},
		},
		/**
		 * 初始化
		 */
		onLoad(options) {
			const {
				id,
				title,
				parentId,
				description,
				category
			} = options;
			this.id = id;
			this.favoriteId = id;
			this.title = title;
			this.parentId = parentId;
			this.description = description;
			this.category = category;
			this.getFavoritesContentList();
		},
		// 触底
		onReachBottom() {
			if (this.pagination.total > this.dataList.length) {
				this.pagination.page += 1;
				this.getFavoritesContentList();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.dataList = [];
			this.pagination.page = 1;
			this.getFavoritesContentList();
		},
	};
</script>

<style lang="less" scoped>
	.collection-detail {
		height: 100%;

		.customer-bar-header {
			position: relative;
			width: 100%;
			padding: 0 28rpx;
			line-height: 44px;
			border-bottom: 2rpx solid #f0f0f0;

			.icon,
			text {
				display: inline-block;
				position: relative;
				top: 24rpx;
			}

			.navigate-title {
				font-size: 34rpx;
				color: #333;
				font-weight: 500;
				max-width: 460rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				position: relative;
				top: 16rpx;
			}

			.operation-image {
				position: relative;
				top: 20rpx;

				.navigate-image {
					margin-top: 15rpx;
					width: 60rpx;
					height: 60rpx;
				}

				.operation {
					position: absolute;
					top: 64rpx;
					right: 4rpx;
					background: #fff;
					width: 208rpx;
					font-size: 28rpx;
					padding: 10rpx 0 10rpx 27rpx;
					line-height: 28rpx;
					text-align: center;
					z-index: 999;
					border-radius: 12rpx;
					border: 1px solid #ededed;

					.operation-item {
						padding-top: 28rpx;

						.edit {
							border-bottom: 2rpx solid #ededed;
						}

						.edit,
						.delete {
							padding-right: 27rpx;
							padding-bottom: 28rpx;
						}
					}

					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 12rpx;
					}
				}

				.operation:before {
					box-sizing: content-box;
					width: 0;
					height: 0;
					position: absolute;
					top: -30rpx;
					right: 8rpx;
					padding: 0;
					border-bottom: 8px solid #ffffff;
					border-top: 8px solid transparent;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
					z-index: 2;
					content: "";
				}

				.operation:after {
					box-sizing: content-box;
					width: 0;
					height: 0;
					position: absolute;
					top: -34rpx;
					right: 6rpx;
					padding: 0;
					border-bottom: 9px solid #ededed;
					border-top: 9px solid transparent;
					border-left: 9px solid transparent;
					border-right: 9px solid transparent;
					z-index: 1;
					content: "";
				}
			}
		}

		.delete-image {
			position: absolute;
			top: 30rpx;
			right: 28rpx;

			image {
				width: 36rpx;
				height: 36rpx;
			}

			.delete {
				position: absolute;
				top: 40rpx;
				right: -10rpx;
				width: 100rpx;
				padding: 20rpx 24rpx;
				background: #fff;
				font-size: 28rpx;
				color: #333;
				border-radius: 8rpx;
				border: 1px solid #ededed;
				z-index: 999;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-top: 4rpx;
				}
			}

			.delete:before {
				box-sizing: content-box;
				width: 0;
				height: 0;
				position: absolute;
				top: -30rpx;
				right: 8rpx;
				padding: 0;
				border-bottom: 8px solid #ffffff;
				border-top: 8px solid transparent;
				border-left: 8px solid transparent;
				border-right: 8px solid transparent;
				z-index: 2;
				content: "";
			}

			.delete:after {
				box-sizing: content-box;
				width: 0;
				height: 0;
				position: absolute;
				top: -34rpx;
				right: 6rpx;
				padding: 0;
				border-bottom: 9px solid #ededed;
				border-top: 9px solid transparent;
				border-left: 9px solid transparent;
				border-right: 9px solid transparent;
				z-index: 1;
				content: "";
			}
		}

		/* 提示窗口 */
		.uni-tip {
			/* #ifndef APP-NVUE */
			display: flex;
			flex-direction: column;
			/* #endif */
			padding: 15px;
			width: 300px;
			background-color: #fff;
			border-radius: 10px;
		}

		.uni-tip-title {
			margin-bottom: 10px;
			text-align: center;
			font-weight: bold;
			font-size: 16px;
			color: #333;
		}

		.uni-tip-content {
			font-size: 14px;
			color: #666;
		}

		.uni-tip-group-button {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			margin-top: 20px;
		}

		.uni-tip-button {
			flex: 1;
			text-align: center;
			font-size: 14px;
			color: #3b4144;
		}
	}
</style>
