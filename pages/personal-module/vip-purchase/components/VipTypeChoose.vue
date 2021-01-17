<template>
  <view class="vip-type-choose">
    <view
      v-for="(item, index) in vipList"
      :key="index"
      :class="[
        'vip-type-choose-item',
        'flex-column',
        goodInfo.id === item.id ? 'vip-type-choose-active' : '',
      ]"
      @tap="chooseVipType(item)"
    >
      <image
        v-if="goodInfo.id === item.id"
        class="vip-type-choose-active-image"
        src="/static/personal/pay-type-active.png"
        mode=""
      ></image>
      <view class="title">
        {{ item.goodsName }}
      </view>
      <view class="price"> ￥{{ item.rebatePrice || item.price }} </view>
      <view class="preprice" style="height: 16px" v-if="!isIOS">
        {{ item.rebatePrice ? item.price : "" }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    vipList: {
      type: Array,
      default: () => [],
    },
    goodInfo: {
      type: Object,
      default: {},
    },
    // isios
    isIOS: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //选择VIP类型
    chooseVipType(value) {
      this.$emit("update:goodInfo", value);
    },
  },
};
</script>

<style lang="less" scoped>
.vip-type-choose {
  margin-top: 40upx;
  display: flex;

  &-item {
    position: relative;
    overflow: hidden;
    font-size: 24upx;
    color: #333;
    width: 212upx;
    height: 200upx;
    border-radius: 10upx;
    text-align: center;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 6upx 33upx 0px rgba(124, 124, 124, 0.18);
    margin: 0 20upx;

    view {
      font-size: 28upx;
      color: #666666;
      margin-bottom: 10upx;
    }

    .title {
      font-size: 32upx;
      color: #333;
    }

    .preprice {
      color: #ccc;
      font-size: 24upx;
      text-decoration: line-through;
    }
  }

  &-item:nth-child {
    margin-left: 0;
  }

  &-active {
    background: rgba(255, 252, 238, 1);
    border: 1upx solid rgba(252, 208, 2, 1);

    &-image {
      width: 46upx;
      height: 46upx;
      background-repeat: no-repeat;
      position: absolute;
      top: 0;
      z-index: 999;
      right: 0;
    }
  }
}
</style>
