<template>
	<view class="np-content" :style="{ height: deviceInfo.windowHeight + 'px' }">
		<uni-nav-bar :fixed="true" title="规范" left-icon="back" :status-bar="true" @clickLeft="goBack" />
		<swiper :style="videoStyle" :current="swiperCurrent" @change="swiperChange">
			<swiper-item v-for="(chapter, chapterIndex) in contentArr" :key="'chapter_' + chapterIndex" class="swiper-item-content">
				<template v-if="swiperCurrent === chapterIndex">
					<view class="np-content" :style="videoStyle" v-if="Object.keys(currentChapter).length !== 0">
						<scroll-view :show-scrollbar="false" :style="videoStyle" :scroll-y="true" :scroll-x="false" :scroll-into-view="taps"
						 scroll-with-animation="true" :scroll-top="scrollTop">
							<view class="np-content-main">
								<view class="np-content-main-title">{{ currentChapter.title  }}</view>
								<view class="np-content-main-chapterT">{{ currentChapter.chaptersTitle  }}</view>
							</view>
							<view class="np-content-main-list" v-if="currentChapter.chaptersList && currentChapter.chaptersList.length > 0">
								<view v-for="(item, idx) in currentChapter.chaptersList" :key="'chapter_item_' + idx" :id="'chapter' + idx">
									<view class="np-content-main-chapterTitle">
										<view :class="['np-content-main-chapterTitle-title','chapter_' + getClassName(item.chaptersNo),]">{{ item.chaptersTitle }}</view>
										<view class="np-content-main-chapterTitle-same" v-if="item.isShowLabel" @tap="tosame(item)">同类索引</view>
									</view>
									<ClouseItem v-for="(clause, _idx) in item.xfNormsClauseList" :title="chapter.title" :isFav="curFavArr[idx] ? curFavArr[idx][_idx] : false"
									 :key="'clouse_item_' + _idx" :item="clause" :userInfo="userInfo" :swiperCurrent="swiperCurrent" :chapterIndex="chapterIndex"
									 @setVip="setVip" @setCollectShow="setCollectShow" />
								</view>
							</view>
							<view class="np-content-main-list" v-if=" currentChapter.xfNormsClauseList && currentChapter.xfNormsClauseList.length > 0">
								<ClouseItem v-for="(clause, _idx) in currentChapter.xfNormsClauseList" :title="currentChapter.title" :isFav="curFavArr[_idx]"
								 :key="'clouse_item_' + _idx" :item="clause" :chapterIndex="chapterIndex" :userInfo="userInfo" :swiperCurrent="swiperCurrent"
								 @setVip="setVip" @setCollectShow="setCollectShow" />
							</view>
						</scroll-view>
					</view>
				</template>
			</swiper-item>
		</swiper>
		<comment-list-popup :images.async="images" @setImages="setImages" @comment="handleUserComment" :featuredCommentList="featuredCommentList"
		 :commentList="commentList" :page="page" :total="total" :curCommentId="curCommentId" :feaTotal="feaTotal" ref="comment_popup"
		 @upload="handleClickImage" @delete="handleUploadImageDelete"></comment-list-popup>

		<!-- vip提示 -->
		<vipWarn ref="vipPopup" :mask="true" operation="收藏"></vipWarn>

		<!-- 收藏弹框 -->
		<createCollection ref="collectPopup" :category="1" :collectData="collectData" @success="handleCollectSuccess"></createCollection>
	</view>
</template>

