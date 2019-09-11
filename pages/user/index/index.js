const app = getApp()
Page({
    data : {
        mobile : '',
        popupkey : false,
        point : 0,
        coupon : 0,
        balance : 0,
        username : '',
        card : 0
    },
    onTap(){
        wx.navigateTo({
            url: "../charge/index/index"

        })
    },
    gotoScorePage(){
        wx.navigateTo({
            url: "../scorecard/index/index"

        })
    },
    gotoCoupon(){
        wx.navigateTo({
            url: "../coupon/index/index"

        })
    },
    gotoShopCard(){
        wx.navigateTo({
            url: "../shopcard/index/index"

        })
    },
    gotoMy(){
        wx.navigateTo({
            url: "../mydetail/index/index"

        })
    },
    gotoSecCard(){
        wx.navigateTo({
            url: "../seccard/index/index"

        })
    },
    gotoPayCode(){
        wx.navigateTo({
            url: "../payCode/payCode"

        })
    },
    gotoLocationMan(){
        wx.navigateTo({
            url: "../addressManage/addressManage"

        })
    },
    gotoSetting(){
        wx.navigateTo({
            url: "../setting/setting"

        })
    },
    gotoCus(){
        wx.navigateTo({
            url: "../customerService/customerService"

        })
    },
    onShow(){
        this.getUserData()
    },
    showCode(){
        if(this.data.popupkey){
            wx.showTabBar({})
            this.setData({
                popupkey: false
            })
        }else{
            wx.hideTabBar({})
            this.setData({
                popupkey: true
            })
        }
    },
    getUserData(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/member/getUserInfo`, //仅为示例，并非真实的接口地址
            data: {
                loginUid: '76fddb5b-bd3f-4d1a-ae6f-d238fdef0b04',
                userId: 18679208206
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.data)
                that.setData({
                    point: res.data.data.point,
                    mobile: res.data.data.mobile,
                    coupon: res.data.data.coupon,
                    card: res.data.data.card,
                    balance: res.data.data.balance,
                    username: res.data.data.username
                })
            }
        })
    }
})
