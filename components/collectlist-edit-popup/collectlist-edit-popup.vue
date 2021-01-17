<template>
	<uniPopup type="bottom" ref="collPopup">
		<form class="collection-form" @submit="formSubmit">
			<image src="/static/close.svg" mode="" @click="handleCreatePopupClose"></image>
			<view class="uni-form-item uni-column first-form-item">
				<view class="module-title">
					收藏夹名称
				</view>
				<input class="uni-input" v-model="formTitle" name="title" placeholder="请输入收藏夹名称" maxlength="20" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="module-title">
					收藏夹描述
				</view>
				<input class="uni-input" v-model="formDescription" name="description" placeholder="可选，最多50字" maxlength="50" />
			</view>
			<view class="uni-form-item uni-column">
				<button form-type="submit" class="complete-btn">完成</button>
			</view>
		</form>
	</uniPopup>
</template>

<script>
	import {
		getFavoritesAdd
	} from '../../service/personal.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

	var graceChecker = require('../../utils/graceChecker.js');
	export default {
		props: {
			// 收藏夹父级id
			parentId: {
				type: Number | String,
			},
			// 收藏夹id---默认是0
			id: {
				type: Number | String,
			},
			// 收藏夹名称
			title: {
				type: String,
				default: ''
			},
			// 收藏夹描述
			description: {
				type: String,
				default: ''
			}
		},
		components: {
			uniPopup
		},
		data() {
			return {
				rule: [{
					name: "title",
					checkType: "notnull",
					errorMsg: "收藏夹名称不能为空"
				}],
				formTitle:'',
				formDescription:""
			};
		},
		methods: {
			// 显示 - 隐藏
			setSharePopupShow(value) {
				if (value) {
					this.$refs.collPopup.open()
					this.formTitle = this.title;
					this.formDescription = this.description
				} else {
					this.$refs.collPopup.close()
				}
			},
			// 关闭
			handleCreatePopupClose() {
				this.setSharePopupShow(false);
			},
			// 新增或者编辑收藏夹
			async formSubmit(e) {
				const {
					rule,
					id,
					parentId
				} = this
				var formdata = e.detail.value
				var checkRes = graceChecker.check(formdata, rule);
				if (checkRes) {
					if (!formdata.title.trim()) {
						uni.showToast({
							icon: 'none',
							title: '收藏夹名称不能为空'
						})
						return
					}
					const params = Object.assign(formdata, {
						parentId,
						id
					})
					try {
						const res = await getFavoritesAdd(params);
						if (res) {
							this.$emit('success', formdata)
						}
					} catch (e) {
						uni.showToast({
							icon: 'none',
							title: '新增失败，请稍后重试'
						})
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.collection-form {
		position: relative;
		display: block;
		width: 100%;
		border-radius: 18upx 18upx 0 0;
		height: 100%;
		background: #fff;
		padding-top: 129upx;
		padding-bottom: 80upx;

		image {
			width: 22upx;
			height: 22upx;
			position: absolute;
			top: 36upx;
			right: 28upx;
		}

		.uni-form-item {
			margin: 0 28upx;
			font-size: 32upx;
			color: #333;

			.module-title {
				font-weight: 550;
			}

			uni-input {
				padding: 21upx 0;
				font-size: 24upx;
				color: #999;
				border-bottom: 2upx solid #EDEDED;
			}

			.complete-btn {
				background: #FCD002;
				border-radius: 40upx;
				margin-top: 128upx;
			}
		}

		.first-form-item {
			margin-bottom: 55upx;
		}
	}
</style>
