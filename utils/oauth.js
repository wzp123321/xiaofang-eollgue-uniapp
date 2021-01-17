// 使用Plus访问微信登录功能

class WeixinOauth {
	constructor() {
	  this.initOauth()
		// 微信授权对象
		this.authWeixin = null
		// 当前支持的授权环境
		this.auths = {}
	}
	
	initOauth() {
		// 登录授权
		plus.oauth.getServices(
			services => {
				console.log(services)
				services.forEach(service => {
					this.auths[service.id] = service
				})
				if (this.auths['weixin']) {
					this.authWeixin = this.auths['weixin']
				}
				// 请求授权认证
				// this.authorizeWeixin()
			},
			err => {
				plus.nativeUI.alert("获取登录授权服务列表失败："+JSON.stringify(e));
			}
		)
	}
	
	// 授权认证微信
	authorizeWeixin(callback) {
		if (!this.authWeixin) {
			plus.nativeUI.alert("当前环境不支持微信登录 authorizeWeixin");
			return;
		}
		this.authWeixin.authorize(
			success => {
				console.log('微信授权成功', success)
				this.weixinLogin(callback)
			},
			err => {
				console.log('微信授权失败', err)
			}
		)
	}
	
	// 微信登录
	weixinLogin(callback) {
		console.log(this.authWeixin)
		if (!this.authWeixin) {
			plus.nativeUI.alert("当前环境不支持微信登录 weixinLogin");
			return;
		}
		if (!this.authWeixin.authResult) {
			this.authWeixin.login(
				success => {
					console.log('微信获取登录信息成功', success)
					this.getUserInfo(success,callback)
				},
				err => {
					plus.nativeUI.alert("登录认证失败: "+JSON.stringify(err));
				}
			)
		} else {
			plus.nativeUI.alert("已经登录认证!");
		}
	}
	
	// 获取微信用户信息
	getUserInfo(loginInfo,callback) {
		console.log(loginInfo)
		if (!this.authWeixin) {
			plus.nativeUI.alert("当前环境不支持微信登录 weixinLogin");
			return;
		}
		const result = {
			authInfo: loginInfo.target.authResult,
			userInfo: loginInfo.target.userInfo
		}
		callback ? callback(result) : this.loginSuccess(result)
	}
	
	// 登录成功
	loginSuccess(success) {
		return () => {
			return success
		}
	}
	
	logout(callback,err) {
		if (!this.authWeixin) {
			plus.nativeUI.alert("当前环境不支持微信登录 weixinLogin");
			return;
		}
		if (this.authWeixin) {
			this.authWeixin.logout((success) => {
				callback(success)
			}, (error) => {
				err(error)
			})
		}
	}
}

export default WeixinOauth