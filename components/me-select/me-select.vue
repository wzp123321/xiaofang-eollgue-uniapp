<template>
	<view class="me-select-item-wrap-box">
		<view class="me-select-item-wrap" v-for="(item, index) in data__list" :key="index">
			<view class="me-select-item-left" :class="{'scan': editModel}">
				<view @tap="itemTap(item, index)">
					<slot :slot-scope="{item: item, index:index}"></slot>
				</view>
				<image @tap="tap(index, false)" :class="{'up': editModel}" v-show="editModel && item.select" class="select-icon"
				 src="../../static/select.png" mode=""></image>
				<image @tap="tap(index, true)" :class="{'up': editModel}" v-show="editModel && !item.select" class="select-icon"
				 src="../../static/unselect.png" mode=""></image>
			</view>
		</view>
		<view class="bot-fixed-wrap" v-if="editModel && data__list.length > 0">
			<button v-if="selectArr.length < data__list.length" class="but" @tap="selectAll" type="default">全选</button>
			<button v-else class="but" @tap="unSelectAll" type="default">取消全选</button>
			<button @tap="finish" class="but" :class="{'danger': selectArr.length > 0, 'un':selectArr.length<=0 }" type="default">{{selectArr.length > 0 ? `删除(${selectArr.length})` : '删除'}}</button>
		</view>
	</view>
</template>

<script>
import meSelect from '@/components/me-select/me-select.vue';
export default {
	components: {
		meSelect
	},
	data() {
		return {
			data__list: [],
			editModel: false,
			selectNum: 0,
			selectArr: []
		};
	},
	props: {
		datalist: {
			type: Array,
			require: true
		},
		options: {
			type: Object,
			require: true
		}
	},
	watch: {
		datalist: {
			handler(n, o) {
				this.data__list = n;
			},
			deep: true
		},
		data__list: {
			handler(n, o) {
				var selectNum = 0;
				var tem = [];
				if (this.data__list.length > 0) {
					this.data__list.forEach((item, index) => {
						item.select && selectNum++;
						if (this.options.flags.length <= 0) {
							item.select && tem.push(item);
						} else {
							var tItem = {};
							this.options.flags.forEach(item2 => {
								tItem[item2] = item[item2];
							});
							tItem['index'] = index;
							item.select && tem.push(tItem);
						}
					});
				}
				this.selectArr = tem;
				this.selectNum = selectNum;
				this.$emit('change', this.selectArr);
			},
			deep: true
		}
	},
	created() {
		this.data__list = this.datalist;
	},
	methods: {
		itemTap(item, index) {
			if (this.options.itemCanSelect && this.editModel) {
				this.data__list[index].select = !this.data__list[index].select;
			}
			if (!this.editModel) {
				this.$emit('itemClick', item);
			}
		},
		changeModel() {
			this.editModel = !this.editModel;
		},
		getSelectAll() {
			return this.selectArr;
		},
		selectAll() {
			this.data__list.forEach((item, index) => {
				item.select = true;
			});
		},
		unSelectAll() {
			this.data__list.forEach((item, index) => {
				item.select = false;
			});
		},
		tap(index, value) {
			this.data__list[index].select = value;
		},
		finish() {
			if (this.selectArr.length <= 0) return;
			this.unSelectAll(); // 重置所有
			this.$emit('finish', this.selectArr);
		}
	}
};
</script>

<style scoped>
	.me-select-item-wrap-box {
		padding: 0 28upx;
		box-sizing: border-box;
	}

	.me-select-item-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding: 28upx 0;
		border-bottom: 2upx solid #eee;
	}


	.me-select-item-left {
		min-height: 40upx;
		width: 100%;
		transition: width .1s linear;
	}

	.me-select-item-left .select-icon {
		height: 40upx;
		width: 40upx;
	}

	.me-select-item-left.scan {
		width: 88%;
	}

	.me-select-item-left .select-icon {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: -1;


	}

	.me-select-item-left .select-icon.up {
		z-index: 1;
	}

	.bot-fixed-wrap {
		position: fixed;
		display: flex;
		bottom: 0;
		left: 0;
		width: 100%;
		border-top: 1upx solid #ccc;
		background-color: #FFFFFF;
		padding: 12upx 0;
		z-index: 99;
		font-size: 28upx;
		color: #333;
	}

	.but {
		line-height: 72upx;
		text-align: center;
		height: 72upx;
		width: 240upx;
		border-radius: 40upx;
		background-color: #E9E9E9;
	}

	.but.un {
		color: #999999;
	}

	.but.danger {
		color: red;
	}
</style>
