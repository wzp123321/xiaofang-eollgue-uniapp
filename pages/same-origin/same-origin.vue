<template>
	<view>
		<uni-nav-bar :fixed="true" title="同类索引" left-icon="back" right-text=" " :status-bar="true" @clickLeft="goBack" @clickRight="search" />
		<view class="search-result" v-if="tree.length > 0">
			<view class="search-result-title">以下规范内有类似内容：</view>
			<view class="search-result-list">
				<SameOriginItem v-for="(item, idx) in tree" :item="item" :key="'item_' + idx"></SameOriginItem>
			</view>
		</view>
		<view class="same-wrap nodate" v-else>
			<no-data message="暂无结果"/>
		</view>
	</view>
</template>

<script>
	import SameOriginItem from './components/same-origin-item/same-origin-item.vue'
	import { fetchSimilar } from '../../service/normative.js'
	export default {
		onLoad(options) {
			this.pageParams.normsNo = options.normsNo
			this.pageParams.chaptersNo = options.chaptersNo || ''
			this.initData()
		},
		data() {
			return {
				tree: [],
				pageParams: {
					page: 1,
					limit: 10,
					normsNo: '',
					chaptersNo: '',
				},
				hasMore: true
			}
		},
		components: {
			SameOriginItem
		},
		methods: {
			async initData() {
				try{
					const res = await fetchSimilar(this.pageParams)
					if (res) {
						// makeTree(res)
						this.tree = this.tree.concat(res);
						if (this.tree.length < this.pageParams.page * this.pageParams.limit) {
							this.hasMore = false
						}
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			goBack() {
				uni.navigateBack()
			},
			search() {
				this.initData()
			}
		},
		onReachBottom(pix) {
			if (this.hasMore) {
				this.pageParams.page += 1;
				this.initData()
			}
		}
	}
</script>

<style lang="less" scoped>
.same-wrap {
	padding: 28rpx;
	position: relative;
	box-sizing: border-box;
	&.nodate {
		padding: 200rpx 0;
	}
}
.search-result {
	padding: 28rpx;
	&-title {
		font-size: 28rpx;
		color: #666666;
		font-weight: 400;
		line-height: 40rpx;
	}
	&-list {
		margin-top: 28rpx;
	}
}
</style>
