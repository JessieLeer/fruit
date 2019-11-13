import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		cuser: {},
		address: []
	},
	onLoad(option) {
		this.initCuser()
	},
	/*-- 初始化用户 --*/
	initCuser(e) {
		let _this = this
		wx.getStorage({
			key: 'cuser',
			success (res) {
				_this.setData({
					cuser: res.data
				})
				_this.index()
			}
		})
	},
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	index(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/member/getUserAddress`,
			data: {
				loginUid: this.data.cuser.loginUid,
				userId: this.data.cuser.userId
			},
			success(res) {
				console.log(res.data.data)
				for(let item of res.data.data) {
					if(item.address.length > 15) {
						item.address = item.address.substr(0,15) + '...'
					}
				}
				_this.setData({
					address: res.data.data
				})
			}
		})
	},
	del(e) {
		let _this = this
		let id = e.currentTarget.dataset.id
		wx.request({
			url: `${app.globalData.custom.url}/api/member/deleteUserAddress`,
			data: {
				addrId: id,
				loginUid: this.data.cuser.loginUid,
				userId: this.data.cuser.userId
			},
			success(res) {
				Toast(res.data.message)
				_this.index()
				console.log(res)
			}
		})
	}
})