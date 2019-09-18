Page({
	data: {
		gid: ''
	},
	onLoad(option) {
		this.setData({
			gid: option.id
		})
		this.show()
	},
	show(e) {
		wx.request({
			url: 'http://192.168.1.70:8080/api/groupUser',
			data: {
				gid: this.data.gid
			},
			success(res) {
				console.log(res)
			}
		})
	}
})