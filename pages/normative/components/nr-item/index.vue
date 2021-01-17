<!--规范item-->
<template>
	<view class="nr-item">
		<view class="nr-item-title" @click="toNP">
			<text class="nr-item-title-tag">【{{ status }}】</text>
			<text class="nr-item-title-maintitle">{{ item.title }}</text>
			<image class="nr-item-title-new-img" v-if="item.newFlag" src="/static/interpretation/new-ico.png"></image>
		</view>
		<view class="nr-item-info">
			<view class="nr-item-info-no">
				<text class="number">编号：{{ item.normsNo }}</text>
				<text class="icon iconyueduliang">{{ item.pv }}</text>
			</view>
			<view class="nr-item-info-extra">
				<view class="nr-item-info-extra-date">
					<text class="date">实施日期: {{ item.startDate }}</text>
					<text class="date" v-if="item.endDate">废止日期: {{ item.endDate }}</text>
				</view>
				<view class="nr-item-info-extra-btn">
					<button class="btn" @tap.stop="clickBtn">{{ getDownBtn() }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchNormsDownload,
		fetchNormDownloadStat,
	} from "../../../../service/normative.js";
	import {
		mapActions
	} from "vuex";
	export default {
		props: {
			item: {
				type: Object,
				default: () => {},
			},
			userInfo: {
				type: Object,
				default: () => {},
			},
		},
		data() {
			return {
				donwloadStatus: 0, // 下载状态
			};
		},
		methods: {
			...mapActions(["setXFDownloadNos", "setXFDownloadVersions"]),
			getDownBtn() {
				this.getDownloadState();
				let value = "";
				switch (this.donwloadStatus) {
					case 0:
						value = "下载";
						break;
					case 1:
						value = "立即更新";
						break;
					case 2:
						value = "立即阅读";
						break;
				}
				return value;
			},
			/**
			 * 获取下载状态
			 */
			getDownloadState() {
				const {
					userInfo
				} = this;
				const {
					normsNo,
					updateTime
				} = this.item;
				const {
					id
				} = this.userInfo;
				let downloadNormsList =
					uni.getStorageSync(`xf_download_normsNoList${id}`) || {};
				console.log(
					"Object.keys(downloadNormsList)",
					Object.keys(downloadNormsList)
				);
				if (Object.keys(downloadNormsList).length > 0) {
					let attributes = Object.keys(downloadNormsList);
					// 检查版本号是否一致
					if (attributes.indexOf(normsNo) !== -1) {
						const downUpdateTime = new Date(
							downloadNormsList[normsNo].xfNorms.updateTime
						).getTime();
						if (new Date(updateTime).getTime() === downUpdateTime) {
							this.donwloadStatus = 2;
						} else {
							this.donwloadStatus = 1;
						}
					} else {
						this.donwloadStatus = 0;
					}
				} else {
					this.donwloadStatus = 0;
				}
			},
			async clickBtn() {
				// 判断用户是否为vip
				if (
					this.userInfo &&
					this.userInfo.isvip !== 1 &&
					this.donwloadStatus === 0
				) {
					this.$emit("setVip");
					return;
				}
				// 如果已经下载
				if (this.donwloadStatus === 2) {
					this.toNP();
					return;
				}
				try {
					const {
						normsNo
					} = this.item;
					uni.showLoading({
						title: "准备下载中...",
					});
					const res = await fetchNormsDownload({
						normsNo,
					});
					if (res) {
						const newRes = await this.getDataListSort(res);
						console.log('newRes', newRes);
						this.setXFDownloadVersions(newRes);
						this.donwloadStatus = 2;
						const comRes = await fetchNormDownloadStat(normsNo);
						console.log("comRes", comRes);
					}
				} catch (err) {
					uni.showToast({
						icon: "none",
						title: "下载失败,请稍后重试",
					});
				}
			},
			/**对小章节进行排序
			 * @param {Object} data
			 */
			getDataListSort(data) {
				if (!data) {
					return {};
				}
				return new Promise((resolve, reject) => {
					const newData = JSON.parse(JSON.stringify(data));
					newData.xfNormsChaptersDtoList = newData.xfNormsChaptersDtoList.map(item => {
						item.xfNormsClauseList = item.xfNormsClauseList.sort((a, b) => {
							return a.clauseOrder - b.clauseOrder
						})
						return item
					})
					resolve(newData)
				})
			},
			toNP() {
				uni.navigateTo({
					url: "/pages/np/np?normsNo=" +
						this.item.normsNo +
						"&title=" +
						encodeURIComponent(this.item.title),
				});
			},
		},
		computed: {
			status() {
				switch (this.item.normsStatus) {
					case 0:
						return "未实施";
					case 1:
						return "现行";
					case 2:
						return "废止";
					default:
						return "未发布";
				}
			},
		},
	};
</script>

<style lang="less">
	.nr-item {
		padding: 28rpx 0;
		border-bottom-width: 1rpx;
		border-color: #ededed;
		border-style: solid;
		border-top-width: 0;
		border-left-width: 0;
		border-right-width: 0;

		&-title {
			font-size: 32rpx;
			line-height: 45rpx;
			color: #333;
			font-weight: 500;
			display: -webkit-box;

			// -webkit-box-orient: vertical;
			// -webkit-line-clamp: 2;
			// overflow: hidden;
			&-tag {
				color: #e26241;
			}

			&-new {
				width: 52rpx;
				height: 25rpx;

				&-img {
					margin-left: 10rpx;
					width: 52rpx;
					height: 25rpx;
				}
			}
		}

		&-info {
			margin-top: 16rpx;
			display: flex;
			justify-content: flex-start;
			flex-direction: column;
			color: #999;

			&-no {
				font-size: 24rpx;
				line-height: 34rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				align-items: center;

				&>.number {
					font-size: 24rpx;
					line-height: 34rpx;
				}

				&>.icon {
					font-size: 20rpx;

					&::before {
						margin-right: 13rpx;
					}
				}
			}

			&-extra {
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				align-items: flex-end;

				&-date {
					font-size: 20rpx;
					line-height: 28rpx;
					display: flex;
					flex-direction: column;

					.date {
						margin-top: 12rpx;
					}
				}

				&-btn {
					.btn {
						padding: 10rpx 50rpx;
						background-color: #fcd002;
						border-radius: 26rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						font-weight: 500;
						color: #7c6a18;
						border-width: 0;

						&::after {
							border: none;
						}
					}
				}
			}
		}
	}
</style>
