<template>
	<!-- 规范组件 -->
	<view class="specification-wrapper">
		<view class="title" @tap="linkToInfo">{{SpecificationInfo.title}}</view>
		<view class="description" v-html="content" @tap="linkToInfo"></view>
		<view class="info flex-row-space">
			<view class="code">编号{{SpecificationInfo.normsNo}}</view>
			<view class="type">{{normTypes[SpecificationInfo.normsType]}}</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	import {
		normTypes
	} from '../../config/index.js'
	export default {
		props: {
			SpecificationInfo: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				normTypes
			};
		},
		computed: {
			content: function() {
				let content = ''
				if (this.SpecificationInfo && this.SpecificationInfo.content) {
					content = this.SpecificationInfo.content.replace(/<[^>]+>|&[^>]+;/g, "").trim().slice(0, 200)
				}
				return content
			}
		},
		methods: {
			linkToInfo() {
				uni.navigateTo({
					url: '/pages/np-content/np-content?normsNo=' + this.SpecificationInfo.normsNo + '&chaptersNo=' +  (this.SpecificationInfo
						.chaptersPid || this.SpecificationInfo.chaptersNo) +
						'&tap=' + this.SpecificationInfo.chaptersNo + '&clauseNo=' + (this.SpecificationInfo.clauseNo || '2.9')
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.specification-wrapper {
		position: relative;
		padding: 28upx;
		border-bottom: 2upx solid #ededed;

		.title {
			max-width: 630rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 32upx;
			color: #333;
			margin-bottom: 20upx;
		}

		.description {
			min-height: 56rpx;
			font-size: 24upx;
			color: #666;
			margin-bottom: 20upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.info {
			font-size: 20upx;
			color: #999;
		}
	}
</style>
