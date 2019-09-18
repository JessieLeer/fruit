Page({
	data: {
		id: ''
	},
	onLoad(option) {
		this.setData({
			id: option.id
		})
	},
	goHome(e) {
		wx.switchTab({
			url: e.currentTarget.dataset.url
		})
	},
	go(e) {
		wx.redirectTo({
			url: e.currentTarget.dataset.url
		})
	}
})