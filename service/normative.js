import {
	getRequest,
	postRequest
} from './index.js'

// 查询banner url
const fetchBannerList = '/standards/xfBanner/list'
const fetchRecentUploadList = '/standards/xfNorms/homeNormsList'
const channelNormsListUrl = '/standards/xfNorms/channelNormsList'
const fetchContentUrl = '/standards/xfNorms/normsTable'
const fetchClassicUrl = '/comment/classic' // 获取条款评论数
const fetchLatestUrl = '/comment/latest' // 获取经典评论
const fetchZanUrl = '/comment/support/'
const fetchCaiUrl = '/comment/oppose/'
const fetchContentDetailUrl = '/standards/xfNorms/normsClause'
const fetchNormsContentUrl = '/standards/xfNorms/searchContent'
const fetchSimilarUrl = '/standards/xfNorms/normsSimilarity'
const fetchNormsCollectUrl = '/member/collectnorms'
const fetchNormDownloadUrl = '/standards/xfNorms/download'
const fetchShareClauseUrl = '/statistics/shareclause'
const fetchCommentUrl = '/comment/normscount'
const fetchCommentListUrl = '/comment/getclausecomment'
const fetchCommentSubmitUrl = '/comment/submitfornormsclause'

// 获取banner
export const fetchBanner = async () => {
	return await getRequest(fetchBannerList)
}
// 获取首页最新上传
export const fetchRecentUpload = async (data) => {
	return await getRequest(fetchRecentUploadList, data)
}
// 获取各个频道首页规范列表
export const channelNormsList = async (data) => {
	return await getRequest(channelNormsListUrl, data)
}
// 获取某个规范目录
export const fetchContent = async (data) => {
	return await getRequest(fetchContentUrl, data)
}
// 获取经典评论数
export const fetcClassic = async (data) => {
	return await getRequest(fetchClassicUrl, data)
}
// 获取最新评论
export const fetchLatest = async (data) => {
	return await getRequest(fetchLatestUrl, data)
}
// 踩
export const fetchCai = async (id) => {
	return await postRequest(fetchCaiUrl + id)
}
// 赞
export const fetchZan = async (id) => {
	return await postRequest(fetchZanUrl + id)
}
// 获取某个规范某个章节的内容信息
export const fetchContentDetail = async (params) => {
	return await getRequest(fetchContentDetailUrl, params)
}
// 规范内的搜索
export const fetchNormsContent = async (params) => {
	return await getRequest(fetchNormsContentUrl, params)
}
// 搜索同类索引
export const fetchSimilar = async (params) => {
	return await getRequest(fetchSimilarUrl, params)
}
// 校验用户是否收藏该章节
export const checkChapterIsCollected = async (normsNo, chaptersNo, clauseNo) => {
	const url = `/member/checkcollectnorms/${normsNo}/${chaptersNo}/${clauseNo}`
	return await getRequest(url)
}
// 收藏规范
export const fetchNormsCollect = async (params) => {
	return await postRequest(fetchNormsCollectUrl, params)
}
// 下载规范
export const fetchNormsDownload = async (params) => {
	return await getRequest(fetchNormDownloadUrl, params)
}
// 统计下载规范
export const fetchNormDownloadStat = async (normsId) => {
	const url = `/statistics/download/${normsId}`
	return await postRequest(url)
}

// 分享条文
export const shareClause = async (params) => {
	return await postRequest(fetchShareClauseUrl, params)
}
// 获取评论数
export const fetchComment = async ({
	normsNo,
	chaptersNo,
	clauseNo
}) => {
	const url = fetchCommentUrl + '/' + normsNo + '/' + chaptersNo + '/' + clauseNo
	return await getRequest(url)
}
// 获取评论列表
export const fetchCommentList = async ({
	normsNo,
	chaptersNo,
	clauseNo
}) => {
	const url = fetchCommentListUrl + '/' + normsNo + '/' + chaptersNo + '/' + clauseNo
	return await getRequest(url)
}
// 添加条文评论
export const fetchCommentSubmit = async (params) => {
	return await postRequest(fetchCommentSubmitUrl, params)
}
// 查询各模块数量
export const fetchNormModuleCount = async (normsType) => {
	// 查询各模块数量
	const fetchNormModuleCountUrl = '/standards/xfNorms/channelCount?normsType=' + normsType
	return await getRequest(fetchNormModuleCountUrl)
}
