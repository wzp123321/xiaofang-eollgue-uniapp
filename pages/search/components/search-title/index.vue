<template>
	<view class="search-item" >
		<view class="search-item-title" v-html="highLightDecorator(item.title)" @tap="toContent"></view>
		<view class="search-item-sub" @tap="toContent">
			<text>编号：{{ item.normsNo }}</text>
			<text>{{ item.normsRegion }}</text>
		</view>
		<view class="search-item-content" v-html="highLightDecorator(item.content)" @tap="toContent"></view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			keyword: {
				type: String,
				default: () => ''
			}
		},
		methods: {
			// 高亮关键字
			highLightDecorator(content) {
				if (!this.keyword) {
					return content
				}
				if(!content){
					return ''
				}
				return content.replace(this.keyword, `<span class="mark" style="color: #FCD002;">${this.keyword}</span>`)
			},
			toContent() {
				if (this.item.chaptersNo && this.item.chaptersPid) {
					uni.navigateTo({
						url: '/pages/np-content/np-content?normsNo=' + this.item.normsNo + '&chaptersNo=' + this.item.chaptersPid +
							'&tap=' + this.item.chaptersNo + '&clauseNo=' + this.item.clauseNo
					})
				} else {
					http://localhost:8081/#/pages/np/np?normsNo=GB50016-2014&title=
					uni.navigateTo({
						url: '/pages/np/np?normsNo='+this.item.normsNo+'&title='+this.item.title
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-item {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		padding: 28rpx 0;
		border-bottom: 1rpx;
		border-bottom-color: #EDEDED;
		border-bottom-style: solid;

		&-title {
			font-size: 32rpx;
			line-height: 45rpx;

		}

		&-sub {
			font-size: 24rpx;
			font-weight: 400;
			line-height: 33rpx;
			color: #999999;
			margin-top: 16rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: row;
		}

		&-content {
			font-size: 28rpx;
			color: #666666;
			margin-top: 16rpx;
			display: -webkit-box;
			line-height: 40rpx;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			::v-deep img{
				width: 32px;
				height: 32px;
			}
		}
	}

	.mark {
		color: #FCD002;
	}
</style>
