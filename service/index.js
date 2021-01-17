let BASE_URL = '/api'
// #ifdef APP-VUE
BASE_URL = 'https://firecollegue.cn'
// #endif
import {
	getFilecalculate
} from '../utils/index.js'

const request = (url, method, data, ...args) => {
	const Authorization = uni.getStorageSync('Authorization') || ''
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			header: {
				Authorization
			},
			data,
			method,
			...args,
			success: (res) => {
				if (res.statusCode === 200) {
					const result = res.data
					if (result.code === 1 && result.isok) {
						resolve(result.data)
					} else {
						// token过期
						if (!res.data.isok && res.data.code === 70004) {
							console.log('run')
							uni.redirectTo({
								url: '/pages/login/index/index'
							})
						} else {
							reject(res)
						}
					}
				}
			},
			fail: (err) => {
				reject(err)
			},
			complete: (data) => {
				// if (data.statusCode === 500) {
				// 	uni.showToast({
				// 		title: '程序内部错误，请联系管理员',
				// 		position: 'bottom',
				// 		icon: 'none'
				// 	})
				// }
			}
		})
	})
}

// get请求 
export const getRequest = async (url, data = {}) => {
	try {
		return await request(url, 'GET', data)

	} catch (e) {
		return Promise.reject(e)
	}
}

// post请求
export const postRequest = async (url, data = {}) => {
	try {
		return await request(url, 'POST', data)
	} catch (e) {
		return Promise.reject(e)
	}
}

// 微信登录
export const wxNativeLogin = () => {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'oauth',
			success: (res) => {
				if (~res.provider.indexOf('weixin')) {
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							resolve(loginRes)
						},
						fail: (err) => {
							reject(err)
							uni.showModal({
								title: '错误',
								content: JSON.stringify(err)
							})
						}
					})
				}
			}
		})

	})
}

// 获取微信用户信息
export const getWeixinInfo = async () => {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			provider: 'weixin',
			success: function(infoRes) {
				resolve(infoRes)
			},
			fail: (err) => {
				reject(err)
			}
		});
	})
}

// 用户头像上传
export const handleUserAvatarUpload = (id, filePath) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: BASE_URL + '/community/xfFile/uploadHeadimage',
			filePath: filePath, // uni.chooseImage函数调用后获取的本地文件路劲
			name: 'file',
			formData: {
				id
			},
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		});
	})
}

// 评论图片上传---支持批量
export const handleFileButhUpload = (filePaths) => {
	const files = getFilecalculate(filePaths)
	console.log(files)
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: BASE_URL + '/community/xfFile/uploadImage',
			files,
			success: (res) => {
				const newRes = JSON.parse(res.data)
				resolve(newRes)
			},
			fail: (err) => {
				reject(err)
			}
		});
	})
}

// const uploadFile = (files) => {
// 	return new Promise((resolve, reject) => {
// 		uni.uploadFile({
// 			url: BASE_URL + '/community/xfFile/uploadImage',
// 			files,
// 			success: (res) => {
// 				if (res && res.data) {
// 					console.log(JSON.parse(res.data).data)
// 					resolve(JSON.parse(res.data).data[0] || '')
// 				} else {
// 					console.log(res)
// 					uni.showToast({
// 						icon: 'none',
// 						title: '上传失败'
// 					})
// 					uni.hideLoading()
// 				}
// 			},
// 			fail: (err) => {
// 				console.log('err', err)
// 				reject(err)
// 			}
// 		})
// 	})
// }

//  支付宝支付
export const handleAliPay = (orderInfo) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'alipay',
			orderInfo, //支付宝订单数据
			success: function(res) {
				resolve(res)
			},
			fail: function(err) {
				reject(err)
			}
		});
	})
}

// 微信支付
export const handleWeixinPay = (orderInfo) => {
	const {
		appid,
		noncestr,
		partnerid,
		prepayid,
		sign,
		timestamp
	} = orderInfo
	const newPackage = orderInfo.package
	console.log('orderInfo', JSON.stringify(orderInfo))
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: "wxpay",
			timeStamp: timestamp,
			nonceStr: noncestr,
			package: newPackage,
			signType: "MD5",
			paySign: sign,
			orderInfo: JSON.stringify(orderInfo),
			success: function(res) {
				resolve(res)
			},
			fail: function(err) {
				reject(err)
			}
		});
	})
}

// 微信分享 
export const handleWeixinShare = (title, imageUrl, href, summary) => {
	return new Promise((resolve, reject) => {
		uni.share({
			provider: 'weixin',
			scene: 'WXSceneSession',
			type: 0,
			title,
			imageUrl,
			href,
			summary,
			success(res) {
				console.log('分享成功')
				resolve(res)
			},
			fail(err) {
				console.log('分享失败')
				reject(err)
			},
			complete() {
				console.log('分享完成')
			}
		})
	})
}
