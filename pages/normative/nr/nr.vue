<!--国家规范/行业标准/地方标准/公安部令-->
<template>
	<view style="height: 100%">
		<uni-nav-bar :fixed="true" :title="getTitle()" left-icon="back" right-icon="search" :status-bar="true" @clickLeft="goBack"
		 @clickRight="search" />
		<view class="iner-normative">
			<view v-if="list.length > 0">
				<view class="iner-normative-banner">
					<image :src="bannerImg" class="iner-normative-banner-img"></image>
					<view class="iner-normative-title">
						{{ navTitle[tabIdx - 1] }}{{ moduleCount }}本规范
					</view>
				</view>
				<view class="iner-normative-list">
					<NrItem v-for="(item, idx) in list" :item="item" :key="'nr_item_' + idx" :userInfo="userInfo" @setVip="setVip" />
				</view>
				<view class="no-more" v-if="!hasMore && list.length > pageParam.limit">已经到底部，没有更多了~</view>
			</view>
			<Nodata v-else message="暂无数据"></Nodata>
		</view>
		<!-- vip提示 -->
		<vipWarn ref="vipPopup" :mask="true" operation="下载"></vipWarn>
	</view>
</template>

<script>
	import {
		channelNormsList,
		fetchNormModuleCount,
	} from "../../../service/normative.js";
	import {
		getUserInfo
	} from "../../../service/personal.js";
	import {
		mapActions
	} from "vuex";
	import NrItem from "../components/nr-item/index.vue";
	import vipWarn from "@/components/vip-warn/vip-warn.vue";
	import Nodata from "@/components/no-data/no-data.vue";
	export default {
		onLoad(option) {
			// 获取参数，区分tab
			this.tabIdx = option.normsType;
			uni.setNavigationBarTitle({
				title: this.navTitle[Number(this.tabIdx) - 1],
			});
			this.initData();
			this.fetchNormModuleCount();
		},
		components: {
			NrItem,
			vipWarn,
			Nodata,
		},
		data() {
			return {
				tabIdx: 0,
				navTitle: ["国家标准", "行业标准", "地方标准", "公安部令"],
				pageParam: {
					page: 1,
					limit: 10,
				},
				list: [],
				hasMore: true,
				userInfo: {},
				moduleCount: 0,
			};
		},
		methods: {
			...mapActions(["setUserInfo"]),
			// 查询数量
			async fetchNormModuleCount() {
				const res = await fetchNormModuleCount(this.tabIdx);
				if (res) {
					this.moduleCount = res;
				}
			},
			setVip() {
				this.vipToast(true);
			},
			// 显示隐藏vip提示
			vipToast(value) {
				if (this.$refs.vipPopup) {
					this.$refs.vipPopup.setVipWarnShow(value);
				}
			},
			getTitle() {
				return this.navTitle[Number(this.tabIdx) - 1];
			},
			// 初始化
			async initData() {
				uni.showLoading({
					title: "加载中",
				});
				try {
					const listRes = await channelNormsList(
						Object.assign({}, {
								normsType: this.tabIdx,
							},
							this.pageParam
						)
					);
					if (listRes) {
						this.list = this.list.concat(listRes);
						if (this.list.length < this.pageParam.limit * this.pageParam.page) {
							this.hasMore = false;
						}
						uni.hideLoading();
						uni.stopPullDownRefresh();
					} else {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				} catch (e) {
					uni.showToast({
						title: "查询失败",
						icon: "none",
					});
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			},
			// 返回
			goBack() {
				uni.navigateBack();
			},
			// 跳转搜索
			search() {
				uni.navigateTo({
					url: "/pages/new-search/new-search?normsNo=" + this.tabIdx,
				});
			},
			// 获取用户信息
			async getUserInfo() {
				const res = await getUserInfo();
				if (res) {
					let userInfo = res;
					userInfo.vipExpiresTime = this.$formateTime(res.vipExpiresTime);
					this.userInfo = userInfo;
					this.setUserInfo(userInfo);
				}
			},
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.list = [];
			this.pageParam = 1;
			await this.initData();
		},
		// 触底
		onReachBottom() {
			if (this.hasMore) {
				this.pageParam.page += 1;
				this.initData();
			}
		},
		computed: {
			bannerImg() {
				switch (Number(this.tabIdx)) {
					case 1:
						return "/static/normative/test-iner.png";
					case 2:
						return "/static/normative/hangye.png";
					case 3:
						return "/static/normative/difang.png";
					case 4:
						return "/static/normative/gonganbu.png";
					default:
						return "/static/normative/test-iner.png";
				}
			},
		},
		async onShow() {
			this.vipToast(false);
			await this.getUserInfo();
		},
	};
</script>

<style lang="less" scoped>
	.iner-normative {
		height: calc(100% - 100px);
		position: relative;
		padding: 17rpx 28rpx;

		&-banner {
			width: 100%;
			height: 200rpx;
			overflow: hidden;

			&-img {
				width: 100%;
				height: 200rpx;
			}
		}

		&-title {
			position: absolute;
			font-size: 48upx;
			color: #fff;
			font-weight: 550;
			top: 84upx;
			left: 180upx;
			letter-spacing: 0.05em;
		}

		.no-more {
			text-align: center;
			font-size: 20rpx;
			color: #999999;
			line-height: 40rpx;
			height: 40rpx;
		}

		::v-deep .no-data-wrap {
			padding: 500rpx 0;
		}
	}
</style>
