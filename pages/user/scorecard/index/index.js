const app = getApp()
Page({
    data : {
        myscore : 0,
        couponlist : []
    },
    gotoScoreDetail(){
        wx.navigateTo({
            url: "../scoredetail/index"
        })
    },
    gotoDoc(){
        wx.navigateTo({
            url: "../../documents/Doc/index?id=integral"
        })
    },
	  go(e) {
			console.log(e)
			wx.navigateTo({
				url: e.currentTarget.dataset.url
			})
		},
    onShow(){
        this.scoreDate()
        this.getCouponlist()
    },
		scoreDate(){
			let userId = wx.getStorageSync('userId')
			var that = this
			wx.request({
				url: `${app.globalData.custom.url}/api/integral`,
				data: {
					uid: userId
				},
				success(res) {
					that.setData({
						myscore: res.data.number
					})
				}
			})
		},
    getCouponlist(){
        var that = this
        wx.request({
            url: `${app.globalData.custom.url}/api/integralshop`,
            data: {
                uid: 18679208206 
            },
            success(res) {
                that.setData({
                    couponlist: res.data.data
                })
            }
        })
    }
})