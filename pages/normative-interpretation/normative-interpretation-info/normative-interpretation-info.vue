<template>
	<view class="interpretation-info">
		<uni-nav-bar :fixed="true" :statusBar="true" ref="nav" style="z-index: 999;">
			<view class="interpretation-info-header flex-row-space">
				<i class="icon iconxiangzuo" @tap="handleNavigateBack"></i>
				<text class="navigate-title">{{normsInterpretationInfo.title || '规范解读'}}</text>
				<image src="../../../static/share.png" mode="" @tap="handleNavigationBarButtonTap"></image>
			</view>
		</uni-nav-bar>
		<view class="interpretation-info-content">
			<!-- 富文本内容渲染 -->
			<view class="interpretation-info-content-html">
				<uParse v-if="normsInterpretationInfo && normsInterpretationInfo.content && contentShow" class="html" :content="normsInterpretationInfo.content"
				 @navigate="navigate"></uParse>
				<no-data v-else-if="contentShow" message="暂无数据" style="padding-top: 1000rpx;"></no-data>
				<!-- 给底部按钮的占位符 -->
				<view class="bottom-fix">

				</view>
			</view>

			<!-- 底部 -->
			<view class="interpretation-info-content-comment flex-row-space">
				<view class="comment-input flex-row" @tap="handleInputPopup('open')">
					<image src="../../../static/personal/edit-collection.svg" mode=""></image>
					<input type="text" placeholder="写评论…" />
				</view>
				<view class="comment-module">
					<image src="../../../static/interpretation/comment.svg" mode="" @tap="handleCommentPopupShow"></image>
					<view class="comment-count">
						{{total+feaTotal}}
					</view>
				</view>
				<image :src="'../../../static/interpretation/'+isCollected+'.svg'" mode="" @tap="handleCollectShow"></image>
			</view>
		</view>
		<!-- 评论弹框 -->
		<uni-popup ref="input_popup" type="bottom" :maskClick="false">
			<view class="comment-input-wrap">
				<image class="close-image" src="/static/close.svg" mode="" @tap="handleInputPopup('close')"></image>
				<!-- 针对评论进行评论 -->
				<view class="user-comment-input">
					<!-- ios软键盘会挡住底部部分内容 -->
					<textarea type="text" v-model="comment" :focus="true" placeholder="输入评论内容，最多300字。" maxlength="200" style="font-size:16px;width: 340px;height:100px;word-break: break-all;" :auto-height="true" />
					<!-- 图片展示 -->
					<commentImageList :images="images" @delete="handleUploadImageDelete"></commentImageList>
					<view class="operation flex-row-space">
						<image src="/static/upload.png" mode="" @tap="handleImageChooseUpload"></image>
						<view class="submit" @tap="hanldeSubmitComment">
							发布
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 分享弹框 -->
		<weixinShare ref="sharePopup" :shareConfig="shareConfig" :shareType="1" :shareData="shareData"></weixinShare>
		<!-- 收藏弹框 -->
		<createCollection ref="collectPopup" :category="2" :collectData="collectData" @success="handleCollectSuccess" @hideTan="hideTan"></createCollection>
		<!-- 评论弹框 -->
		<commentListPopup ref="comment_popup" :commentList="commentList" :total="total" :feaTotal="feaTotal" :page="page"
		 :featuredCommentList="featuredCommentList" :images="images" @comment="handleUserComment" @upload="handleImageChooseUpload"
		 @delete="handleUploadImageDelete" @load-more="handleLoadMoreComment" :commentId="commentId" @hideTan="hideTan"></commentListPopup>
		<!-- 需要vip提示 -->
		<vipWarn ref="vipPopup" :operation="operation"></vipWarn>
	</view>
</template>

