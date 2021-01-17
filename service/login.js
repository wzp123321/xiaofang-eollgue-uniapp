import {
	postRequest,
	wxNativeLogin,
	getRequest
} from './index.js'

// 微信登录地址
const wxLoginUrl = '/auth/wxlogin2/'
const getCodeUrl = '/auth/getcode/'
const refreshUrl = '/auth/refreshtoken'

// 微信登录
export const wxLogin = async (openid, accessToken, clientId) => {
	try {
		const url = wxLoginUrl + openid + '/' + accessToken + '?clientId=' + clientId
		console.log('微信登陆url', url)
		return await postRequest(url)
	} catch (e) {
		console.log(e)
	}
}
// 调用原生微信登录
export const wxLoginNative = async () => {
	return await wxNativeLogin()
}
// 获取手机验证码
export const getCode = async (code) => {
	const url = getCodeUrl + code
	return await postRequest(url)
}

// 根据手机号码和验证码获取用户登录令牌
export const getAuthorizationByPhoneCode = async (data) => {
	const {
		phone,
		valicode,
		invitecode,
		clientId
	} = data;
	const url = invitecode ? `/auth/gettoken/${phone}/${valicode}?clientId=${clientId}&invitecode=` + invitecode :
		`/auth/gettoken/${phone}/${valicode}?clientId=` + clientId;
	console.log('手机号码登陆url', url)
	return await postRequest(url)
}
// 刷新token
export const refreshToken = async () => {
	return await postRequest(refreshUrl)
}
