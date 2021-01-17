import {
	postRequest,
	wxNativeLogin,
	getRequest
} from './index.js'

const searchUrl = '/standards/xfNorms/searchNormsNo'

// 搜索
export const search = (param) => {
	return getRequest(searchUrl, param)
}

