<template>
	<view>
		<view class="classic-content">
			<CommentItem v-for="(item, key) in list" :hasAction="true"  :key="'comment_idx_' + key" :item="item" :isLast="key === list.length - 1" />
		</view>
		<view class="no-more" v-if="!hasMore">已经到底部，没有更多了~</view>
		<no-data v-if="!list.length" />
	</view>
</template>

<script>
	import { fetchLatest } from '../../../service/normative.js'
	import CommentItem from '../components/comment/index.vue'; 
	export default {
		onLoad() {
			this.initData()
		},
		data() {
			return {
				pageParam: {
					page: 1,
					limit: 5
				},
				pages: 1,
				list: [],
				hasMore: true
			}
		},
		components: {
			CommentItem
		},
		methods: {
			async initData() {
				const res = await fetchLatest(this.pageParam)
				if (res.pages !== this.pages) {
					this.pages = res.pages
				}
				if (res.records) {
					this.list = this.list.concat(res.records)
				}
			}
		},
		onReachBottom() {
			if (this.pageParam.page < this.pages) {
				this.pageParam.page += 1
				this.initData()
				this.hasMore = true
			} else {
				this.hasMore = false
			}
		}
	}
</script>

<style lang="less" scoped>
.classic-content {
	margin: 28rpx;
	box-shadow: 0px 6px 33px 0px rgba(124, 124, 124, 0.18);
	padding: 0 24rpx;
	border-radius: 12rpx;
}
.no-more {
	text-align: center;
	font-size: 20rpx;
	color: #999999;
	line-height: 28rpx;
}
</style>
