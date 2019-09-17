Page({
	data: {
	
  },
	onLoad(option) {
		
	},
	go(e) {
		wx.switchTab({
			url: e.currentTarget.dataset.url
		})
	}
})