import {
	postRequest,
	getRequest
} from './index.js'

// 评论点赞
export const getCommentSupport = async (commentId) => {
	const url = `/comment/support/${commentId}`;
	return await postRequest(url)
}

// 取消评论点赞
export const getCommentSupportCancel = async (commentId) => {
	const url = `/comment/undosupport/${commentId}`;
	return await postRequest(url)
}

// 评论点踩
export const getCommentOppose = async (commentId) => {
	const url = `/comment/oppose/${commentId}`;
	return await postRequest(url)
}

// 取消评论点踩
export const getCommentOpposeCancel = async (commentId) => {
	const url = `/comment/undooppose/${commentId}`;
	return await postRequest(url)
}

// 回复评论
export const getCommentReply = async (data) => {
	const url = '/comment/submitsubcomment';
	return await postRequest(url, data)
}

// 获取规范精选评论
export const getNormativeFeaCommentList = async (normsNo, chaptersNo, clauseNo) => {
	const url = `/comment/getclausechoice/${normsNo}/${chaptersNo}/${clauseNo}`;
	return await getRequest(url)
}
