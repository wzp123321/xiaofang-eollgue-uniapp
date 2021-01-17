<template>
	<view class="demo-wrap" :style="{'height': deviceInfo.windowHeight + 'px' }">
		<uni-nav-bar :fixed="true" title="建筑规范" left-icon="back" right-icon="search" :status-bar="true" @clickLeft="goBack" />
		<view class="content-wrap" :style="videoStyle">
			<view class="content-list" :style="videoStyle">
				<template v-for="(item, idx) in contentArr" >
					<scroll-view :style="videoStyle" @scroll="scroll" show-scrollbar="false" scroll-y="true" scroll-x="fasle" @touchstart="touchstart" @touchend="touchend" v-if="current === idx" :key="'item_' + idx">
						<rich-text :nodes="item.clauseContent" id="childDom"></rich-text>
					</scroll-view>
				</template>
			</view>
		</view>
	</view>
</template>
<script>
	const deviceInfo = uni.getSystemInfoSync()
	if (deviceInfo.brand == 'Xiaomi') {
		deviceInfo.windowHeight += 1
	}
	import {
		fetchContentDetail
	} from '../../service/normative.js'
	export default {
		onLoad(options) {
			const originData = JSON.parse(decodeURIComponent(options.originData))
			const chapterData = JSON.parse(decodeURIComponent(options.chapterData))
			this.originData = originData
			this.chapterData = chapterData
		},
		onReady() {
			this.initData()
		},
		data() {
			return {
				statusBarHeight: deviceInfo.statusBarHeight + 'px',
				loadMoreHeight: deviceInfo.windowHeight * 2, // 触发 loadmore 事件所需要的垂直偏移距离 加载到剩余2	 继续加载
				videoStyle: {
					width: "750rpx",
					height: (deviceInfo.windowHeight - 44) + 'px'
				},
				deviceInfo,
				originData: {},
				chapterData: {},
				showTab: -1,
				current: 0,
				contentArr: [],
				fatherDomRect: {},
				childDomRect: {},
				scrollTop: 0
			}
		},
		methods: {
			async initData() {
				try {
					const res = await fetchContentDetail({
						normsNo: this.chapterData.normsNo,
						chaptersNo: this.chapterData.chaptersNo
					})
					if (res && res.length) {
						this.contentArr = res;
						this.$nextTick(() => {
							this.calculateRect()
						})
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					uni.showToast({
						title: e.data.message,
						icon: 'none'
					})
				}
			},
			transforHtml(html) {
				return htmlParse(html)
			},
			goBack() {
				uni.navigateBack()
			},
			swiperChange(e) {
				console.log(e)
			},
			calculateRect() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#childDom').boundingClientRect(data => {
					this.childDomRect = data
					console.log(data)
				}).exec()
			},
			touchstart(e) {
				this.pageY = e.changedTouches[0].pageY
			},
			touchend(e) {
				const dis = e.changedTouches[0].pageY
				console.log(this.pageY - dis)
				if (
					(Math.floor(this.childDomRect.height) === this.scrollTop + (deviceInfo.windowHeight - 44) && this.pageY - dis > 150) || 
					(this.childDomRect.height < (deviceInfo.windowHeight - 44) && this.pageY - dis > 150)
				) {
					if (this.current < this.contentArr.length - 1) {
						this.current += 1
						this.$nextTick(() => {
							this.calculateRect()
						})
					}
				} else if (this.scrollTop === 0 && this.pageY - dis < -150) {
					if (this.current > 0) {
						this.current -= 1
						this.$nextTick(() => {
							this.calculateRect()
						})
					}
				}
			},
			scroll(e) {
				this.scrollTop = e.detail.scrollTop
			}
		}
	}
</script>

<style scoped lang="less">
	.demo-wrap {
		position: relative;
		height: 100%;
		overflow: hidden;
		&-content {
			height: 100%;
			overflow: hidden;
			&-view {
				display: flex;
				flex-direction: column;
				height: 100%;
				overflow: hidden;
				&-item {
					height: 50%;
					overflow: auto;
				}
			}
		}
	}
	.content-wrap {
		 position: relative;
		      height: 100%;
	}
	.content-list {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.content-cell {
		height: 100%;
		overflow: auto;
	}
</style>
