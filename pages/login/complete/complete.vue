<template>
	<view>
		<uni-nav-bar :fixed="true" title="个人信息" left-icon="back" rightText="跳过" :status-bar="true" @clickLeft="goBack" @clickRight="skip"/>
		<view class="complete-info">
			<view class="complete-info-avator">
				<view class="complete-info-avator-icon icon" @click="chooseImg">&#xe62a;</view>
				<image :src="userInfo.headimage || '/static/login/logo.png'" class="complete-info-avator-img icon"></image>
			</view>
			<view class="complete-info-basic">
				<view class="complete-info-basic-title">基本资料</view>
				<view class="complete-info-basic-form">
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">手机号</view>
						<view class="complete-info-basic-form-item-content">{{formData.phonenum}}</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">用户名</view>
						<view class="complete-info-basic-form-item-content"><input v-model="formData.nickname" class="complete-info-basic-form-item-content-ipt" @blur="checkNickName"/>
							<text class="complete-info-basic-form-item-content-tip" v-if="formData.nickNameHasUsed">用户名已被占用，请修改</text>
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">性别</view>
						<view class="complete-info-basic-form-item-content">
							<picker mode="selector" @change="bindSexPickEvent" :range="sexPick" :value="formData.sex">{{ sexPick[formData.sex] }}</picker>
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">生日</view>
						<view class="complete-info-basic-form-item-content">
							<picker mode="date" :start="startDate" :end="endDate" @change="bindDateChange">{{ formData.birthday }}</picker>
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">工作职务</view>
						<view class="complete-info-basic-form-item-content">
							<input class="complete-info-basic-form-item-content-ipt" v-model="formData.idstatus" placeholder="输入例如：建筑设计师、消防技术咨询、学生" placeholder-style="font-size: 24rpx; color: #ccc; width: 100%; text-align:right;" />
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">单位</view>
						<view class="complete-info-basic-form-item-content">
							<input class="complete-info-basic-form-item-content-ipt" v-model="formData.company" placeholder="请输入您的工作单位" placeholder-style="font-size: 24rpx; color: #ccc; width: 100%; text-align:right" />
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">居住地</view>
						<view class="complete-info-basic-form-item-content">
							<input class="complete-info-basic-form-item-content-ipt" v-model="formData.livecity" placeholder="请输入您的居住城市" placeholder-style="font-size: 24rpx; color: #ccc; width: 100%; text-align:right" />
						</view>
					</view>
					<view class="complete-info-basic-form-item" style="flex-direction: column; align-items: flex-start;">
						<view class="complete-info-basic-form-item-label">个人介绍</view>
						<view class="complete-info-basic-form-item-content" style="margin-top: 28rpx;">
							<input class="complete-info-basic-form-item-content-ipt" v-model="formData.introduction" placeholder="一句话介绍你的职业或兴趣" placeholder-style="font-size: 24rpx; color: #ccc; width: 100%;"
							 style="text-align: left; width: 695rpx;" />
						</view>
					</view>
					<view class="complete-info-basic-form-item">
						<view class="complete-info-basic-form-item-label">是否公开</view>
						<view class="complete-info-basic-form-item-content">
							<switch color="#FCD002" @change="visibleChange" />
						</view>
					</view>
				</view>
				<button class="complete-info-basic-submit" @tap="saveHandler">提交</button>
			</view>
		</view>
	</view>

</template>

