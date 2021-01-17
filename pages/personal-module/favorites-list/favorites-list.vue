<template>
  <view class="collection-list flex-column" @tap="handleDropDownHide">
    <view class="add-collection flex-row" @tap.stop="handleOpenPop">
      <image src="../../../static/personal/add-collection.png" mode=""></image>
      <text>新建收藏夹</text>
    </view>
    <view class="collection-list-data">
      <view style="width: 100%; height: 20rpx; background-color: #eee"> </view>
      <!-- 子收藏夹列表 -->
      <view
        class="module-item flex-row"
        v-for="(item, index) in collectionList"
        :key="index"
        @tap.stop="
          linkToCollectionInfo(
            item.id,
            item.title,
            item.parentId,
            item.description,
            item.category
          )
        "
      >
        <image
          src="../../../static/personal/collection-children.png"
          mode=""
        ></image>
        <view class="flex-column">
          <view class="title">
            {{ item.title }}
          </view>
          <view class="description">
            {{ item.description }}
          </view>
        </view>
        <view class="total"> {{ item.contentCount || 0 }}个内容 </view>
      </view>
      <view
        v-if="collectionDataList.length > 0"
        style="width: 100%; height: 20rpx; background-color: #eee"
      >
      </view>
      <!-- 收藏的内容列表 -->
      <view
        v-for="(item, index) in collectionDataList"
        :key="'content_' + index"
      >
        <!-- 规范 -->
        <NormInfo v-if="category === '1'" :SpecificationInfo="item">
          <view class="delete-image" @tap.stop="handleDeletePopover(item.id)">
            <image src="/static/personal/edit-more.svg" mode=""></image>
            <view
              class="delete flex-row"
              v-show="isDelete && contentId === item.id"
              @tap.stop="handleDeleteSure()"
            >
              <image
                src="/static/personal/delete-collection.svg"
                mode=""
              ></image>
              <text>删除</text>
            </view>
          </view>
        </NormInfo>
        <!-- 规范解读 -->
        <specificationInterpretation
          v-else
          :InterpretationInfo="item"
          :isCollect="true"
        >
          <view class="delete-image" @tap.stop="handleDeletePopover(item.id)">
            <image src="/static/personal/edit-more.svg" mode=""></image>
            <view
              class="delete flex-row"
              v-show="isDelete && contentId === item.id"
              @tap.stop="handleDeleteSure()"
            >
              <image
                src="/static/personal/delete-collection.svg"
                mode=""
              ></image>
              <text>删除</text>
            </view>
          </view>
        </specificationInterpretation>
      </view>
    </view>
    <collectlistEditPopup
      ref="createPopup"
      :parentId="parentId"
      :id="0"
      @success="handleCollCreateSuccess"
    ></collectlistEditPopup>
  </view>
</template>

