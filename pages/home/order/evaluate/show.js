const app = getApp()

Page({
	data: {
		orderId: '',
		evaluate: {}
	},
	onLoad(option) {
		this.show({id: option.id})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/evaluate/show`,
			data: {
				orderId: e.id
			},
			success(res) {
				res.data.data.images = res.data.data.images.split(',')
				_this.setData({
					evaluate: res.data.data
				})
			}
		})
	}
})