<script>
	import { checkUserNameExit, submitUserInfo } from '../../../service/personal.js'
	import { handleUserAvatarUpload } from '../../../service/index.js'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	export default {
		onLoad(option) {
			if (option.phoneNumber) {
				const phoneNumber = option.phoneNumber
				this.formData.phonenum = phoneNumber
			} else if (option.userInfo) {
				const userInfo = JSON.parse(option.userInfo)
				this.formData.nickname = userInfo.nickName
			}
		},
		data() {
			return {
				formData: {
					phonenum: '',
					nickname: '',
					nickNameHasUsed: false,
					sex: 0,
					birthday: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`,
					idstatus: '',
					company: '',
					livecity: '',
					introduction: '',
					ispublic: 0
				},
				sexPick: ['男', '女']
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapGetters(['userInfo']),
		},
		methods: {
			...mapActions(['setUserInfo']),
			// 选择相片
			chooseImg() {
				const that = this
				const {
					id
				} = this.userInfo
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					async success(e) {
						// code later
						let filePath = e.tempFilePaths[0]
						let files = e.tempFiles
						const res = await handleUserAvatarUpload(id, filePath)
						console.log(res)
						if (res && res.data) {
							const info = JSON.parse(res.data)
							that.userInfo.headimage = info.data
							that.setUserInfo(that.userInfo)
						}
					}
				});
			},
			// 性别选择
			bindSexPickEvent(e, type) {
				this.formData.sex = e.target.value;
			},
			// 生日选择
			bindDateChange(e) {
				this.formData.birthday = e.target.value;
			},
			// 是否可见选择
			visibleChange(e) {
				console.log(e.target.value)
				this.formData.ispublic = e.target.value ? 1 : 0
			},
			// 获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 跳过
			skip() {
				uni.switchTab({
					url: '/pages/normative/index',
					animationType: 'pop-in'
				})
			},
			// 校验获取昵称
			async checkNickName(e) {
				const newName = e.detail.value;
				if (newName) {
					try{
						const checkRes = await checkUserNameExit(newName)
						if (checkRes) {
							this.formData.nickNameHasUsed = false
						}else{
							this.formData.nickNameHasUsed = true
						}
					}catch(e){
						if (!e.isok) {
							this.formData.nickNameHasUsed = true
						}
					}
				}
			},
			// 保存
			async saveHandler() {
				if (!this.formData.nickname) {
					uni.showToast({
						title: '请输入用户名',
						icon: 'none'
					})
					return
				}
				if (this.formData.nickNameHasUsed) {
					uni.showToast({
						title: '用户名已被占用，请修改',
						icon: 'none'
					})
					return
				}
				const nickname = this.formData.nickname
				const sex = this.formData.sex === 0 ? 1 : 2
				const birthday = this.formData.birthday
				const idstatus = this.formData.idstatus
				const company = this.formData.company
				const livecity = this.formData.livecity
				const introduction = this.formData.introduction
				const ispublic = this.formData.ispublic
				
				try{
					const submitRes = await submitUserInfo({
						nickname,
						sex,
						birthday,
						idstatus,
						company,
						livecity,
						introduction,
						ispublic
					})
					if (submitRes) {
						this.skip()
					}
				}catch(e){
					//TODO handle the exception
					uni.showToast({
						title: e.message,
						icon: 'none'
					})
				}
				
			}
		}
	};
</script>

<style lang="less" scoped>
	.complete-info {
		padding: 28rpx;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;

		&-avator {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			background: #eee;
			margin-bottom: 36rpx;
			position: relative;

			&-icon {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.7);
				top: 0;
				left: 0;
				color: #fff;
				font-size: 48rpx;
				line-height: 120rpx;
				text-align: center;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
			}

			&-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
		}

		&-basic {
			width: 100%;

			&-title {
				font-size: 36rpx;
				line-height: 50rpx;
				font-weight: 500;
				margin-bottom: 12rpx;
			}

			&-form {
				&-item {
					padding: 28rpx 0;
					border-bottom-width: 1rpx;
					border-bottom-color: #ededed;
					border-bottom-style: solid;
					display: flex;
					justify-content: space-between;
					flex-direction: row;
					align-items: center;

					&-label {
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: 400;
						color: #333;
					}

					&-content {
						font-size: 24rpx;
						line-height: 33rpx;
						font-weight: 400;
						color: #666;
						position: relative;
						&-ipt {
							font-size: 24rpx;
							color: #666;
							line-height: 34rpx;
							text-align: right;
							width: 480rpx;
						}
						&-tip {
							position: absolute;
							bottom: 0;
							right: 0;
							bottom: -32rpx;
							font-size: 20rpx;
							color: #E31313;
						}
					}
				}
			}

			&-submit {
				width: 100%;
				height: 88rpx;
				background-color: #fcd002;
				border-radius: 40rpx;
				font-weight: 500;
				font-size: 32rpx;
				color: #333;
				text-align: center;
				margin-top: 48rpx;
				// line-height: 45rpx;
			}
		}
	}
</style>
