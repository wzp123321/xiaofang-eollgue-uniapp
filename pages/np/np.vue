<!--规范目录-->
<template>
	<view class="np-container">
		<uni-nav-bar :fixed="true" :title="chapterTitle" left-icon="back" right-icon="search" :status-bar="true" @clickLeft="goBack"
		 @clickRight="search" />
		<view class="np-container-wrap" v-if="tree.length>0">
			<view class="np-container-wrap-title">目录</view>
			<view class="np-container-wrap-content">
				<uni-collapse :accordion="true">
					<view v-for="(treeNode, idx) in tree" :key="'tree_0_node_' + idx">
						<uni-collapse-item v-if="treeNode.children.length > 0" :title="treeNode.chaptersTitle" :showAnimation="true">
							<view class="content-list">
								<view class="content-list-p2" v-for="(treeSecNode, _s_idx) in treeNode.children" :key="'tree_1_node_' + _s_idx">
									<text @tap="toContent(treeSecNode, treeNode)">{{ treeSecNode.chaptersTitle }}</text>
									<view class="content-list-p3" v-if="treeSecNode.children.length">
										<view v-for="(treeThirdNode, _t_idx) in treeSecNode.children" :key="'tree_2_node_' + _t_idx" @tap="toContent(treeThirdNode)">{{ treeThirdNode.title }}</view>
									</view>
								</view>
							</view>
						</uni-collapse-item>
						<view v-else class="collapse-item" @tap="toContent(treeNode, treeNode)">
							<text class="collapse-item-txt">{{ treeNode.chaptersTitle }}</text>
						</view>
					</view>
				</uni-collapse>
			</view>
		</view>
		<no-data v-else message="暂无数据" style="padding-top: 100rpx;"></no-data>
	</view>
</template>

<script>
	import {
		fetchContent
	} from '../../service/normative.js';
	import {
		mapGetters
	} from 'vuex'
	export default {
		onLoad(options) {
			console.log(options)
			const chapterTitle = decodeURIComponent(options.title)
			this.chapterTitle = chapterTitle
			this.normsNo = options.normsNo;
			this.loadData();
		},
		data() {
			return {
				tree: [],
				chapterTitle: ''
			};
		},
		computed: {
			...mapGetters(['userInfo']),
		},
		methods: {
			// 建立树模型
			makeTree(data) {
				let tree = [];
				while (data.length) {
					const treeItem = data.shift();
					if (!treeItem.chaptersPid) {
						tree.push(
							Object.assign({}, treeItem, {
								children: []
							})
						);
					} else {
						const target = tree.filter(treeNode => Number(treeNode.chaptersNo) === Number(treeItem.chaptersPid))
						if (target.length) {
							target[0].children.push(Object.assign({}, treeItem, {
								children: []
							}))
							tree.map(item => {
								if (item.chaptersPid === target[0].chaptersPid) {
									return target[0]
								} else {
									return item
								}
							})
						} else {
							data.push(treeItem)
						}
					}
				}
				const newTree = tree.map(treeNode => {
					if (treeNode.children.length) {
						treeNode.children = treeNode.children.sort((a, b) => {
							if (Number(a.chaptersNo) < Number(b.chaptersNo)) {
								return -1
							} else if (Number(a.chaptersNo) > Number(b.chaptersNo)) {
								return 1
							} else {
								return 0
							}
						})
						return treeNode
					} else {
						return treeNode
					}
				})
				this.tree = newTree
			},
			async loadData() {
				const {
					normsNo
				} = this
				const {
					id
				} = this.userInfo
				const downloadNormsList = uni.getStorageSync(`xf_download_normsNoList${id}`)
				if (downloadNormsList && downloadNormsList[normsNo]) {
					let newDataList = downloadNormsList[normsNo].xfNormsChaptersList
					console.log('走的缓存')
					this.makeTree(newDataList);
				} else {
					const contentRes = await fetchContent({
						normsNo
					});
					this.makeTree(contentRes);
				}
			},
			goBack() {
				uni.navigateBack();
			},
			toContent(item, father) {
				console.log(this.tree)
				const ids = this.tree.reduce((acc, cur) => {
					return [...acc, cur.chaptersNo]
				}, [])
				uni.navigateTo({
					url: '/pages/np-content/np-content?normsNo=' + item.normsNo + '&chaptersNo=' + father.chaptersNo + '&tap=' +
						item.chaptersNo + '&ids=' + ids.join('-') + "&clauseNo=" + item.clauseNo
				});
			},
			// 进入当前规范的搜索页
			search() {
				uni.navigateTo({
					url: '/pages/content-search/content-search?normsNo=' + this.normsNo
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.np-container {
		&-wrap {
			padding: 28rpx;

			&-title {
				font-size: 36rpx;
				font-weight: 500;
				line-height: 50rpx;
				color: #333333;
			}

			&-content {
				padding: 6rpx 0;
			}
		}
	}

	.content-list {
		padding: 14rpx 0;

		&-p2 {
			padding: 14rpx 60rpx;
		}

		&-p3 {
			padding: 14rpx 60rpx;
		}
	}

	.collapse-item {
		height: 80rpx;
		background: #FFFFFF;
		box-shadow: 0px 6rpx 33rpx 0px rgba(124, 124, 124, 0.18);
		border-radius: 12rpx;
		margin: 14rpx 0;
		font-size: 28rpx;
		color: #666666;
		font-weight: 400;
		line-height: 40rpx;
		padding: 0 28rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		&-txt {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
