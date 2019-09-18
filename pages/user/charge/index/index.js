const app = getApp()
Page({
    data : {
        balance : 0,
        chargeList : [
            {'num_price' : '20','gift_num' : '10'},
            {'num_price' : '50','gift_num' : '20'},
            {'num_price' : '80','gift_num' : '30'},
            {'num_price' : '100','gift_num' : '40'},
            {'num_price' : '200','gift_num' : '50'},
            {'num_price' : '500','gift_num' : '60'}
        ],
        idx : 0
    },
    onTap(e){
        this.setData({
            idx: e.currentTarget.dataset.index
        })
    },
    gotoDetail(){
        wx.navigateTo({
            url: "../chargedetail/index"

        })
    },
    onShow(){
        this.getData()
        this.getChargeList()
    },
    getData(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/member/getUserInfo`, //仅为示例，并非真实的接口地址
            data: {
                loginUid: app.globalData.loginUid,
                userId: app.globalData.userId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                that.setData({
                    balance: res.data.data.balance,
                })
            }
        })
    },
    getChargeList(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/czgzList`, //仅为示例，并非真实的接口地址
            data: {

            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
                that.setData({
                    chargeList: res.data.data,
                })
            }
        })
    },
    chargeBtn(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/member/charge`, //仅为示例，并非真实的接口地址
            data: {
                // orderId: that.data.chargeList[that.data.idx].rid,
                loginUid: app.globalData.loginUid,
                userId: app.globalData.userId,
                czgzId: that.data.chargeList[that.data.idx].rid

            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res)
                wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.packageStr,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success(res) { 
                        that.getData()
                    },
                    fail(res) { }
                })
            }
        })
    }
})