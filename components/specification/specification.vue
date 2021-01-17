<template>
	<!-- 规范组件 -->
	<view class="specification-wrapper">
		<view class="title">{{SpecificationInfo.title}}</view>
		<view class="description">{{SpecificationInfo.description}}</view>
		<view class="info flex-row-space">
			<view class="code">编号{{SpecificationInfo.normsNo}}</view>
			<view class="type">{{types[SpecificationInfo.normsType]}}</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			SpecificationInfo: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				types: {
					1: "国家标准",
					2: "行业标准",
					3: "地方标准",
					4: "公安部令",
				}
			};
		}
	};
</script>

<style lang="less" scoped>
	.specification-wrapper {
		position: relative;
		padding: 28upx;
		border-bottom: 2upx solid #ededed;

		.title {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 32upx;
			margin-bottom: 20upx;
		}

		.description {
			font-size: 24upx;
			color: #666;
			text-indent: 2rem;
			margin-bottom: 20upx;
		}

		.info {
			font-size: 20upx;
			color: #999;
		}
	}
</style>
