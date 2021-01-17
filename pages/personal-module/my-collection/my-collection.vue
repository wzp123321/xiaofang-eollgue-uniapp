<template>
	<view class="my-collection">
		<view class="module-item flex-row-space" v-for="(item,index) in dataList" :key="index" @tap="linkToListInfo(item.title,item.id,item.category)">
			<view class="flex-row">
				<image :src="imgUrls[index]" mode=""></image>
				<view class="flex-column">
					<view class="title">
						{{item.title}}
					</view>
					<view class="description">
						{{item.description}}
					</view>
				</view>
			</view>
			<view class="total">
				{{item.contentCount || 0}}个内容
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserFavoritesList
	} from '../../../service/personal.js'
	export default {
		data() {
			return {
				imgUrls: ['../../../static/personal/guifan.png', '../../../static/personal/guifanjiedu.png'],
				dataList: []
			};
		},
		methods: {
			linkToListInfo(title, id, category) {
				uni.setStorageSync('collectParentId', id)
				uni.navigateTo({
					url: '../favorites-list/favorites-list?title=' + title + '&category=' + category
				})
			},
			// 请求我的收藏夹
			async getUserFavoritesList() {
				uni.showLoading({
					title: '加载中'
				})
				const res = await getUserFavoritesList()
				if (res) {
					this.dataList = res
				}
				uni.hideLoading()
				uni.stopPullDownRefresh()
			}
		},
		onShow() {
			this.getUserFavoritesList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getUserFavoritesList()
		}
	}
</script>

<style lang="less">
	.my-collection {
		padding: 0 20upx;

		.module-item {
			position: relative;
			padding: 40upx 20upx;
			margin-bottom: 36upx;
			background: #fff;
			border-bottom: 2upx solid #eee;
			font-size: 13px;
			color: #999;
			box-shadow: 0px 6upx 33upx 0px rgba(124, 124, 124, 0.18);

			image {
				width: 90upx;
				height: 90upx;
				border-radius: 10upx;
				margin-right: 20upx;
			}

			.title {
				font-size: 14px;
				color: #333;
				font-weight: bold;
				margin-bottom: 16upx;
			}

			.total {
				line-height: 90upx;
			}
		}
	}
</style>
