<template>
	<view class="interpretation-wrapper">
		<view v-if="hasInternet">
			<specificationInterpretation v-for="(item, index) in dataList" :key="index" :InterpretationInfo="item" :borderColor="index === dataList.length - 1 ? '#FFF' : '#EDEDED'"></specificationInterpretation>
			<uniLoadMore v-if="pagination.total !== 0 && pagination.total > dataList.length" :status="status"></uniLoadMore>
		</view>
		<noData :message="message" v-else> </noData>
	</view>
</template>

<script>
	import {
		getNormsInterpretationList
	} from "../../service/normsInterpretation.js";
	import specificationInterpretation from "@/components/specification-Interpretation/specification-Interpretation.vue";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import noData from "@/components/no-data/no-data.vue";
	export default {
		data() {
			return {
				dataList: [],
				pagination: {
					page: 1,
					total: 0,
					limit: 10,
				},
				status: "more", // more（loading前）、loading（loading中）、noMore（没有更多了）
				hasInternet: true, // 是否有网络
				message: "暂无网络",
			};
		},
		components: {
			specificationInterpretation,
			uniLoadMore,
			noData,
		},
		methods: {
			// 请求列表
			async getNormativeList() {
				uni.showLoading({
					title: "加载中",
				});
				const {
					page,
					limit
				} = this.pagination;
				const res = await getNormsInterpretationList({
					page,
					limit,
				});
				if (res) {
					const list = res.records;
					const total = res.total;
					this.dataList = [...this.dataList, ...list];
					this.pagination.total = total;
					if (total === 0) {
						this.hasInternet = false;
						this.message = "暂无数据";
					} else {
						this.hasInternet = true;
					}
				}
				uni.hideLoading();
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			// 初始化数据
			initData() {
				this.dataList = [];
				this.pagination = {
					page: 1,
					total: 0,
					limit: 10,
				};
				this.status = "more";
			},
			// 获取网络状态
			getInternetState() {
				const that = this;
				uni.getNetworkType({
					success(res) {
						if (res && res.networkType === "none") {
							that.hasInternet = false;
							this.message = "暂无网络";
						} else {
							that.hasInternet = true;
							that.getNormativeList();
						}
					},
				});
			},
		},
		//页面触底
		onReachBottom() {
			if (this.pagination.total > this.dataList.length) {
				this.status = "loading";
				this.pagination.page += 1;
				this.getNormativeList();
				setTimeout(() => {
					this.status = "noMore";
				}, 1000);
			}
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.initData();
			await this.getNormativeList();
		},
		// 监听网络状态
		onShow() {
			this.pagination.page = 1;
			this.dataList = [];
			this.getInternetState();
		},
	};
</script>

<style lang="less" scoped>
	.interpretation-wrapper {
		position: relative;
		width: 100%;
		height: 100%;

		::v-deep .no-data-wrap {
			padding: 500rpx 0;
		}
	}
</style>
