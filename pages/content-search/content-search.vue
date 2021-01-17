<template>
	<view class="content-search">
		<uni-nav-bar :fixed="true" left-icon="back" right-text="搜索" :status-bar="true" @clickLeft="goBack" @clickRight="search">
			<uni-search-bar :autoFocus="true" style="width: 100%;" bgColor="#FFF2F2F2" radius="100" placeholder="请输入搜搜内容"
			 clearButton="none" cancelButton="none" @confirm="search" @input="searchHandler"/>
		</uni-nav-bar>
		<view class="content-search-wrap" v-if="list.length > 0">
			<view class="content-search-wrap-item" v-for="(item, idx) in list" :key="'item_' + idx" @tap="toContent(item)">
				<view class="content-search-wrap-item-content" v-html="highLightDecorator(filter(item.clauseContent))"></view>
			</view>
		</view>
		<view class="nodate" v-else>
			<no-data message="暂无结果"/>
		</view>
	</view>
</template>

<script>
	import { fetchNormsContent } from '../../service/normative.js'
	export default {
		onLoad(options) {
			this.normsNo = options.normsNo
		},
		data() {
			return {
				keyword: '',
				normsNo: '',
				list: []
			}
		},
		methods: {
			searchHandler(txt) {
				this.keyword = txt.value
			},
			goBack() {
				uni.navigateBack()
			},
			async search() {
				if (!this.keyword) return
				const res = await fetchNormsContent({
					normsNo: this.normsNo,
					content: this.keyword
				})
				if (res) {
					this.list = res
				}
			},
			highLightDecorator(content) {
				if (!this.keyword) {
					return content
				}
				return content.replace(this.keyword, `<span class="mark" style="color: #FCD002;">${this.keyword}</span>`)
			},
			filter(content) {
				if (!content) return '';
				let returnContent = '';
				returnContent = content.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto; display: none" ');
				returnContent = returnContent.replace(/\<table/gi, '<table style="max-width:100%;height:auto; display: none" ');
				return returnContent.substr(0, 200);
			},
			toContent(item) {
				if (item.chaptersNo && item.chaptersPid) {
					uni.navigateTo({
						url: '/pages/np-content/np-content?normsNo=' + item.normsNo + '&chaptersNo=' + item.chaptersPid +
							'&tap=' + item.chaptersNo + '&clauseNo=' +item.clauseNo
					})
				} else {
					http://localhost:8081/#/pages/np/np?normsNo=GB50016-2014&title=
					uni.navigateTo({
						url: '/pages/np/np?normsNo='+item.normsNo+'&title='+item.title
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.content-search {
	position: relative;
	&.nodate {
		padding: 200rpx 0;
	}
	&-wrap {
		padding: 28rpx;
		&-item {
			padding: 28rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			box-shadow:0px 6px 33px 0px rgba(124,124,124,0.18);
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			box-sizing: border-box;
			margin-bottom: 28rpx;
			color: #666;
			font-size: 28rpx;
			&-content {
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
				box-sizing: border-box;
			}
		}
	}
}
</style>
