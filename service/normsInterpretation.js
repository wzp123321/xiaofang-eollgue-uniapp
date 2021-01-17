import {
	getRequest,
	postRequest
} from './index.js'

// 规范解读列表
export const getNormsInterpretationList = async (data) => {
	const url = '/standards/xfNorms/normsInterpretationList';
	return await getRequest(url, data)
}

// 规范解读详情
export const getNormsInterpretationInfoById = async (data) => {
	const url = '/standards/xfNorms/normsInterpretation';
	return await getRequest(url, data)
}

// 规范解读精选评论列表
export const getNormsInterpretationChoiceCommentList = async (interpretationId) => {
	const url = `/comment/getinterpretationchoice/${interpretationId}`;
	return await getRequest(url)
}

// 规范解读评论列表
export const getNormsInterpretationCommentList = async (interpretationId,data) => {
	const url = `/comment/getinterpretationcomment/${interpretationId}`;
	return await getRequest(url,data)
}

// 添加解读评论
export const submitForinterpretationComment = async (data) => {
	const url = '/comment/submitforinterpretation';
	return await postRequest(url, data)
}

// 收藏规范解读  
export const getCollectinterpretation = async (interpretationId) => {
	const url = `/member/collectinterpretation/${interpretationId}`;
	return await postRequest(url)
}

// 分享解读  
export const getShareinterpretation = async (interpretationId) => {
	const url = `/statistics/shareinterpretation/${interpretationId}`;
	return await postRequest(url)
}

// 检查解读是否被收藏 
export const getInterpretationisCollect = async (interpretationId) => {
	const url = `/member/checkcollectinterpretation/${interpretationId}`;
	return await getRequest(url)
}

// 获取分享内容
export const handleShareContent = () => {
	const url ='/community/xfMymsg/getMymsg'
	return getRequest(url)
}
