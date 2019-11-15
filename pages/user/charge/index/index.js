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
            key: false
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
            url: `${app.globalData.custom.url}/api/member/getUserInfo`, 
            data: {
                loginUid,
                userId
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
            url: `${app.globalData.custom.url}/api/czgzList`,
            data: {},
            success(res) {
							console.log(res.data)
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
			let type
      if (set == "SETPRICE"){
        type = 1
      }else{
				type = 0
      }
            let loginUid = wx.getStorageSync('loginUid')
            let userId = wx.getStorageSync('userId')
            let openid = wx.getStorageSync('openid')
            var that = this
            if (isSubmitAble) {
                isSubmitAble = false
                wx.request({
                    url: `${app.globalData.custom.url}/api/member/charge`,
                    data: {
                        loginUid,
                        userId,
                        czgzId: type == 0 ? that.data.chargeList[that.data.idx].rid : '',
											  money: type == 1 ? that.data.price : '',
                        openId: openid,
										  	type
                    },
                    success(res) {
                        if (res.data.code == 500) {
                            isSubmitAble = true
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
                                wx.request({
                                    url: `${app.globalData.custom.url}/api/member/chargeCallback`,
                                    data: {
                                        loginUid: loginUid,
                                        userId: userId,
                                        czgzId: type == 0 ? that.data.chargeList[that.data.idx].rid : '',
											  money: type == 1 ? that.data.price : '',
                                        orderId: that.data.orderId,
																			  type,
																			flmc: type == 0 ? that.data.chargeList[that.data.idx].flmc : ''
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
    },
    isSetSecret(set) {
        let loginUid = wx.getStorageSync('loginUid')
        let userId = wx.getStorageSync('userId')
        var that = this
        wx.request({
            url: `${app.globalData.custom.url}/api/member/isSetPassword`, 
            data: {
                loginUid,
                userId,
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