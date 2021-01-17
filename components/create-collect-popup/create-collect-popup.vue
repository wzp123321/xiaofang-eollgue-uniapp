<template>
	<!-- 点击收藏弹框 -->
	<view class="create-collect-wrapper">
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="vip--collect-modal">
				<image class="close-image" src="/static/close.svg" mode="aspectFill" @tap="handleChooseClose"></image>
				<view class="modal-title">
					{{moduleType===1?'规范解读':'规范'}}收藏夹
				</view>
				<view class="descritpion">
					（已选择1个收藏夹）
				</view>
				<view class="create-collect flex-row" @click="handleCreatePopupShow">
					<image src="/static/interpretation/create.svg" mode=""></image>
					新建收藏夹
				</view>
				<radio-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd flex-row-space" v-for="item in dataList" :key="item.id">
						<view class="flex-column">
							<view class="collectTitle">
								{{item.title}}
							</view>
							<view class="count">
								{{item.contentCount || 0}}个内容
							</view>
						</view>
						<view>
							<radio :value="item.id+''" :checked="favoriteId===item.id" />
						</view>
					</label>
				</radio-group>
				<button type="default" class="submit-btn" @tap="handleCreateCollection">完成</button>
			</view>
		</uni-popup>
		<uni-popup ref="create_popup" type="bottom">
			<form class="collection-form" @submit="formSubmit">
				<image src="/static/close.svg" mode="" @click="handleCreatePopupClose"></image>
				<view class="uni-form-item uni-column first-form-item">
					<view class="module-title">
						收藏夹名称
					</view>
					<input class="uni-input" name="title" placeholder="请输入收藏夹名称" maxlength="20" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="module-title">
						收藏夹描述
					</view>
					<input class="uni-input" name="description" placeholder="可选，最多50字" maxlength="50" />
				</view>
				<view class="uni-form-item uni-column">
					<button form-type="submit" class="complete-btn">完成</button>
				</view>
			</form>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../uni-popup/uni-popup.vue';
	var graceChecker = require('../../utils/graceChecker.js');
	export default {
		props: {
			moduleType: {
				type: Number,
				default: 1
			},
			dataList: {
				type: Array,
				default: []
			},
			favoriteId: {
				type: Number
			}
		},
		data() {
			return {
				rule: [{
					name: "title",
					checkType: "notnull",
					errorMsg: "收藏夹名称不能为空"
				}]
			};
		},
		components: {
			uniPopup
		},
		methods: {
			// 打开
			show() {
				this.$refs.popup.open()
			},
			// 选择弹框关闭
			handleChooseClose() {
				this.$refs.popup.close();
				this.$emit('hideTan')
			},
			// 选择
			checkboxChange(e) {
				this.$emit('choose', Number(e.detail.value))
			},
			// 选择回调
			handleCreateCollection() {
				this.$refs.popup.close();
				this.$emit('complete')
			},
			// 打开新增弹框
			handleCreatePopupShow() {
				this.$refs.create_popup.open();
			},
			// 新增弹框关闭
			handleCreatePopupClose() {
				this.$refs.create_popup.close();
			},
			// 新增弹框提交表单
			formSubmit(e) {
				const {
					rule
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
					this.$emit('add', formdata);
					this.$refs.create_popup.close();
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
	.create-collect-wrapper {
		position: relative;

		.vip--collect-modal {
			padding: 28upx;
			background: #fff;
			border-radius: 16upx 16upx 0 0;
			position: relative;

			.close-image {
				width: 24upx;
				height: 24upx;
				position: absolute;
				top: 26upx;
				right: 26upx;
			}

			.modal-title {
				text-align: center;
				font-size: 36upx;
			}

			.descritpion {
				text-align: center;
				font-size: 24upx;
				color: #999;
			}

			.create-collect {
				font-size: 32upx;
				color: #FCD002;
				padding: 33upx 0;
				border-bottom: 2upx solid #EDEDED;

				image {
					width: 32upx;
					height: 32upx;
					position: relative;
					top: 4upx;
					margin-right: 10upx;
				}
			}

			.uni-list-cell {
				padding: 13upx 0;
				border-bottom: 2upx solid #EDEDED;

				.collectTitle {
					color: #333333;
					font-size: 32upx;
				}

				.count {
					font-size: 20upx;
					color: #999999;
				}

				.uni-checkbox-wrapper {
					position: relative;
					top: 4upx;
				}
			}

			.submit-btn {
				background: #FCD002;
				font-size: #333;
				border-radius: 40upx;
				margin-top: 112upx;
			}
		}

		.collection-form {
			position: relative;
			display: block;
			width: 100%;
			border-radius: 18upx 18upx 0 0;
			height: 100%;
			background: #fff;
			padding-top: 129upx;
			padding-bottom: 48upx;

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
					margin-top: 205upx;
				}
			}

			.first-form-item {
				margin-bottom: 55upx;
			}
		}
	}
</style>
