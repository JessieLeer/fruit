const app = getApp()

Page({
	data: {
		id: '',
		order: {}
	},
	onLoad(option) {
		this.setData({
			id: option.id
		})
		this.show()
	},
	go(e) {
		wx.redirectTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/groupUserShare`,
			data: {
				gid: this.data.id
			},
			success(res) {
				res.data.data.need = parseInt(res.data.data.guserNumber) - res.data.data.userImgList.length
				_this.setData({
					order: res.data.data
				})
			}
		})
	},
	onShareAppMessage(e) {
    return {
      title: `【仅剩${this.data.order.need}个名额】快来${this.data.order.gprice}元拼${this.data.order.shopName}`,
			imageUrl: this.data.order.shopImg,
      path: `/pages/home/group/join/index?id=${this.data.id}`
    }
  },
})