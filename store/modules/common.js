/** @format */
import * as types from '../mutations';
const common = {
	state: {
		navigateBarHeight: 0, // 导航栏高度
		statusBarHeight: 0,
	},
	mutations: {
		[types.SET_NAV_HEIGHT](state, data) {
			state.navigateBarHeight = data;
		},
		[types.SET_STATUSBAR_HEIGHT](state, data) {
			state.statusBarHeight = data;
		},
	},
	actions: {
		setNavigateBarHeight: ({
			commit,
			state
		}, data) => {
			commit(types.SET_NAV_HEIGHT, data);
		},
		setStatusBarHeight: ({
			commit,
			state
		}, data) => {
			commit(types.SET_STATUSBAR_HEIGHT, data);
		}
	}
};

export default common
