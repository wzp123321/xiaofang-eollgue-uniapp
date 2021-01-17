/** @format */
import * as types from '../mutations';

const user = {
	state: {
		userInfo: uni.getStorageSync('xf_userInfo') || {}
	},
	mutations: {
		[types.SET_USER_INFO](state, data) {
			let userInfo = data;
			uni.setStorageSync('xf_userInfo', userInfo)
			state.userInfo = userInfo;
		}
	},
	actions: {
		setUserInfo: ({
			commit,
			state
		}, data) => {
			commit(types.SET_USER_INFO, data);
		}
	}
};

export default user
