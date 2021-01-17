<template>
  <view class="vip-purchase-pay">
    <radio-group @change="radioChange">
      <view
        class="vip-purchase-pay-item flex-row-space"
        v-for="(item, index) in payTypes"
        :key="index"
      >
        <template>
          <view class="flex-row">
            <image :src="item.imgUrl" mode=""></image>
            <view class="title">
              {{ item.title }}
            </view>
          </view>
          <radio :value="item.value" :checked="item.value === payType" />
        </template>
      </view>
    </radio-group>
  </view>
</template>

<script>
export default {
  props: {
    // 支付方式数组
    payTypes: {
      type: Array,
      default: [],
    },
    // 支付方式
    payType: {
      type: String,
      default: "1",
    },
  },
  methods: {
    radioChange(e) {
      this.$emit("update:payType", e.detail.value);
    },
  },
};
</script>

<style lang="less" scoped>
.vip-purchase-pay {
  font-size: 28upx;
  color: #333;

  &-item {
    padding: 24upx;
    border-radius: 10upx;
    background: #fff;
    margin-bottom: 20upx;
    box-shadow: 0px 6upx 33upx 0px rgba(124, 124, 124, 0.18);

    image {
      width: 36upx;
      height: 36upx;
      margin-right: 10upx;
    }
  }

  &-item:last-child {
    border-bottom: none;
  }
}
</style>
