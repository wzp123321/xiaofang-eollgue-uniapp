/**
 * @param date
 */
export const formatDate = date => {
	const dateTime = new Date(date)
	const YY = dateTime.getFullYear()
	const MM =
		dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1
	const DD =
		dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
	const hh =
		dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()
	const mm =
		dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()
	const ss =
		dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds()
	return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
};

export const formatDateTime = (date) => {
	const dateTime = new Date(date)
	const YY = dateTime.getFullYear()
	const MM =
		dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1
	const DD =
		dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate()
	const hh =
		dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()
	const mm =
		dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()
	const ss =
		dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds()
	return `${YY}-${MM}-${DD}`
}

export const formateTime = (time, split = ' ') => {
	if (!time) {
		return
	}
	const times = time.split(split)
	return times[0]
}

// 处理选中的文件
export const getFilecalculate = (data) => {
	const newData = [{
		name: 'files',
		uri: data
	}];
	return newData
}

/**
 * 过滤输入框表情
 */
export const changeEmoji = (content) => {
	var patt = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
	return content.replace(patt, '')
}

/**
 * 获取富文本内容中的图片地址   存入数组返回
 */
export const getImgList = (html) => {
	var list = [];
	if (!html || Object.keys(html).length === 0) {
		return list
	}
	html.replace(/<img [^="">]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		list.push(capture);
	});
	return list;
}

/**
 * 图片下载保存
 */
export const getImageDownload = (url, callback) => {
	uni.downloadFile({
		url,
		success: (res) => {
			if (res.statusCode === 200) {
				uni.saveFile({
					tempFilePath: res.tempFilePath,
					success: function(saveRes) {
						var savedFilePath = saveRes.savedFilePath;
						callback({
							[url]: savedFilePath
						})
					},
					fail(e) {
						callback({
							[url]: ''
						})
					}
				});
			}
		},
		fail: (err) => {
			callback({
				[url]: ''
			})
		}
	});
}

/**
 * 处理图片
 */
export const handlexfNormsChaptersDtoList = async (xfNormsChaptersDtoList, callback) => {
	uni.removeStorageSync('xf_download_imageList')
	let newxfNormsChaptersDtoList = [];

	/**
	 * 获取所有带图片的章节
	 */
	xfNormsChaptersDtoList.forEach(item => {
		newxfNormsChaptersDtoList = [...newxfNormsChaptersDtoList, ...item.xfNormsClauseList]
	})
	newxfNormsChaptersDtoList = newxfNormsChaptersDtoList.filter(item => {
		return JSON.stringify(item).indexOf('img') !== -1
	})
	/**
	 * 获取章节下所有图片地址
	 */
	let imgList = []
	newxfNormsChaptersDtoList.forEach((item, index) => {
		const clauseContentImages = item.clauseContent && item.clauseContent.indexOf('img') !== -1 ? getImgList(item.clauseContent) :
			[];
		const clauseImages = item.clauseImage && item.clauseImage.indexOf('img') !== -1 ? getImgList(item.clauseImage) : [];
		const clauseDescImages = item.clauseInterpretation && item.clauseInterpretation.indexOf('img') !== -1 ?
			getImgList(item.clauseInterpretation) : [];

		imgList = [...imgList, ...clauseContentImages, ...clauseImages, ...clauseDescImages]
	})

	// 数组去重
	let normImageList = {}
	imgList = Array.from([...new Set(imgList)])
	console.log('imgList---------', imgList)
	if (imgList.length === 0) {
		console.log('下载的没有图片')
		uni.hideLoading()
		return
	}
	// 下载
	imgList.forEach((childItem, childIndex) => {
		getImageDownload(childItem, (res) => {
			if (res) {
				normImageList = Object.assign(normImageList, res)
				callback(imgList.length, Object.keys(normImageList).length)
				if (childIndex === imgList.length - 1) {
					const xf_download_imageList = uni.getStorageSync('xf_download_imageList') ? uni.getStorageSync(
						'xf_download_imageList') : {};
					let obj = Object.assign(normImageList, xf_download_imageList)

					// 存入缓存
					uni.setStorageSync('xf_download_imageList', obj)
					console.log('图片下载完成', normImageList)

				}
			}
		})
	})
}
