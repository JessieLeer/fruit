const app = getApp()

Page({
	data: {
		cuser: {},
		address: [],
		shopId: '',
	},
	onLoad(option) {
		this.setData({
			shopId: option.shopId
		})
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
	back(e) {
		let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
		prevPage.setData({
      aid: e.currentTarget.dataset.id
    })
		wx.navigateBack({
			delta: 1
		})
	},
	go(e) {
		wx.redirectTo({
			url: e.currentTarget.dataset.url
		})
	},
	index(e) {
		let _this = this
		wx.getStorage({
			key: 'loginUid',
			success (res) {
				wx.request({
					url: `${app.globalData.url}/api/member/getUserAddress`,
					data: {
						loginUid: res.data,
						userId: _this.data.cuser.userId
					},
					success(res) {
						_this.setData({
							address: res.data.data
						})
					}
				})
			}
		})
	}
})