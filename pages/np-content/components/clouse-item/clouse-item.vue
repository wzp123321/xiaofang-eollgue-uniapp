<template>
	<view class="clouse-item">
		<view class="clouse-item-chapter space">
			<view class="clouse-item-chapter-operation">
				<view class="clouse-item-operation-fav" @tap="chooseFav">
					<image :src="isFav ? '/static/svg/fav_selected.svg' : '/static/svg/fav.svg'" class="clouse-item-chapter-operation-fav-img" />
				</view>
				<view class="clouse-item-chapter-operation-share" @tap="handleNpContentShare">
					<image src="/static/svg/transfor.svg" class="clouse-item-chapter-operation-fav-img" />
				</view>
			</view>
		</view>
		<view class="clouse-item-content space">
			<view :class="getClassName(item.clauseNo)" v-if="item.clauseNo">
			</view>
			<uParse :content="filter(item.clauseContent)" class="clouse-item-content-txt"></uParse>
		</view>
		<view class="clouse-item-btns">
			<view class="clouse-item-btns-itm" @tap="switchTab(0, item)" :class="{ disabled: !item.clauseInterpretation }">
				<image :src="item && item.clauseInterpretation ? '/static/svg/description.svg' : '/static/svg/description-disabled.svg'"
				 class="clouse-item-btns-itm-img" />
				<text class="clouse-item-btns-itm-txt">条文解读</text>
			</view>
			<view class="clouse-item-btns-itm" @tap="switchTab(1, item)" :class="{ disabled: !item.clauseImage }">
				<image :src="item && item.clauseImage ? '/static/svg/pic.svg' : '/static/svg/pic-disabled.svg'" class="clouse-item-btns-itm-img" />
				<text class="clouse-item-btns-itm-txt">图示</text>
			</view>
			<view class="clouse-item-btns-itm" @tap="showComment(item)">
				<image src="/static/svg/comment.svg" class="clouse-item-btns-itm-img"></image>
				<text class="clouse-item-btns-itm-txt">评论{{commentCount}}</text>
			</view>
		</view>
		<view class="swith-content" v-if="visibleTab !== -1">
			<view class="swith-content-item left" v-show="visibleTab === 0">
				<uParse :content="filter(item.clauseInterpretation)"></uParse>
			</view>
			<view class="swith-content-item center" v-show="visibleTab === 1">
				<uParse :content="filter(item.clauseImage)"></uParse>
			</view>
		</view>
		<!-- 分享弹框 -->
		<weixinShare ref="sharePopup" :shareConfig="shareConfig" :shareType="0" :shareData="shareData"></weixinShare>
	</view>
</template>

<script>
	import {
		shareClause,
		fetchComment
	} from '@/service/normative.js'
	import weixinShare from '@/components/weixin-share/weixin-share.vue';
	import createCollection from '@/components/create-collect/create-collect.vue'
	import uParse from '@/components/feng-parse/parse.vue'

	import {
		checkChapterIsCollected
	} from '../../../../service/normative.js'
	export default {
		data() {
			return {
				isFav: false, // 是否收藏
				visibleTab: -1,
				shareData: {}, // 分享时传参
				shareConfig: {}, // 分享时配置
				collectData: {}, // 收藏传参
				downImageObj: uni.getStorageSync('xf_download_imageList') || {},
				commentCount: 0, // 评论数
			};
		},
		components: {
			weixinShare,
			createCollection,
			uParse
		},
		methods: {
			// 打开评论
			showComment(data) {
				if (this.item.clauseNo === data.clauseNo) {
					uni.$emit('showComment', this.item)
				}
			},
			async chooseFav() {
				// 收藏前校验是否为会员
				if (this.userInfo && this.userInfo.isvip !== 1) {
					this.$emit('setVip', true)
					return
				}
				// 如果用户未收藏
				const {
					normsNo,
					chaptersNo,
					clauseNo
				} = this.item
				this.collectData = {
					normsNo,
					chaptersNo,
					clauseNo
				}
				this.$emit('setCollectShow', {
					flag: true,
					data: this.collectData
				})
			},
			// 校验用户是否收藏
			async checkInterpretationCollected() {
				const {
					normsNo,
					chaptersNo,
					clauseNo
				} = this.item
				const res = await checkChapterIsCollected(normsNo,
					chaptersNo,
					clauseNo);
				if (res) {
					this.isFav = res
				}
			},
			filter(content) {
				const {
					downImageObj
				} = this
				if (!content) return '';
				let returnContent = '';
				returnContent = content.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto;" ');
				returnContent = returnContent.replace(/\<table/gi, '<table style="max-width:100%;height:auto;" ');
				if (returnContent.indexOf('img') !== -1 && Object.keys(downImageObj).length !== 0) {
					for (let key in downImageObj) {
						returnContent = returnContent.replace(new RegExp(key, 'g'), downImageObj[key]);
						// console.log('图片替换---------------------', key, downImageObj[key])
					}
				}
				return returnContent;
			},
			switchTab(_index, item) {
				console.log(_index)
				if (this.visibleTab !== _index) {
					if (_index === 0) {
						if (!item.clauseInterpretation) {
							return;
						}
					} else if (_index === 1) {
						if (!item.clauseImage) {
							return;
						}
					}
					this.visibleTab = _index;
				} else {
					this.visibleTab = -1;
				}
			},
			// 分享功能
			handleNpContentShare() {
				// 分享传参
				const {
					normsNo,
					chaptersNo,
					clauseNo,
					clauseContent,
					clauseImage
				} = this.item
				const {
					title
				} = this
				this.shareData = {
					normsNo,
					chaptersNo,
					clauseNo
				}
				// 访问路径
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route //获取当前页面路由
				let curParam = routes[routes.length - 1].options; //获取路由参数
				// 拼接参数
				let param = ''
				for (let key in curParam) {
					param += '&' + key + '=' + curParam[key]
				}
				const visitUrl = curRoute + '?' + param.substr(1)
				// 封面
				const imageList = this.$getImgList(clauseImage || '')
				const coverUrl = imageList ? imageList[0] : 'https://firecollegue.cn/community/xfFile/image/1/3346'
				// 概述
				const summary = clauseContent.replace(/<[^>]+>|&[^>]+;/g, "").trim().slice(0, 20)
				this.shareConfig = {
					type: 0,
					title,
					visitUrl,
					coverUrl,
					summary
				}
				this.$refs.sharePopup.setSharePopupShow(true)
			},
			// 获取评论数
			async fetchCommentCount() {
				const {
					normsNo,
					chaptersNo,
					clauseNo
				} = this.item
				try {
					const res = await fetchComment({
						normsNo,
						chaptersNo,
						clauseNo
					})
					console.log(res)
					if (res) {
						this.commentCount = res
					}
				} catch (e) {}
			},
			getClassName(clauseNo) {
				let className = 'view' + clauseNo.replace(/\./g, '-')
				return className
			},
		},
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			// 分享的标题
			title: {
				type: String,
				default: '消防学院规范'
			},
			userInfo: {
				type: Object,
				default: () => {}
			},
			// 数组索引
			chapterIndex: {
				type: Number,
				default: 0
			},
			// swiper activeindex
			swiperCurrent: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			if (this.swiperCurrent === this.chapterIndex) {
				uni.$on('checkCollect', (value) => {
					if (value.normsNo === this.item.normsNo && value.chaptersNo === this.item.chaptersNo && value.clauseNo === this.item
						.clauseNo) {
						console.log(value)
						this.checkInterpretationCollected();
					}
				})
				uni.$on('checkCount', () => {
					this.fetchCommentCount()
				})
				this.checkInterpretationCollected();
				this.fetchCommentCount();
			}
		},
		watch: {
			swiperCurrent: {
				handler(n, o) {
					if (n === this.chapterIndex) {
						this.checkInterpretationCollected();
						this.fetchCommentCount();
						uni.$on('checkCount', () => {
							this.fetchCommentCount()
						})
					}
				}
			}
		}

	};
