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
	const newData = [];
	data.forEach((item, index) => {
		newData.push({
			name: 'files',
			uri: item
		})
	})
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

export const getImageDownload = (url) => {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url,
			success: (res) => {
				console.log('res', res)
				if (res.statusCode === 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: function(saveRes) {
							var savedFilePath = saveRes.savedFilePath;
							console.log('savedFilePat-------------', savedFilePath)
							resolve(savedFilePath)
						},
						fail(e) {
							console.log('e', e)
						}
					});
				}
			},
			fail: (err) => {
				console.log('err', err)
			}
		});
	})
}

/**
 * 处理目录
 */
export const handlexfNormsChaptersDtoList = (xfNormsChaptersDtoList) => {
	let newxfNormsChaptersDtoList = []
	return new Promise(async (resolve, reject) => {
		for (let index = 0; index < xfNormsChaptersDtoList.length; index++) {
			(async (index) => {
				let newItem = xfNormsChaptersDtoList[index];
				if (newItem.xfNormsClauseList.length === 0 || JSON.stringify(newItem.xfNormsClauseList).indexOf('img') === -1) {
					newxfNormsChaptersDtoList.push(newItem)
				} else {
					newItem.xfNormsClauseList = await getImageUpdate(newItem.xfNormsClauseList)
					newxfNormsChaptersDtoList.push(newItem)
				}
				if (xfNormsChaptersDtoList.length - 1 === index) {
					resolve(newxfNormsChaptersDtoList)
				}
			})(index)
		}
	})
}

/**
 * 处理章节-----Promise.all()
 */
export const getImageUpdate = (xfNormsClauseList) => {
	return new Promise((resolve, reject) => {
		let newxfNormsClauseList = [];
		xfNormsClauseList.forEach(async (item, index) => {
			// 获取内容和图示中的图片网络地址
			const imgList = [...getImgList(item.clauseContent), ...getImgList(item.clauseImage), ...getImgList(item.clauseInterpretation)]
			if (imgList.length === 0) {
				newxfNormsClauseList.push(item)
			} else {
				console.log('imgList.length', imgList.length)
				// const promiseAll = imgList.map(proItem => {
				// 	return getImageDownload(proItem)
				// })
				// const resAll = await Promise.all(promiseAll)
				// console.log('resAll------', resAll)
				for (let idx = 0; idx < imgList.length; idx++) {
					(async (idx, item) => {
						const downloadUrl = await getImageDownload(imgList[idx])
						uni.showModal({
							title: 'tttt',
							content: downloadUrl
						})
						console.log('downloadUrl', downloadUrl)
						// const downloadUrl = 'TESTTESTETST'
						if (JSON.stringify(item.clauseContent).indexOf('img') !== -1) {
							item.clauseContent = item.clauseContent.replace(new RegExp(imgList[idx], 'g'), downloadUrl)
						}
						if (JSON.stringify(item.clauseImage).indexOf('img') !== -1) {
							item.clauseImage = item.clauseImage.replace(new RegExp(imgList[idx], 'g'), downloadUrl)
						}
						if (JSON.stringify(item.clauseInterpretation).indexOf('img') !== -1) {
							item.clauseInterpretation = item.clauseInterpretation.replace(new RegExp(imgList[idx], 'g'),
								downloadUrl)
						}
						uni.showModal({
							title: '1212121',
							content: idx
						})
						if (idx === imgList.length - 1) {
							uni.showModal({
								title: '111',
								content: JSON.stringify(item.clauseContent)
							})
							newxfNormsClauseList.push(item)
						}
					})(idx, item)
				}
			}
			if (index === xfNormsClauseList.length - 1) {
				uni.showModal({
					title: '112121',
					content: newxfNormsClauseList.length
				})
				resolve(newxfNormsClauseList)
			}
		})
	})
}
