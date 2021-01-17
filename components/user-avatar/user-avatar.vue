<template>
	<view :style="{'width':width+'px','height':height+'px'}" class="user-avatar-comp">
		<image class="default-image" src="/static/personal/default_avatar.png" mode=""></image>
		<image :src="headimage" mode=""></image>
	</view>
</template>

<script>
	export default {
		name: 'userAvatar',
		props: {
			width: {
				type: Number,
				default: () => 48
			},
			height: {
				type: Number,
				default: () => 48
			},
			headimage: {
				type: String
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="less" scoped>
	.user-avatar-comp {
		border-radius: 50%;
		overflow: hidden;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.default-image {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>
