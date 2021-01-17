<template>
	<view class="search-container">
		<uni-nav-bar :fixed="true" left-icon="back" right-text="搜索" :status-bar="true" @clickLeft="goBack" @clickRight="search">
			<uni-search-bar :autoFocus="true" style="width: 100%;" bgColor="#FFF2F2F2" radius="100" placeholder="请输入搜索内容"
			 clearButton="none" cancelButton="none" @confirm="search" @input="searchHandler" />
		</uni-nav-bar>
		<view class="search-container-wrap">
			<view class="search-container-wrap-tab">
				<view class="search-container-wrap-tab-item" :class="{'selected': tabIndex === 0}" @tap="switchTab(0)">规范全文</view>
				<view class="search-container-wrap-tab-item" :class="{'selected': tabIndex === 1}" @tap="switchTab(1)">规范标题</view>
				<view class="search-container-wrap-tab-item" :class="{'selected': tabIndex === 2}" @tap="switchTab(2)">规范内容</view>
			</view>
			<view class="search-container-wrap-content" v-if="dataList.length">
				<SearchTitle v-for="(item, idx) in dataList" :key="'search_item_' + idx" :item="item" :keyword="searchTxt" />
			</view>
		</view>
		<no-data v-if="!dataList.length" style="padding-bottom: 40px;" />
	</view>
</template>

<script>
	import {
		search
	} from '../../service/page.js'
	import SearchTitle from './components/search-title/index.vue'
	export default {
		onLoad(options) {
			// 如果存在规范no
			if (options.normsNo) {
				this.normsNo = options.normsNo
			} else if (options.type) {
				// 如果存在类型
				this.type = options.type
			}
		},
		components: {
			SearchTitle
		},
		data() {
			return {
				pageParam: {
					page: 1,
					limit: 10
				},
				searchTxt: '',
				tabIndex: 0,
				dataList: [],
				hasMore: false,
				total: 0,
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			// flag 标示点击tab切换时触发搜索
			search() {
				uni.showLoading({
					title: '正在为您搜索中...'
				})
				if (!this.searchTxt) {
					uni.showToast({
						title: '请输入搜索的内容',
						icon: 'none',
						position: 'bottom'
					})
					return
				}
				this.dataList = [];
				this.pageParam.page = 1;
				this.total = 0
				this.fetchData()
				this.pageParam.page = 1
			},
			searchHandler(txt) {
				this.searchTxt = txt.value
			},
			switchTab(tabIndex) {
				this.tabIndex = tabIndex
				this.search()
			},
			async fetchData() {
				try {
					const res = await search(Object.assign({}, this.pageParam, {
						content: this.searchTxt,
						type: this.tabIndex === 0 ? '' : this.tabIndex,
						normsType: this.normsNo || ''
					}))
					if (res) {
						this.total = res.total
						this.dataList = [...this.dataList, ...res.records]
					}
				} catch (e) {
					console.log('搜索错误', e)
				}
				setTimeout(() => {
					uni.hideLoading()
					uni.stopPullDownRefresh()
				}, 1000)
			}
		},
		onReachBottom() {
			if (this.total > this.dataList.length) {
				this.pageParam.page += 1
				this.fetchData()
			}
		},
		onPullDownRefresh() {
			this.search()
		}
	}
</script>

<style lang="less" scoped>
	.search-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: start;

		&-wrap {
			flex: 1;
			padding: 0 28rpx;
			position: relative;
			background-color: #fff;

			&-tab {
				display: flex;
				justify-content: space-around;
				flex-direction: row;
				padding: 20rpx 0;

				&-item {
					font-size: 28rpx;
					line-height: 50rpx;
					font-weight: 400;
					position: relative;

					&.selected {
						font-size: 36rpx;
						color: #FCD002;
					}

					&.selected::after {
						content: '';
						position: absolute;
						width: 40rpx;
						height: 6rpx;
						background-color: #FCD002;
						bottom: -6rpx;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}

		&-nodata {
			width: 323rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			text-align: center;

			&-img {
				width: 323rpx;
				height: 203rpx;
				flex-shrink: 0;
			}

			&-txt {
				font-size: 28rpx;
				color: #999999;
				line-height: 36rpx;
				padding-top: 48rpx;
			}
		}
	}
</style>
