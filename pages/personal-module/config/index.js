// 个人中心模块数组
export const userModules = [{
		title: "购买VIP",
		hasBorder: true,
		url: "/pages/personal-module/vip-purchase/vip-purchase",
		imgUrl: '/static/personal/vip-buy.svg'
	},
	{
		title: "我的收藏",
		hasBorder: true,
		url: "/pages/personal-module/my-collection/my-collection",
		imgUrl: '/static/personal/collect-ico.svg'
	},
	{
		title: "我的下载",
		hasBorder: false,
		url: "/pages/personal-module/my-download/my-download",
		imgUrl: '/static/personal/download-ico.svg'
	},
	{
		title: "意见反馈",
		hasBorder: true,
		url: "/pages/personal-module/feedback/feedback",
		imgUrl: '/static/personal/feedback-ico.svg'
	},
	{
		title: "关于我们",
		hasBorder: true,
		url: "/pages/personal-module/about-us/about-us",
		imgUrl: '/static/personal/about-us-ico.svg'
	},
	{
		title: "隐私政策",
		hasBorder: true,
		url: "/pages/privacy-policy/privacy-policy",
		imgUrl: '/static/personal/collect-ico.svg'
	},
	{
		title: "服务协议",
		hasBorder: true,
		url: "/pages/service-argeement/service-argeement",
		imgUrl: '/static/personal/about-us-ico.svg'
	},
	{
		title: "退出登录",
		hasBorder: true,
		url: "",
		imgUrl: '/static/personal/about-us-ico.svg'
	}
];
// vip购买支付方式
export const payTypes = [{
		value: '1',
		imgUrl: "/static/personal/weixin-pay.svg",
		title: "微信支付"
	},
	{
		value: '2',
		imgUrl: "/static/personal/ali-pay.svg",
		title: "支付宝支付"
	}
]
// 意见反馈类型
export const feedBackTypes = [{
		key: "0",
		value: "使用问题"
	},
	{
		key: "1",
		value: "优化意见"
	},
	{
		key: "2",
		value: "其他"
	}
]
// 规范类型
export const normTypes = {
	1: "国家标准",
	2: "行业标准",
	3: "地方标准",
	4: "公安部令",
}