<script>
	const deviceInfo = uni.getSystemInfoSync();
	import {
		fetchContentDetail,
		checkChapterIsCollected,
		fetchNormsCollect,
		fetchCommentList,
		fetchCommentSubmit,
	} from "../../service/normative.js";
	import {
		getUserInfo
	} from "../../service/personal.js";
	import {
		getCommentReply,
		getNormativeFeaCommentList,
	} from "../../service/comment.js";
	import {
		handleFileButhUpload
	} from "../../service/index.js";
	import {
		mapGetters
	} from "vuex";
	import ClouseItem from "./components/clouse-item/clouse-item.vue";
	import vipWarn from "@/components/vip-warn/vip-warn.vue";
	import createCollection from "@/components/create-collect/create-collect.vue";
	export default {
		components: {
			ClouseItem,
			vipWarn,
			createCollection,
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		data() {
			return {
				swiperCurrent: 0,
				normsNo: "",
				ids: "",
				taps: "",
				originData: {}, // 规范数据
				contentArr: [], // 规范内容
				chaptersIds: [],
				videoStyle: {
					width: "750rpx",
					height: deviceInfo.windowHeight - 44 + "px",
				},
				deviceInfo,
				isFirst: true,
				curFavArr: [],
				commentList: [], // 评论列表
				featuredCommentList: [], // 精选评论
				feaTotal: 0, // 精选评论总数
				commentItem: {}, // 评论对象
				images: [], // 上传的图片数组
				page: 1, // 评论页码
				total: 0, // 评论总数
				downloadNormsList: this.$store.getters.downloadNormsList,
				scrollTop: 0, // 滚轮滚动距离
				currentChapter: {}, // 当前章节
				newDataChapterList: [], // 缓存中的数据
				collectData: {}, // 收藏传参
				curId: "", //当前收藏的id
				curCommentId: "",
				chaptersPid: 0
			};
		},
		/**
		 * 初始化
		 */
		onLoad(options) {
			const normsNo = options.normsNo;
			const chaptersNo = options.chaptersNo;
			this.chaptersPid = options.chaptersPid
			const taps = options.tap;
			const chaptersIds = options.ids ? options.ids.split("-") : [chaptersNo];
			this.normsNo = normsNo;
			this.chaptersNo = chaptersNo;
			this.ids = taps ? "chapter_" + taps : "";
			this.chaptersIds = chaptersIds;
			const curIndex = chaptersIds.findIndex((item) => item === chaptersNo);
			this.swiperCurrent = curIndex;
			if (
				String(options.clauseNo) !== "undefined" ||
				(String(options.clauseNo) === "undefined" && !options.tap.includes("."))
			) {
				let className =
					String(options.clauseNo) !== "undefined" ?
					"view" + options.clauseNo.replace(/\./g, "-") :
					"view" + options.tap + "-1";
				setTimeout(() => {
					uni
						.createSelectorQuery()
						.select(`.${className}`)
						.boundingClientRect((data) => {
							//目标位置的节点：类或者id
							uni
								.createSelectorQuery()
								.select(".np-content")
								.boundingClientRect((res) => {
									//最外层盒子的节点：类或者id
									if (data && res) {
										this.scrollTop = data.top - res.top - 100;
									}
								})
								.exec();
						})
						.exec();
				}, 1500);
				if (options.commentId) {
					this.curCommentId = options.commentId;
					const {
						normsNo,
						chaptersNo,
						clauseNo
					} = options;
					this.collectData = {
						normsNo,
						chaptersNo,
						clauseNo,
					};
					setTimeout(() => {
						this.showComment(this.collectData);
					}, 500);
				}
				uni.hideLoading();
			} else {
				let className = "chapter_" + options.tap.replace(/\./g, "_");
				setTimeout(() => {
					uni
						.createSelectorQuery()
						.select(`.${className}`)
						.boundingClientRect((data) => {
							//目标位置的节点：类或者id
							uni
								.createSelectorQuery()
								.select(".uni-scroll-view")
								.boundingClientRect((res) => {
									//最外层盒子的节点：类或者id
									if (data && res) {
										this.scrollTop = data.top - res.top;
									}
								})
								.exec();
						})
						.exec();
				}, 1500);
			}
		},
		async onReady() {
			await this.initData();
		},
		// 添加监听事件
		mounted() {
			uni.$on("showComment", this.showComment);
		},
		methods: {
			// 拼接类名
			getClassName(str) {
				return str.replace(/\./, "_");
			},
			// 显示收藏弹框
			setCollectShow(value) {
				const {
					flag,
					data
				} = value;
				this.$refs.collectPopup.setCollectPopupShow(flag);
				this.collectData = data;
			},
			// 收藏成功回调
			handleCollectSuccess() {
				this.$refs.collectPopup.setCollectPopupShow(false);
				uni.$emit("checkCollect", this.collectData);
			},
			setImages() {
				this.images = [];
			},
			// 打开评论弹框
			handleInputPopup(type) {
				this.comment = "";
				if (type === "open") {
					this.images = [];
					this.$refs.input_popup.open();
				} else {
					this.$refs.input_popup.close();
				}
			},
			/**
			 * @param {Object} comment评论
			 */
			async hanldeSubmitComment(comment) {
				if (comment === "") {
					uni.showToast({
						icon: "none",
						title: "评论不能为空",
					});
					return;
				}
				const newComment = this.$changeEmoji(comment);
				if (!newComment) {
					uni.showToast({
						icon: "none",
						title: "内容不能为空",
					});
					return;
				}
				const res = await fetchCommentSubmit({
					normsNo: this.commentItem.normsNo,
					chaptersNo: this.commentItem.chaptersNo,
					clauseNo: this.commentItem.clauseNo,
					comment: newComment,
					images: this.images,
				});
				if (res) {
					uni.showToast({
						icon: "none",
						title: "评论成功",
					});
					this.$refs.comment_popup.hide();
					uni.$emit("checkCount");
					this.commentItem = {};
					this.images = [];
				}
			},
			/**
			 * @param {Object} params回复评论
			 */
			async handleUserComment(params) {
				if (params.comment === "") {
					uni.showToast({
						icon: "none",
						title: "评论不能为空",
					});
					return;
				}
				if (!params.parentId) {
					this.comment = params.comment;
					this.hanldeSubmitComment(params.comment);
				} else {
					const res = await getCommentReply(params);
					if (res) {
						console.log(res);
						uni.showToast({
							icon: "none",
							title: "评论成功",
						});
						this.$refs.comment_popup.hide();
						uni.$emit("checkCount");
						this.commentItem = {};
					}
				}
			},
			/**
			 * 点击选择图片
			 */
			handleClickImage() {
				if (this.images.length === 3) {
					uni.showToast({
						title: '最多上传三张图片'
					})
					return;
				}
				const that = this;
				uni.chooseImage({
					count: 3,
					sizeType: ['compressed'],
					async success(e) {
						e.tempFilePaths.forEach(item => {
							that.handleImageUpload(item)
						})
					},
					fail(err) {
						uni.showToast({
							icon: "none",
							title: "图片选择失败，请稍后重试",
						});
					},
				});
			},
			/**
			 * 图片压缩
			 */
			handleImageCompress(path) {
				console.log('开始压缩');
				const that = this;
				return new Promise((resolve, reject) => {
					try {
						let pathDst = path.substring(0, path.lastIndexOf("."));
						//压缩图片
						plus.zip.compressImage({
							src: path, //原路径
							dst: pathDst, //缩略图路径
							overwrite: false, //是否生成新图片
							quality: 20, //1-100,1图片最小，100图片最大
							width: 'auto', //缩略固定宽
							height: 'auto' //缩略固定高
						}, result => {
							console.log('压缩后的大小---imgPathSize', result.size)
							let imgPathUrl = result.target;
							resolve(imgPathUrl);
						})
					} catch (e) {
						uni.showToast({
							title: '文件上传失败'
						})
					}
				})
			},
			/**
			 * 图片上传
			 */
			async handleImageUpload(img) {
				try {
					const that = this;
					const image = await this.handleImageCompress(img)
					const res = await handleFileButhUpload(image);
					if (res) {
						const images = res.data;
						if (3 - that.images.length < images.length) {
							uni.showToast({
								icon: "none",
								title: "最多上传三张图片！",
							});
							return;
						}
						that.images = [...that.images, ...images];
						that.images = that.images.filter((item) => {
							return item !== "";
						});
					}
				} catch (error) {
					uni.showToast({
						icon: "none",
						title: "图片上传失败，请稍后重试",
					});
				}
			},
			// 删除上传图片
			handleUploadImageDelete(index) {
				const newImages = this.images.filter((item, idx) => {
					return idx !== index;
				});
				this.images = newImages;
			},
			// 评论弹框
			handleCommentPopupShow() {
				this.images = [];
				console.log(this.images);
				this.comment = "";
				this.getChoiceCommentList();
				this.$refs.comment_popup.show();
			},
			// 获取精选评论
			async getChoiceCommentList() {
				const normsNo = this.commentItem.normsNo;
				const chaptersNo = this.commentItem.chaptersNo;
				const clauseNo = this.commentItem.clauseNo;
				const res = await getNormativeFeaCommentList(
					normsNo,
					chaptersNo,
					clauseNo
				);
				if (res) {
					this.feaTotal = res.total;
					this.featuredCommentList = res.records || [];
				}
			},
			async showComment(item) {
				this.commentItem = item;
				const res = await fetchCommentList({
					normsNo: item.normsNo,
					chaptersNo: item.chaptersNo || 0,
					clauseNo: item.clauseNo,
				});
				if (res) {
					this.commentList = res.records;
					this.total = res.total;
				}
				this.handleCommentPopupShow();
			},
			// 轮播图回调
			swiperChange(e) {
				uni.showLoading({
					title: "加载中",
				});
				this.currentChapter = {};
				this.swiperCurrent = e.detail.current;
				this.chaptersNo = e.detail.current;
				const {
					chaptersNo,
					newDataChapterList
				} = this;
				const that = this;
				console.log(this.currentChapter);
				uni.getNetworkType({
					async success(res) {
						if (res && res.networkType !== "none") {
							const chapterRes = await fetchContentDetail({
								normsNo: that.normsNo,
								chaptersNo: that.chaptersNo,
							});

							if (chapterRes) {
								that.currentChapter = chapterRes;
								uni.hideLoading();
							}
						} else {
							that.currentChapter = newDataChapterList[chaptersNo];
							console.log(that.currentChapter);
						}
					},
				});
				uni.hideLoading();
			},
			goBack() {
				uni.navigateBack();
			},
			openComment() {
				if (this.$refs.commentComp) this.$refs.commentComp.show();
			},
			async initData() {
				uni.showLoading({
					title: "加载中",
				});
				const {
					normsNo,
					downloadNormsList
				} = this;
				const {
					id
				} = this.userInfo;
				let newDatalist = [];
				// 如果缓存中有数据
				if (downloadNormsList && downloadNormsList[normsNo]) {
					const title = downloadNormsList[normsNo].xfNorms.title;
					downloadNormsList[normsNo].xfNormsChaptersDtoList.forEach((item) => {
						if (!item.xfNormsChapters.chaptersPid) {
							newDatalist.push({
								chaptersList: [],
								chaptersNo: item.xfNormsChapters.chaptersNo,
								chaptersTitle: item.xfNormsChapters.chaptersTitle,
								normsNo: item.xfNormsChapters.normsNo,
								title,
								xfNormsClauseList: [...item.xfNormsClauseList],
							});
						} else {
							newDatalist.forEach((childItem) => {
								if (item.xfNormsChapters.chaptersPid === childItem.chaptersNo) {
									childItem.chaptersList.push({
										isShowLabel: item.isShowLabel || false,
										chaptersNo: item.xfNormsChapters.chaptersNo,
										chaptersTitle: item.xfNormsChapters.chaptersTitle,
										xfNormsClauseList: item.xfNormsClauseList,
									});
								}
							});
						}
					});
				}
				newDatalist = newDatalist.map((item) => {
					// 排序
					item.xfNormsClauseList = item.xfNormsClauseList.sort((a, b) => {
						return a.clauseOrder - b.clauseOrder;
					});
					return item;
				});
				if (newDatalist.length !== 0) {
					this.newDataChapterList = newDatalist;
					console.log("详情-------------------走的缓存");
					console.log(newDatalist[this.chaptersNo], this.chaptersNo, newDatalist)
					this.currentChapter = newDatalist[this.chaptersNo] || newDatalist[this.chaptersPid] || {};
					this.chaptersIds.forEach((item, index) => {
						this.contentArr.push(this.currentChapter);
					});
				} else {
					try {
						const chapterRes = await fetchContentDetail({
							normsNo: this.normsNo,
							chaptersNo: this.chaptersNo,
						});
						if (chapterRes) {
							this.currentChapter = chapterRes;
							console.log(this.currentChapter)
						}
						this.chaptersIds.forEach((item, index) => {
							this.contentArr.push(chapterRes);
						});
						uni.hideLoading();
					} catch (e) {
						uni.showToast({
							title: e.data.message,
							icon: "none",
						});
						uni.hideLoading();
					}
				}
			},

			tosame(item) {
				uni.navigateTo({
					url: "/pages/same-origin/same-origin?normsNo=" +
						this.normsNo +
						"&chaptersNo=" +
						item.chaptersNo,
				});
			},

			// 显示隐藏vip提示
			vipToast(value) {
				console.log("value", value);
				if (this.$refs.vipPopup) {
					this.$refs.vipPopup.setVipWarnShow(value);
				}
			},
			setVip(value) {
				this.vipToast(value);
			},
		},
		onShow() {
			this.vipToast(false);
		},
	};
</script>

<style lang="less" scoped>
	.np-content {
		overflow: auto;
		height: 100%;

		&-main {
			padding: 28rpx 28rpx 0 28rpx;
			// overflow: hidden;

			&-title {
				font-size: 42rpx;
				line-height: 60rpx;
				font-weight: 500;
				color: #333333;
				border-bottom-width: 1rpx;
				border-bottom-color: #ededed;
				border-bottom-style: solid;
				padding-bottom: 23rpx;
			}

			&-chapterT {
				font-size: 36rpx;
				line-height: 50rpx;
				padding-top: 25rpx;
				padding-bottom: 28rpx;
				border-bottom-width: 1rpx;
				border-bottom-color: #ededed;
				border-bottom-style: solid;
			}

			&-chapterTitle {
				font-size: 32rpx;
				display: flex;
				justify-content: flex-start;
				line-height: 45rpx;
				align-items: center;
				margin: 28rpx 0;
				padding: 0 28rpx;

				&-same {
					// width: 120rpx;
					box-sizing: border-box;
					// height: 40rpx;
					padding: 6rpx 28rpx 6rpx 12rpx;
					border-radius: 30rpx;
					background-color: #fcd002;
					font-size: 20rpx;
					text-align: center;
					font-weight: 400;
					line-height: 28rpx;
					color: #333333;
					margin-left: 15rpx;
					position: relative;
					flex-shrink: 0;

					&::after {
						content: "";
						border: 4rpx solid #333333;
						position: absolute;
						border-left-color: transparent;
						border-bottom-color: transparent;
						transform: rotateZ(45deg) translateY(-50%);
						top: 50%;
						right: 20rpx;
					}
				}
			}

			&-section {
				padding-top: 28rpx;

				&-t {
					font-size: 32rpx;
					display: flex;
					justify-content: flex-start;
					line-height: 45rpx;
					align-items: center;

					&-thesame {
						// width: 120rpx;
						box-sizing: border-box;
						// height: 40rpx;
						padding: 6rpx 28rpx 6rpx 12rpx;
						border-radius: 30rpx;
						background-color: #fcd002;
						font-size: 20rpx;
						text-align: center;
						font-weight: 400;
						line-height: 28rpx;
						color: #333333;
						margin-left: 15rpx;
						position: relative;
						flex-shrink: 0;

						&::after {
							content: "";
							border: 4rpx solid #333333;
							position: absolute;
							border-left-color: transparent;
							border-bottom-color: transparent;
							transform: rotateZ(45deg) translateY(-50%);
							top: 50%;
							right: 20rpx;
						}
					}
				}

				&-chapterT {
					font-size: 32rpx;
					color: #666666;
					line-height: 45rpx;
					margin-top: 20rpx;
				}

				// 分享弹框
				.share-module {
					position: relative;
					padding: 24rpx;
					background-color: white;
					border-radius: 16rpx 16rpx 0 0;
					text-align: center;
					font-size: 26rpx;
					color: #666666;

					.close-image {
						width: 23rpx;
						height: 23rpx;
						position: absolute;
						top: 28rpx;
						right: 24rpx;
					}

					.title {
						color: #333;
						font-size: 34rpx;
						font-weight: 500;
						margin-bottom: 40rpx;
					}

					.weixin-share {
						width: 82rpx;
						height: 82rpx;
						border-radius: 50%;
					}
				}
			}
		}

		&-operations {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 19rpx 0;
			border-top-width: 1rpx;
			border-top-color: #d8d8d8;
			border-top-style: solid;

			&-item {
				width: 200rpx;
				height: 60rpx;
				color: #333333;
				border-radius: 12rpx;
				text-align: center;
				font-size: 28rpx;
				background-color: #ebebeb;
				line-height: 40rpx;
				display: flex;
				justify-content: center;
				flex-direction: row;
				align-items: center;

				&-img {
					width: 28rpx;
					height: 28rpx;
					margin-right: 8rpx;
				}

				&.disabled {
					color: #999999;
				}
			}
		}

		// 分享弹框
		.share-module {
			position: relative;
			padding: 24rpx;
			background-color: white;
			border-radius: 16rpx 16rpx 0 0;
			text-align: center;
			font-size: 26rpx;
			color: #666666;

			.close-image {
				width: 23rpx;
				height: 23rpx;
				position: absolute;
				top: 28rpx;
				right: 24rpx;
			}

			.title {
				color: #333;
				font-size: 34rpx;
				font-weight: 500;
				margin-bottom: 40rpx;
			}

			.weixin-share {
				width: 82rpx;
				height: 82rpx;
				border-radius: 50%;
			}
		}
	}
</style>
