const app = getApp()
Page({
    data : {
        minHeight : 0,
        dataList : []
    },
    gotoHistory(){
        wx.navigateTo({
            url: "../history/index"

        })
    },
    getMinHeight() {
        let h;
        let minHeight;
        wx.getSystemInfo({
            success: function (res) {
                h = res.windowHeight

            }
        })
        minHeight = h - 108;
        this.setData({
            minHeight: minHeight
        })
    },
    onShow(){
        this.getMinHeight()
        this.getShopCard()
    },
    getShopCard(){
        var that = this;
        let loginUid = wx.getStorageSync('loginUid')
        let userId = wx.getStorageSync('userId')
        wx.request({
            url: `${app.globalData.custom.url}/api/member/shopCardMx`, //仅为示例，并非真实的接口地址
            data: {
                loginUid: loginUid,
                userId: userId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
                that.setData({
                    dataList: res.data.data.validList
                })
            }
        })
    },
    gotoDoc(){
        wx.navigateTo({
            url: "../../documents/Doc/index?id=shopCard"
        })
    }
})