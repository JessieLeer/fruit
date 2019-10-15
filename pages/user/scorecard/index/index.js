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
    onShow(){
        this.scoreDate()
        this.getCouponlist()
    },
    getCouponlist(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/integralshop`,
            data: {
                uid: 18679208206 
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                that.setData({
                    couponlist: res.data.data
                })
            }
        })
    },
    scoreDate(){
        let userId = wx.getStorageSync('userId')
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/integral`, //仅为示例，并非真实的接口地址
            data: {
                uid: userId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                that.setData({
                    myscore: res.data.number
                })
            }
        })
    },
    convert(e){
        console.log(e.currentTarget.dataset.iid)
        let userId = wx.getStorageSync('userId')
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/insetCoupon`, //仅为示例，并非真实的接口地址
            data: {
                iid: e.currentTarget.dataset.iid,
                uid: userId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                wx.showToast({
                    title: res.data.tips,
                    icon: res.data.return == "false" ? 'none' : 'success',
                    duration: 2000
                })
                that.scoreDate()
            }
        })
    }
})