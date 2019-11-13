Page({
	data: {
		cuser: {},
		goods: '',
		quota: 0,
		coupons: [],
		activeNames: ['1']
	},
	onLoad(option) {
		this.initCuser()
		this.setData({
			goods: option.goods,
			quota: option.quota
		})
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
				_this.index({goods: _this.data.goods, quote: _this.data.quota})
			}
		})
	},
	index(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/useList`,
			data: {
				commodityId: e.goods,
				quota: e.quota,
				uid: this.data.cuser.userId
			},
			success(res) {
				_this.setData({
					coupons: res.data.data
				})
			}
		})
	},
	onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  }
})