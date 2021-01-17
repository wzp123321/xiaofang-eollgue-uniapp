/** @format */

import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

import tabbarModule from './modules/tabbar.js'
import commonModule from './modules/common.js'
import userModule from './modules/user.js'
import downloadModule from './modules/download.js'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		commonModule,
		tabbarModule,
		userModule,
		downloadModule
	},
	getters
});
