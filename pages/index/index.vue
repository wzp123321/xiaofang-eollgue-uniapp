<template>
	<view class="content">
		<!-- <view class="status_bar"></view> -->
		<view class="view-content" :style="{height: contentHeight + 'px'}" :height="contentHeight">
			<Normative v-if="current === 0" :height="contentHeight" />
			<NormativeInter v-if="current === 1" />
			<Person v-if="current === 2" />
			<!-- <view class="set-position"></view> -->
		</view>
	</view>
</template>

<script>
	import Normative from '../normative/index.vue';
	import NormativeInter from '../normative-interpretation/normative-interpretation';
	import Person from '../personal-module/personal/personal';
	export default {
		data() {
			return {
				title: 'Hello',
				current: 0,
				contentHeight: 574
			};
		},
		components: {
			Normative,
			NormativeInter,
			Person
		},
		onLoad() {},
		mounted() {
			uni.$on('changeTab', this.changeTab);
			this.$nextTick(() => {
				this.getContentHeight();
			});
			// 动态改变content高度
			// window.addEventListener('resize', () => {
			// 	this.getContentHeight()
			// })
		},
		methods: {
			// tabBar change事件
			changeTab(tabId) {
				this.current = tabId;
				uni.setNavigationBarTitle({
					title: this.tabArr[tabId].tabName,
					success(t) {
						console.log(t)
						if (tabId === 2) {
							uni.setNavigationBarColor({
								frontColor: '#ffffff',
								backgroundColor: '#251E1E',
							})
						} else {
							uni.setNavigationBarColor({
								frontColor: '#000000',
								backgroundColor: '#FFFFFF',
							})
						}
					}
				});
			},
			// 计算内容区域的高度
			async getContentHeight() {
				const sysInfo = uni.getSystemInfoSync();
				const query = uni.createSelectorQuery().in(this);
				const tabBar = query.select('.tab-bar');
				// const tabbarNodeRes = await this.syncBoundingClientRect(tabBar);
				// console.log(tabbarNodeRes)
				const pageHeight = sysInfo.windowHeight;
				this.contentHeight = pageHeight;
			},
			syncBoundingClientRect(nodeobj) {
				return new Promise((resolve, reject) => {
					nodeobj
						.boundingClientRect(data => {
							resolve(data);
						})
						.exec();
				});
			}
		},
		computed: {
			tabArr() {
				return this.$store.state.tabbarModule.tabArr;
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.tabArr[0].tabName
			});
		}
	};
</script>

<style>
	.status_bar {
		/* height: var(--status-bar-height); */
		width: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		height: 100%;
		margin-top: -1px;
	}

	.view-content {
		overflow: auto
	}

	.set-position {
		padding: 10rpx 0;
	}
</style>
