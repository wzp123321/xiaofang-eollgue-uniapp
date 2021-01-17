import {
	getRequest,
	postRequest
} from './index.js'

// 获取用户自己信息
export const getUserInfo = async () => {
	const url = '/member/getinfo';
	return await getRequest(url)
}

// 查看他人信息
export const viewUserInfo = async (data) => {
	const url = `/member/${data}`;
	return await getRequest(url)
}

// 提交个人信息信息
export const submitUserInfo = async (data) => {
	console.log(data)
	const url = '/member/saveinfo';
	return await postRequest(url, data)
}

// 校验用户名是否存在
export const checkUserNameExit = async (nickname) => {
	const url = `/member/checkname/${nickname}`;
	return await postRequest(url)
}

// 提交意见反馈
export const submitUserfeedback = async (data) => {
	console.log(data)
	const url = '/member/submitfeedback';
	return await postRequest(url, data)
}

// 获取用户意见反馈
export const getUserFeedback = async () => {
	const url = '/member/myfeedbacks';
	return await getRequest(url)
}

// 绑定手机号码
export const getPhonebind = async (data) => {
	const {
		phone,
		valicode
	} = data;
	const url = `/member/bindphone/${phone}/${valicode}`;
	return await postRequest(url)
}

// 获取我的收藏夹
export const getUserFavoritesList = async () => {
	const url = '/member/myfavorites';
	return await getRequest(url)
}

// 获取下级收藏夹
export const getChildrenFavorites = async (parentId) => {
	const url = `/member/getfavorites/${parentId}`;
	return await getRequest(url)
}

// 添加收藏夹（编辑收藏夹）
export const getFavoritesAdd = async (data) => {
	const url = '/member/savefavorites';
	return await postRequest(url, data)
}

// 删除收藏夹
export const getFavoritesDelete = async (favoritesId) => {
	const url = `/member/delfavorites/${favoritesId}`;
	return await postRequest(url)
}

// 获取收藏夹内容
export const getFavoritesContent = async (data) => {
	const url = '/standards/xfNorms/favoritesList';
	return await getRequest(url, data)
}

// 收藏内容  favoriteId:收藏夹Id    interpretationId:解读Id
export const getInterpretationCollect = async (favoriteId, interpretationId) => {
	const url = `/member/collectinterpretation/${favoriteId}/${interpretationId}`;
	return await postRequest(url)
}

// 删除收藏的内容
export const getFavoritesContentDelete = async (id) => {
	const url = `/member/uncollectinterpretation/${id}`;
	return await postRequest(url)
}

// 获取vip套餐列表
export const getVipList = async () => {
	const url = '/pay/xfPaymentInfo/vipList';
	return await getRequest(url)
}

// 获取支付订单信息
export const getPaymentInfo = async (data) => {
	const url = '/pay/xfPaymentInfo/addPaymentInfo';
	return await getRequest(url, data)
}

// iap支付校验
export const getIapPayCheck = async (data) => {
	const url = '/pay/ios/neigou';
	return await getRequest(url, data)
}
