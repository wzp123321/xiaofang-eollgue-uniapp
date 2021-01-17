/** @format */
import * as types from '../mutations';
import {
	handlexfNormsChaptersDtoList
} from '../../utils/index.js'
import userModule from './user.js'

export const getDownloadList = () => {
	const id = userModule.state.userInfo.id
	let downloadNormsList = uni.getStorageSync(`xf_download_normsNoList${id}`) || {}
	console.log(id)
	let dataSource = []
	if (downloadNormsList) {
		for (let key in downloadNormsList) {
			const dataSourceItem = downloadNormsList[key].xfNorms
			dataSourceItem.select = false
			dataSourceItem.id = dataSourceItem.normsNo
			dataSource.push(dataSourceItem)
		}
	}
	return dataSource
}

const download = {
	state: {
		downloadNormsList: uni.getStorageSync(`xf_download_normsNoList${userModule.state.userInfo.id}`) || {}
	},
	mutations: {
		/**
		 * 新增下载
		 */
		async [types.SET_XF_DOWNLOAD_NORMSLIST](state, data) {

			// 拿到用户信息
			const userInfo = userModule.state.userInfo
			const id = userInfo.id || 0
			let downloadNormsList = uni.getStorageSync(`xf_download_normsNoList${id}`) || {}
			let normsNo = data.xfNorms.normsNo


			downloadNormsList[normsNo] = data
			uni.setStorageSync(`xf_download_normsNoList${id}`, downloadNormsList)
			state.downloadNormsList = downloadNormsList;

			// 章节列表
			handlexfNormsChaptersDtoList(data.xfNormsChaptersDtoList, (total, current) => {
				const precent = (current / total) * 100
				uni.showToast({
					icon: 'loading',
					duration: 5000,
					title: `${precent.toFixed(0)}/100%`
				})
				if (total === current) {
					uni.showToast({
						duration: 1000,
						title: '下载成功'
					})
				}
			})
		},
		/**
		 * 删除下载
		 */
		[types.DELETE_XF_DOWNLOAD_NORMSLIST](state, data) {
			const userInfo = userModule.state.userInfo
			const id = userInfo.id
			let downloadNormsList = uni.getStorageSync(`xf_download_normsNoList${id}`) || {}
			data.forEach(item => {
				delete downloadNormsList[item]
			})
			uni.setStorageSync(`xf_download_normsNoList${id}`, downloadNormsList)
			state.downloadNormsList = downloadNormsList;
		}
	},
	actions: {
		// 新增下载
		setXFDownloadVersions: ({
			commit,
			state
		}, data) => {
			commit(types.SET_XF_DOWNLOAD_NORMSLIST, data);
		},
		// 删除下载
		deleteXFDownloadVersions: ({
			commit,
			state
		}, data) => {
			commit(types.DELETE_XF_DOWNLOAD_NORMSLIST, data);
		}
	}
};

export default download