<script>
	import {
		getNormsInterpretationInfoById,
		getNormsInterpretationChoiceCommentList,
		getNormsInterpretationCommentList,
		submitForinterpretationComment,
		getInterpretationisCollect
	} from '../../../service/normsInterpretation.js'
	import {
		getCommentReply
	} from '../../../service/comment.js'
	import {
		getUserInfo,
	} from '../../../service/personal.js'
	import {
		handleFileButhUpload
	} from '../../../service/index.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import createCollection from '@/components/create-collect/create-collect.vue'
	import commentListPopup from "@/components/comment-list-popup/comment-list-popup.vue"
	import commentImageList from '@/components/comment-image-list/comment-image-list.vue'
	import weixinShare from '@/components/weixin-share/weixin-share.vue'
	import vipWarn from '../../../components/vip-warn/vip-warn.vue'
	import uParse from '@/components/feng-parse/parse.vue'
	
	export default {
		data() {
			return {
				normsInterpretationInfo: {}, // 详情
				id: "",
				dataList: [],
				favoriteId: 0, // 子收藏夹id
				parentCollId: 0, // 解读收藏夹id
				commentList: [], // 评论数据
				featuredCommentList: [], // 精选评论
				comment: '', // 评论输入框内容
				interpretationId: '', //当前规范的id
				images: [], // 评论组件上传图片数组
				isCollected: 'uncollect', // 用户是否收藏该解读
				total: 0, // 评论总数
				feaTotal: 0, // 精选评论总数
				page: 1, // 评论分页
				userInfo: {}, // 用户信息
				shareConfig: {}, // 分享配置
				shareData: {}, //分享回调传参
				collectData: {}, // 收藏时传参
				operation:'阅读',
				commentId:'',// 携带的评论id
				contentShow:true
			};
		},
		components: {
			uniPopup,
			createCollection,
			commentListPopup,
			commentImageList,
			weixinShare,
			vipWarn,
			uParse
		},
		methods: {
			hideTan(){
				this.contentShow = true
			},
			// 打开评论弹框
			handleInputPopup(type) {
				this.images = [];
				this.comment = ''
				if (type === 'open') {
					this.contentShow = false
					this.$refs.input_popup.open();
				} else {
					console.log(121212122)
					this.contentShow = true
					this.$refs.input_popup.close();
				}
			},
			// 打开收藏弹框
			handleCollectShow() {
				if (this.userInfo.isvip !== 1) {
					this.operation = '收藏'
					this.$refs.vipPopup.setVipWarnShow(true)
				} else {
					this.$refs.collectPopup.setCollectPopupShow(true);
					this.contentShow = false
				}
			},
			// 收藏成功回调
			handleCollectSuccess() {
				this.$refs.collectPopup.setCollectPopupShow(false);
				this.checkInterpretationCollected()
				this.contentShow =true
			},
			// 评论弹框
			handleCommentPopupShow() {
				this.$refs.comment_popup.show()
				this.contentShow =false
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
			// 点击选择并上传图片
			handleImageChooseUpload() {
				if (this.images.length === 3) {
					uni.showToast({
						title: '最多上传三张图片'
					})
					return;
				}
				const that = this;
				try {
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
								icon: 'none',
								title: '图片上传失败，请稍后重试！'
							})
						}
					})
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '图片上传失败，请稍后重试！'
					})
				}
			},
			async handleImageUpload(img){
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
					return idx !== index
				})
				this.images = newImages
			},
			// 评论组件回调      
			async handleUserComment(params) {
				if (!params.parentId) {
					this.comment = params.comment
					this.hanldeSubmitComment();
				} else {
					const res = await getCommentReply(params)
					if (res) {
						uni.showToast({
							icon: 'success',
							title: '评论成功',
						})
						this.handleInputPopup('close');
						this.$refs.comment_popup.hide()
						this.initCommentData()
					}
				}
			},
			// 评论规范解读
			async hanldeSubmitComment() {
				const {
					comment,
					interpretationId,
					images
				} = this;
				const newComment = this.$changeEmoji(comment)
				if (!newComment) {
					uni.showToast({
						icon: 'none',
						title: '内容不能为空',
					})
					return
				}
				const res = await submitForinterpretationComment({
					comment: newComment,
					contentId: interpretationId,
					images
				})
				if (res) {
					uni.showToast({
						icon: 'success',
						title: '评论成功',
					})
					this.handleInputPopup('close');
					this.$refs.comment_popup.hide()
					this.initCommentData()
				}
			},
			// 导航栏按钮打开分享
			handleNavigationBarButtonTap() {
				if (this.normsInterpretationInfo.needVip === 1 && this.userInfo.isvip !== 1) {
					return
				}
				const {
					title,
					id
				} = this.normsInterpretationInfo
				// 访问路径
				const visitUrl = 'pages/normative-interpretation/normative-interpretation-info/normative-interpretation-info?id=' +
					id
				// 封面
				const imageList = this.$getImgList(this.normsInterpretationInfo.content)
				const coverUrl = imageList ? imageList[0] : 'https://firecollegue.cn/community/xfFile/image/1/3346'
				// 概述
				const summary = this.normsInterpretationInfo.content.replace(/<[^>]+>|&[^>]+;/g, "").trim().slice(0, 20)
				this.shareConfig = {
					type: 1,
					title,
					visitUrl,
					coverUrl,
					summary
				}
				this.$refs.sharePopup.setSharePopupShow(true)
			},
			// 返回
			handleNavigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取规范解读精选评论
			async getChoiceCommentList(interpretationId) {
				const res = await getNormsInterpretationChoiceCommentList(interpretationId)
				if (res) {
					this.feaTotal = res.total
					this.featuredCommentList = res.records
				}
			},
			// 获取规范解读评论
			async getCommentList(interpretationId) {
				const {
					page
				} = this
				const res = await getNormsInterpretationCommentList(interpretationId, {
					page
				})
				if (res && res.records) {
					this.commentList = [...this.commentList, ...res.records]
					this.total = res.total
				}
			},
			// 分页查询评论
			handleLoadMoreComment() {
				if (this.total > (this.page * 10)) {
					this.page += 1
					this.getCommentList(this.interpretationId)
				}
			},
			// check解读是否被收藏
			async checkInterpretationCollected() {
				const {
					interpretationId
				} = this
				const res = await getInterpretationisCollect(interpretationId);
				if (res) {
					this.isCollected = res ? 'collect' : 'uncollect'
				}
			},
			// 获取规范解读详情
			async getNormsInterpretationInfoById(id) {
				try {
					const res = await getNormsInterpretationInfoById({
						id
					})
					if (res) {
						res.content = res.content.replace(/img/g, 'img style="width:100%;border-radius:3px"').replace(/poster=\"undefined\"/g,'').replace(/您的浏览器不支持video播放/g,'').replace(/http\:\/\/150.158.178.158/g,'https://firecollegue.cn')
						this.normsInterpretationInfo = res;
						// 分享传参
						this.shareData = {
							id: res.id
						}
						// 收藏传参
						this.collectData = {
							interpretationId: res.id
						}
						this.getUserInfo()
						this.checkInterpretationCollected(id)
						uni.hideLoading()
					}
				} catch (e) {
					uni.hideLoading()
				}
			},
			// 初始化数据
			initData() {
				uni.showLoading({
					title: '加载中'
				})
				const {
					interpretationId
				} = this
				this.getNormsInterpretationInfoById(interpretationId);
				this.getChoiceCommentList(interpretationId);
				setTimeout(() => {
					uni.stopPullDownRefresh()
				}, 500)
			},
			// 初始化评论相关参数
			initCommentData() {
				this.commentList = [];
				this.comment = ''
				this.images = [];
				this.page = 1;
				this.total = 0
				this.getCommentList(this.interpretationId);
			},
			// 获取用户信息
			async getUserInfo() {
				try {
					const res = await getUserInfo();
					if (res) {
						let userInfo = res
						this.userInfo = userInfo
						if (userInfo.isvip !== 1 && this.normsInterpretationInfo.needVip === 1) {
							this.operation = '阅读'
							this.$refs.vipPopup.setVipWarnShow(true)
							this.contentShow = false
						} else {
							this.$refs.vipPopup.setVipWarnShow(false)
						}
					}
				} catch (e) {
					uni.navigateTo({
						url: '/pages/login/index/index'
					})
				}
			},
			// 富文本超链接跳转
			navigate(href,e){
				uni.navigateTo({
					url: '/pages/webview/webview?href=' + href
				})
			}
		},
		onLoad(options) {
			const {
				id,
				commentId
			} = options
			this.interpretationId = id
			this.commentId =commentId
			this.contentShow = true
			if(commentId){
				setTimeout(()=>{
					this.$refs.comment_popup.show()
					this.contentShow = false
				},300)
			}
		},
		onShow() {
			this.initData();
			this.initCommentData();
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.initData();
			this.initCommentData();
		}
	}
