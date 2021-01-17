<template>
	<view class="wrap-container" slot="content-list">
		<uni-nav-bar :fixed="true" :statusBar="true">
			<view class="postion-search" @click="toSearch">
				<icon size="14" type="search"></icon>
				<text class="postion-search-txt">请搜索相关规范</text>
			</view>
		</uni-nav-bar>
		<view v-if="hasInternet">
			<view class="banner">
				<swiper class="banner-swiper" :autoplay="true" :interval="4000">
					<swiper-item class="banner-swiper-item" v-for="(item, idx) in bannerList" :key="'banner_' + idx">
						<!-- <image :src="item.httpUrl" v-if="item.status === 1" class="banner-swiper-item-img"></image> -->
						<image :src="item.imageUrl" v-if="item.status === 1" class="banner-swiper-item-img" @tap="handleBannerClick(item.httpUrl)"></image>
					</swiper-item>
				</swiper>
			</view>
			<!--首页四个-->
			<view class="main-tab-wrap">
				<view class="main-tab-wrap-item" @tap="toIner(1)">
					<image class="main-tab-wrap-item-img" src="/static/normative/n-tab1.svg"></image>
					<view class="main-tab-wrap-item-txt">国家标准</view>
				</view>
				<view class="main-tab-wrap-item" @tap="toIner(2)">
					<image class="main-tab-wrap-item-img" src="/static/normative/n-tab2.svg"></image>
					<view class="main-tab-wrap-item-txt">行业标准</view>
				</view>
				<view class="main-tab-wrap-item" @tap="toIner(3)">
					<image class="main-tab-wrap-item-img" src="/static/normative/n-tab3.svg"></image>
					<view class="main-tab-wrap-item-txt">地方标准</view>
				</view>
				<view class="main-tab-wrap-item" @tap="toIner(4)">
					<image class="main-tab-wrap-item-img" src="/static/normative/n-tab4.svg"></image>
					<view class="main-tab-wrap-item-txt">公安部令</view>
				</view>
			</view>
			<!--最近上传-->
			<view class="recent-upload-wrap">
				<view class="recent-upload-wrap-title">
					<image src="/static/normative/upload.svg" class="recent-upload-wrap-title-icon" />
					<view class="recent-upload-wrap-title-name">最近上传</view>
				</view>
				<view style="position: relative;min-height: 440rpx;">
					<block v-if="recentUploadList.length > 0">
						<PaperItem v-for="(item, idx) in recentUploadList" :detail="item" :key="'paperItem_' + idx" :isLast="idx === recentUploadList.length - 1" />
					</block>
					<noData v-else message="暂无数据"></noData>
				</view>
			</view>
			<!--经典评论-->
			<view class="comment-list">
				<view class="comment-list-header">
					<view class="comment-list-header-left">
						<image src="/static/normative/comment.svg" class="comment-list-header-left-icon" />
						<view class="comment-list-header-left-name">经典评论</view>
					</view>
					<view class="comment-list-header-right icon" @tap="toClassic">查看更多</view>
				</view>
				<view class="comment-list-content">
					<view v-if="classicList.length>0">
						<CommentItem :count="item.images.length" :hasAction="true" v-for="(item, idx) in classicList" :key="'classic_item_' + idx"
						 :item="item" :isLast="idx === classicList.length - 1" />
					</view>
					<noData v-else message="暂无数据"></noData>
				</view>
			</view>
			<view class="recent-comment">
				<view class="recent-comment-header">
					<view class="recent-comment-header-left">
						<image src="/static/normative/recent-comment.svg" class="recent-comment-header-left-icon" />
						<view class="recent-comment-header-left-name">最近评论</view>
					</view>
					<view class="recent-comment-header-right icon" @tap="toLatest">查看更多</view>
				</view>
				<view class="recent-comment-content">
					<block v-if="latestList.length>0">
						<CommentItem :count="item.images.length" :hasAction="true" v-for="(item, idx) in latestList" :key="'latest_item_' + idx"
						 :item="item" :isLast="idx === latestList.length - 1" />
					</block>
					<noData v-else message="暂无数据"></noData>
				</view>
			</view>
			<view class="set-position"></view>
		</view>
		<noData style="padding-top: 1400rpx;" message="暂无网络" v-else></noData>
	</view>
</template>

<script>
	import {
		fetchBanner,
		fetchRecentUpload,
		fetcClassic,
		fetchLatest
	} from '../../service/normative.js'
	import PaperItem from './components/paper/index.vue';
	import CommentItem from './components/comment/index.vue';
	import noData from '@/components/no-data/no-data.vue'
	export default {
		props: {
			height: {
				type: Number,
				default: () => 574
			}
		},
		components: {
			PaperItem,
			CommentItem,
			noData
		},
		data() {
			return {
				triggered: false,
				bannerList: [],
				recentUploadList: [],
				classicList: [],
				latestList: [],
				hasInternet: true
			};
		},
		onLoad() {
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000);
		},
		methods: {
			async initData() {
				await this.initBanner()
				await this.initRecentUploads()
				await this.initClassicList()
				await this.initLatestList()
			},
			// 初始化banner list
			async initBanner() {
				const bannerList = await fetchBanner()
				this.bannerList = bannerList
			},
			// banner跳转
			handleBannerClick(value) {
				if (!value) {
					return
				}
				const link = JSON.parse(JSON.stringify(value))
				try {
					const {
						type,
						data
					} = JSON.parse(link)
					switch (type) {
						case 0:
							uni.navigateTo({
								url: '/pages/np/np?normsNo=' + data.normsNo + '&title=' + data.title
							})
							break;
						case 1:
							uni.navigateTo({
								url: '/pages/normative-interpretation/normative-interpretation-info/normative-interpretation-info?id=' + data
									.id
							})
							break;
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			async initRecentUploads() {
				uni.showLoading({
					title: '加载中'
				})
				const recentList = await fetchRecentUpload({
					limit: 4
				})
				if (recentList) {
					this.recentUploadList = recentList
					uni.hideLoading()
				}
			},
			async initClassicList() {
				this.classicList = []
				const classicListRes = await fetcClassic({
					page: 1,
					limit: 6
				})
				this.classicList = classicListRes.records ? classicListRes.records : []
			},
			async initLatestList() {
				this.latestList = []
				const latestListRes = await fetchLatest({
					page: 1,
					limit: 6
				})
				this.latestList = latestListRes.records ? latestListRes.records : []
			},
			toIner(type) {
				uni.navigateTo({
					url: '/pages/normative/nr/nr?normsType=' + type,
					animationType: 'pop-in'
				});
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/new-search/new-search'
				})
			},
			// 去经典评论
			toClassic() {
				uni.navigateTo({
					url: 'classic/classic'
				})
			},
			// 去最新评论
			toLatest() {
				uni.navigateTo({
					url: 'latest/latest'
				})
			},
			// 获取网络状态
			getInternetState() {
				const that = this
				uni.getNetworkType({
					success(res) {
						if (res && res.networkType === 'none') {
							that.hasInternet = false
						} else {
							that.hasInternet = true
							that.initData();
						}
					}
				})
			}
		},
		async onPullDownRefresh() {
			this.getInternetState()
			await this.initData()
			uni.stopPullDownRefresh()
			uni.showToast({
				title: '刷新成功',
				icon: 'none'
			})
		},
		onShow() {
			this.initData()
			this.getInternetState()
		}
	};
</script>

<style lang="less" scoped>
	@import url('./style.less');

	::v-deep .no-data-wrap {
		padding: 50rpx 0;
	}
</style>
