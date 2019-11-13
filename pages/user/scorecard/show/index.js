const app = getApp()

Page({
	data: {
		iid: '',
		good: {}
	},
	onLoad(option) {
		this.setData({
			iid: option.iid
		})
		this.show()
	},
	
	onShow() {
		
	},
	
	show(e) {
		wx.request({
			url: `${app.globalData.custom.url}/api/integralshopMx`,
			data: {
				iid: this.data.iid
			},
			success: res => {
				this.setData({
					good: res.data.data
				})
			}
		})
	},
	
  convert(e){
    let userId = wx.getStorageSync('userId')
    var that = this
    wx.request({
      url: `${app.globalData.custom.url}/api/insetCoupon`,
      data: {
        iid: this.data.iid,
        uid: userId
      },
      success(res) {
        wx.showToast({
          title: res.data.tips,
          icon: res.data.return == "false" ? 'none' : 'success',
          duration: 2000
        })
				setTimeout(() => {
					wx.navigateBack({
						delta: 1
					})
				},2000)
      }
		})
  }
})