</script>

<style lang="less" scoped>
	
	.interpretation-info {
		position: relative;
		width: 100%;
		background: #fff;

		&-header {
			width: 100%;
			padding: 0 28rpx;
			font-size: 36rpx;
			color: #333;

			.navigate-title {
				max-width: 500rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				display: inline-block;
			}

			image {
				width: 30rpx;
				height: 30rpx;
				margin-top: 30rpx;
			}
		}

		&-content {
			position: relative;

			&-html {
				.html {
					font-size: 32rpx;
					color: #666;
					padding: 16rpx;
					line-height: 50rpx;
					overflow: scroll;

					::v-deep video{
						width: 100%;
					}
					
					::v-deep .p {
						.b{
							font-weight: bold;
						}
						.i{
							font-style: italic;
						}
						.u{
							text-decoration: underline;
						}
					}

					image {
						max-width: 375px !important;
						height: auto;
						border-radius: 10rpx;
					}
				}

				.bottom-fix {
					height: 110rpx;
				}
			}

			// 底部评论
			&-comment {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				background-color: white;
				padding: 27rpx 0;
				border-top: 2rpx solid #CCCCCC;

				image {
					width: 44rpx;
					height: 44rpx;
				}

				image:last-child {
					margin-right: 28rpx;
				}

				.comment-module {
					position: relative;

					image {
						z-index: 2;
					}

					.comment-count {
						position: absolute;
						top: -14rpx;
						right: -40rpx;
						background-color: #FE4331;
						color: #fff;
						font-size: 20rpx;
						width: 56rpx;
						height: 28rpx;
						line-height: 28rpx;
						border-radius: 10rpx;
						text-align: center;
						z-index: 1;
					}
				}

				.comment-input {
					width: 498rpx;
					margin-left: 28rpx;
					font-size: 28rpx;
					color: #999999;
					border-bottom: 2rpx solid #CCCCCC;


					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
						position: relative;
						top: 8rpx;
					}
				}
			}
		}

		// 评论输入弹框
		.comment-input-wrap {
			position: relative;
			border-radius: 18rpx 18rpx 0 0;
			background-color: #fff;
			padding: 40rpx 28rpx 37rpx 28rpx;

			.close-image {
				width: 23rpx;
				height: 23rpx;
				position: absolute;
				top: 40rpx;
				right: 28rpx;
				z-index: 999;
			}

			.user-comment-input {
				font-size: 24rpx;

				uni-input {
					color: #999;
				}

				.operation {
					font-size: 32rpx;
					color: #FCD002;

					image {
						width: 42rpx;
						height: 42rpx;
					}
				}
			}
		}
	}
	

</style>