<script>
import {
  getChildrenFavorites,
  getFavoritesContent,
  getFavoritesContentDelete,
} from "../../../service/personal.js";
import specificationInterpretation from "../../../components/specification-Interpretation/specification-Interpretation.vue";
import NormInfo from "../collection-detail/components/NormInfo.vue";
import collectlistEditPopup from "../../../components/collectlist-edit-popup/collectlist-edit-popup.vue";
export default {
  data() {
    return {
      parentId: 0, // 类型 0:规范收藏夹  1:规范解读收藏夹
      collectionList: [], // 子收藏夹列表
      collectionDataList: [], // 收藏的内容列表
      title: "",
      pagination: {
        page: 1,
        total: 0,
      },
      category: 1, //1：规范   2：规范解读
      isDelete: false, // 是否显示删除的蒙版
      contentId: "", // 需要删除的内容id
    };
  },
  components: {
    specificationInterpretation,
    NormInfo,
    collectlistEditPopup,
  },
  methods: {
    // 全局方法---关闭删除下拉
    handleDropDownHide() {
      this.isDelete = false;
    },
    // 跳转子收藏夹详情页
    linkToCollectionInfo(id, title, parentId, description, category) {
      uni.navigateTo({
        url:
          "../collection-detail/collection-detail?id=" +
          id +
          "&title=" +
          title +
          "&parentId=" +
          parentId +
          "&description=" +
          description +
          "&category=" +
          category,
      });
    },
    // 新建收藏夹弹框
    handleOpenPop() {
      this.$refs.createPopup.setSharePopupShow(true);
    },
    // 收藏夹新增成功回调
    handleCollCreateSuccess(value) {
      uni.showToast({
        icon: "success",
        title: "新增成功",
      });
      this.pagination.page = 1;
      this.getChildrenCollectionList();
      this.$refs.createPopup.setSharePopupShow(false);
    },
    // 删除下拉
    handleDeletePopover(id) {
      this.contentId = id;
      this.isDelete = true;
    },
    // 打开删除确认框
    handleDeleteSure() {
      this.isDelete = false;
      const { contentId } = this;
      const that = this;
      uni.showModal({
        title: "删除内容",
        content: "你确认删除该内容吗?",
        async success(delRes) {
          if (delRes.confirm) {
            const res = await getFavoritesContentDelete(contentId);
            if (res) {
              uni.showToast({
                icon: "none",
                title: "删除成功",
              });
              that.contentId = "";
              that.pagination = {
                page: 1,
                total: 0,
              };
              that.isDelete = false;
              that.getFavoritesContentList();
            }
          } else if (delRes.cancel) {
            that.isDelete = false;
          }
        },
        fail() {
          that.contentId = "";
        },
      });
    },
    // 获取子级收藏夹
    async getChildrenCollectionList() {
      uni.showLoading({
        title: "加载中",
      });
      const { parentId } = this;
      try {
        const res = await getChildrenFavorites(parentId);
        if (res) {
          this.collectionList = res;
          uni.hideLoading();
          uni.stopPullDownRefresh();
        }
      } catch (error) {
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
    // 获取收藏夹内容
    async getFavoritesContentList() {
      uni.showLoading({
        title: "加载中",
      });
      const { page } = this.pagination;
      const limit = 10;
      const favoriteId = this.parentId;
      try {
        const res = await getFavoritesContent({
          favoriteId,
          page,
        });
        if (res) {
          const list = res.records;
          const total = res.total;
          this.collectionDataList = list;
          this.pagination.total = total;
          uni.hideLoading();
          uni.stopPullDownRefresh();
        }
      } catch (error) {
        uni.hideLoading();
        uni.stopPullDownRefresh();
      }
    },
    // 初始化数据
    initData() {
      this.pagination = {
        page: 1,
        total: 0,
      };
      this.collectionList = [];
      this.collectionDataList = [];
    },
  },
  onLoad(options) {
    this.$nextTick(function () {
      const { title, category } = options;
      this.category = category;
      uni.setNavigationBarTitle({
        title: title,
      });
    });
  },
  onShow() {
    if (uni.getStorageSync("collectParentId")) {
      this.parentId = uni.getStorageSync("collectParentId");
    }
    this.initData();
    this.getChildrenCollectionList();
    this.getFavoritesContentList();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initData();
    this.getChildrenCollectionList();
    this.getFavoritesContentList();
  },
};
</script>

<style lang="less" scoped>
.collection-list {
  height: 100%;
  background: #fff;
  font-size: 13px;
  color: #999;

  .add-collection {
    color: #333;
    font-weight: bold;
    padding: 26rpx 28rpx;

    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
    }
  }

  .collection-list-data {
    flex: 1;
    background: #fff;

    .delete-image {
      z-index: 99;
      position: absolute;
      top: 30rpx;
      right: 28rpx;

      image {
        width: 36rpx;
        height: 36rpx;
      }

      .delete {
        position: absolute;
        top: 40rpx;
        right: -10rpx;
        width: 100rpx;
        padding: 20rpx 24rpx;
        background: #fff;
        font-size: 28rpx;
        color: #333;
        border-radius: 8rpx;
        border: 1px solid #ededed;
        z-index: 999;

        image {
          width: 28rpx;
          height: 28rpx;
          margin-top: 4rpx;
        }
      }

      .delete:before {
        box-sizing: content-box;
        width: 0;
        height: 0;
        position: absolute;
        top: -30rpx;
        right: 8rpx;
        padding: 0;
        border-bottom: 8px solid #ffffff;
        border-top: 8px solid transparent;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        z-index: 2;
        content: "";
      }

      .delete:after {
        box-sizing: content-box;
        width: 0;
        height: 0;
        position: absolute;
        top: -34rpx;
        right: 6rpx;
        padding: 0;
        border-bottom: 9px solid #ededed;
        border-top: 9px solid transparent;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        z-index: 1;
        content: "";
      }
    }

    .module-item {
      position: relative;
      padding: 23rpx 28rpx;
      margin: 28rpx 28rpx 36rpx 28rpx;
      border-radius: 12rpx;
      box-shadow: 0px 6rpx 33rpx 0px rgba(124, 124, 124, 0.18);

      image {
        width: 96rpx;
        height: 96rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }

      .title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        margin-bottom: 20rpx;
      }

      .total {
        position: absolute;
        top: 24rpx;
        right: 26rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
