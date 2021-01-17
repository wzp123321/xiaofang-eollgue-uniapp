/**
 * 
 */
import Vue from "vue";
import {
	formatDate,
	formatDateTime,
	formateTime,
	changeEmoji,
	getImgList
} from '../utils/index.js'

const vueInjecter = {
	install: (Vue, options) => {
		Vue.prototype.$formatDate = formatDate;
		Vue.prototype.$formatDateTime = formatDateTime;
		Vue.prototype.$formateTime = formateTime;
		Vue.prototype.$changeEmoji = changeEmoji;
		Vue.prototype.$getImgList = getImgList;
	}
}

export { vueInjecter };
