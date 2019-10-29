Page({
	data: {
		id: '',
		gid: ''
	},
	onLoad(option) {
		this.setData({
			id: option.id,
			gid: option.gid
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