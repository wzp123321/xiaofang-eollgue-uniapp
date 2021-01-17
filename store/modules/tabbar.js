export default {
	state: {
		tabArr: [
			{
				tabName: '规范',
				iconPath: '/static/tabbar/tab1.svg',
				selected_iconPath: '/static/tabbar/tab1_selected.svg',
				backgroundColor: '#fff'
			},
			{
				tabName: '规范解读',
				iconPath: '/static/tabbar/tab2.svg',
				selected_iconPath: '/static/tabbar/tab2_selected.svg',
				backgroundColor: '#fff'
			},
			{
				tabName: '我的',
				iconPath: '/static/tabbar/tab3.svg',
				selected_iconPath: '/static/tabbar/tab3_selected.svg',
				backgroundColor: '#251E1E'
			}
		]
	},
	mutations: {
		setTabbar(state, payload) {
			state.tabArr = payload
		}
	}
}