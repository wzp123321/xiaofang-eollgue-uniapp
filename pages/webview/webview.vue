<template>
	<view style="width: 100%;height: 100%;">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			}
		},
		methods: {

		},
		onLoad(options) {
			this.src = options.href
		}
	}
</script>

<style>

</style>
