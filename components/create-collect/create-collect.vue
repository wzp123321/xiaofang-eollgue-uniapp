<template>
	<uniPopup type="bottom" ref="collectPopup">
		<view class="create-collect-wrapper">
			<view class="vip--collect-modal">
				<image class="close-image" src="/static/close.svg" mode="aspectFill" @tap="handleChooseClose"></image>
				<view class="modal-title">
					{{category===1?'规范':'规范解读'}}收藏夹
				</view>
				<view class="descritpion">
					（已选择1个收藏夹）
				</view>
				<view class="create-collect flex-row" @click="handleCreatePopupShow">
					<image src="/static/interpretation/create.svg" mode=""></image>
					新建收藏夹
				</view>
				<radio-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd flex-row-space" v-for="item in childCollectList" :key="item.id">
						<view class="flex-column">
							<view class="collectTitle">
								{{item.title}}
							</view>
							<view class="count">
								{{item.contentCount || 0}}个内容
							</view>
						</view>
						<view>
							<radio :value="item.id+''" :checked="favoriteId===item.id" />
						</view>
					</label>
				</radio-group>
				<button type="default" class="submit-btn" @tap="handleCreateCollection" :disabled="childCollectList.length === 0">完成</button>
			</view>
		</view>
		<collectlistEditPopup ref="createPopup" :parentId="parentInfo.id" :id="0" @success="handleCollCreateSuccess"></collectlistEditPopup>
	</uniPopup>
</template>

<script>
	import {
		getChildrenFavorites,
		getInterpretationCollect,
		getUserFavoritesList
	} from '../../service/personal.js'
	import {
		fetchNormsCollect
	} from '../../service/normative.js'

	import uniPopup from '../uni-popup/uni-popup.vue';
	var graceChecker = require('../../utils/graceChecker.js');
	import collectlistEditPopup from '../collectlist-edit-popup/collectlist-edit-popup.vue'
	export default {
		props: {
			// 收藏夹类型 1-规范  2-解读
			category: {
				type: Number,
				default: 1
			},
			// 收藏传参
			collectData: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				parentInfo: {}, // 父级收藏夹详情
				childCollectList: [], // 全部收藏夹列表
				favoriteId: 0, // 当前选中的收藏夹id
			};
		},
		components: {
			uniPopup,
			collectlistEditPopup
		},
		methods: {
			initData() {
				this.parentInfo = {}; // 父级收藏夹详情
				this.childCollectList = []; // 全部收藏夹列表
				this.favoriteId = 0; // 当前选中的收藏夹id
			},
			// 显示 - 隐藏
			setCollectPopupShow(value) {
				if (value) {
					this.$refs.collectPopup.open()
					this.getParentCollectInfo()
					this.initData()
				} else {
					this.$refs.collectPopup.close()
				}
			},
			// 关闭选择收藏夹弹框
			handleChooseClose() {
				this.setCollectPopupShow(false)
				this.$emit('hideTan')
			},
			// 打开新增弹框
			handleCreatePopupShow() {
				this.$refs.createPopup.setSharePopupShow(true)
			},
			// 新增收藏夹成功回调
			handleCollCreateSuccess() {
				this.$refs.createPopup.setSharePopupShow(false)
				this.getChildCollectList();
			},
			// 获取子收藏夹列表
			async getChildCollectList() {
				uni.showLoading({
					title: '加载中'
				})
				const childRes = await getChildrenFavorites(this.parentInfo.id)
				if (childRes) {
					// 将解读收藏夹放到收藏夹列表首位
					this.childCollectList = [this.parentInfo, ...childRes];
					uni.hideLoading()
				}
			},
			// 获取父级收藏夹详情
			async getParentCollectInfo() {
				const res = await getUserFavoritesList()
				if (res) {
					res.forEach(item => {
						if (item.category === this.category) {
							this.parentInfo = item
							this.favoriteId = item.id
							this.getChildCollectList()
						}
					})
				}
			},
			// 选择
			checkboxChange(e) {
				this.favoriteId = Number(e.detail.value)
			},
			// 调用收藏
			async handleCreateCollection() {
				const {
					interpretationId
				} = this.collectData
				const {
					favoriteId
				} = this
				const params = Object.assign(this.collectData, {
					favoriteId
				})
				const res = this.category === 1 ? await fetchNormsCollect(params) : await getInterpretationCollect(favoriteId,
					interpretationId)
				if (res) {
					uni.showToast({
						icon: 'success',
						title: '收藏成功'
					})
					this.$emit('success')
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.create-collect-wrapper {
		position: relative;

		.vip--collect-modal {
			padding: 28rpx 28rpx 120rpx 28rpx;
			background: #fff;
			border-radius: 16rpx 16rpx 0 0;
			position: relative;

			.close-image {
				width: 24rpx;
				height: 24rpx;
				position: absolute;
				top: 26rpx;
				right: 26rpx;
			}

			.modal-title {
				text-align: center;
				font-size: 36rpx;
			}

			.descritpion {
				text-align: center;
				font-size: 24rpx;
				color: #999;
			}

			.create-collect {
				font-size: 32rpx;
				color: #FCD002;
				padding: 33rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				image {
					width: 32rpx;
					height: 32rpx;
					position: relative;
					top: 4rpx;
					margin-right: 10rpx;
				}
			}

			.uni-list-cell {
				padding: 13rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				.collectTitle {
					color: #333333;
					font-size: 32rpx;
				}

				.count {
					font-size: 20rpx;
					color: #999999;
				}

				.uni-checkbox-wrapper {
					position: relative;
					top: 4rpx;
				}
			}

			.submit-btn {
				background: #FCD002;
				font-size: #333;
				border-radius: 40rpx;
				margin-top: 84rpx;
			}
		}
	}
</style>