</script>

<style lang="less" scoped>
	.space {
		padding-left: 28rpx;
		padding-right: 28rpx;
	}

	.clouse-item {
		position: relative;

		&-chapter {
			display: flex;
			justify-content: flex-end;
			flex-direction: row;
			padding-top: 20rpx;
			padding-bottom: 20rpx;

			&-title {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-direction: row;

				&-t {
					font-size: 32rpx;
					color: #666666;
					line-height: 45rpx;
				}

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
						content: '';
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

			&-operation {
				display: flex;
				justify-content: flex-end;

				&-fav,
				&-share {
					position: relative;

					&-img {
						width: 36rpx;
						height: 36rpx;
					}
				}

				&-share {
					margin-left: 46rpx;
				}
			}
		}

		&-content {
			font-size: 32rpx;
			line-height: 45rpx;
			color: #666666;
			font-weight: 400;

			/deep/ .div {
				max-width: 750rpx;
				word-break: break-all;
			}
		}

		&-btns {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			padding: 20rpx 0 30rpx;
			border-top: 1rpx solid #d8d8d8;
			margin-top: 36rpx;
			border-bottom: 20rpx solid #f8f8f8;

			&-itm {
				display: flex;
				justify-content: space-around;
				width: 200rpx;
				padding: 10rpx 26rpx;
				box-sizing: border-box;
				align-items: center;
				background-color: #ebebeb;
				border-radius: 12rpx;
				color: #333333;

				&.disabled {
					color: #999999;
				}

				&-img {
					width: 28rpx;
					height: 28rpx;
				}

				&-txt {
					font-size: 28rpx;
					line-height: 40rpx;
					font-weight: 400;
					white-space: nowrap;
					margin-left: 8rpx;
				}
			}
		}
	}

	.swith-content {
		background-color: #ffffff;
		box-shadow: 0px 0px 27rpx 0px rgba(124, 124, 124, 0.23);
		padding: 28rpx;
		margin: 0 28rpx;
		// position: absolute;
		z-index: 99;
		border-radius: 12rpx;
		margin-top: 0rpx;
		// max-height: 600rpx;
		// overflow: auto;
		width: 694rpx;
		box-sizing: border-box;

		&-item {
			font-size: 28rpx;
			color: #333333;
			position: relative;
			width: 100%;

			&.left::before,
			&.center::before {
				content: '';
				width: 0;
				height: 0;
				border-left: 15rpx solid transparent;
				border-right: 15rpx solid transparent;
				border-bottom: 25rpx solid #ffffff;
				position: absolute;
				top: -50rpx;
				left: 100rpx;
				// box-shadow: 0px 0px 27rpx 0px rgba(124, 124, 124, 0.23);

			}

			&.center::before {
				left: 300rpx;
			}
		}
	}
</style>
<style lang="less">
	.div {
		.p {
			text-align: left !important;
		}
	}
</style>
