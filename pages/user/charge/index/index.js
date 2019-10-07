const app = getApp()
let isSubmitAble = true
Page({
    data : {
        balance : 0,
        chargeList : [
       
        ],
        idx : 0,
        orderId : '',
        price : 0,
        key : false
    },
    onTap(e){
        this.setData({
            idx: e.currentTarget.dataset.index,
            key : false
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
        let loginUid = wx.getStorageSync('loginUid')
        let userId = wx.getStorageSync('userId')
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/member/getUserInfo`, //仅为示例，并非真实的接口地址
            data: {
                loginUid,
                userId
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
        if(this.data.key){
            this.isSetSecret('SETPRICE')
        }else{
            this.isSetSecret()
        }
    },
    gotoDoc(){
        wx.navigateTo({
            url: "../../documents/Doc/index?id=charge"
        })
    },
    pay(set){
        if (set == "SETPRICE"){
            console.log(31321321312)
        }else{
            console.log('guding')
            let loginUid = wx.getStorageSync('loginUid')
            let userId = wx.getStorageSync('userId')
            let openid = wx.getStorageSync('openid')
            var that = this
            if (isSubmitAble) {
                isSubmitAble = false
                wx.request({
                    url: `${app.globalData.url}/api/member/charge`, //仅为示例，并非真实的接口地址
                    data: {
                        // orderId: that.data.chargeList[that.data.idx].rid,
                        loginUid,
                        userId,
                        czgzId: that.data.chargeList[that.data.idx].rid,
                        openId: openid

                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        if (res.data.code == 500) {
                            isSubmitAble = true
                            console.log(res)
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none'
                            })
                            return
                        }
                        that.setData({
                            orderId: res.data.data.orderId
                        })
                        wx.requestPayment({
                            timeStamp: res.data.data.timeStamp,
                            nonceStr: res.data.data.nonceStr,
                            package: res.data.data.packageStr,
                            signType: res.data.data.signType,
                            paySign: res.data.data.paySign,
                            success(res) {
                                console.log(res)
                                wx.request({
                                    url: `${app.globalData.url}/api/member/chargeCallback`, //仅为示例，并非真实的接口地址
                                    data: {
                                        loginUid: loginUid,
                                        userId: userId,
                                        czgzId: that.data.chargeList[that.data.idx].rid,
                                        orderId: that.data.orderId
                                    },
                                    header: {
                                        'content-type': 'application/json' // 默认值
                                    },
                                    success(res) {
                                        isSubmitAble = true
                                        if (res.data.code == 200) {
                                            wx.showToast({
                                                title: res.data.message,
                                                icon: 'success'
                                            })
                                            that.getData()
                                        } else {
                                            wx.showToast({
                                                title: res.data.message,
                                                icon: 'none'
                                            })
                                            that.getData()
                                        }

                                    }
                                })
                                that.getData()
                            },
                            fail(res) {
                                isSubmitAble = true
                            }
                        })
                    }
                })
            }
        }

},
    isSetSecret(set) {
        let loginUid = wx.getStorageSync('loginUid')
        let userId = wx.getStorageSync('userId')
        var that = this;
        wx.request({
            url: `${app.globalData.url}/api/member/isSetPassword`, //仅为示例，并非真实的接口地址
            data: {
                loginUid,
                userId,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                if (res.data.data){
                    that.pay(set)
                }else{
                    wx.navigateTo({
                        url: '../../../user/setting/paysetting/phone-set?idx=charge'
                    })
                }
            }
        })
    },
    change(e){
        this.setData({
            idx : -1,
            price : e.detail.value,
            key: true
        })
    },
    getValue(e){
        this.setData({
            idx: -1,
            price: e.currentTarget.dataset.value,
            key : true
        })
    }
})