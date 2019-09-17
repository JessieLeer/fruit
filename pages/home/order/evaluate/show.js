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
			url: 'http://192.168.1.103:8080/api/evaluate/show',
			data: {
				orderId: e.id
			},
			success(res) {
				console.log(res.data.data)
				res.data.data.images = res.data.data.images.split(',')
				_this.setData({
					evaluate: res.data.data
				})
			}
		})
	}
})