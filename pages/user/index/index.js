var barcode = require('../../../utils/index')
const app = getApp()

Page({
    data : {
        mobile : '',
        popupkey : false,
        point : 0,
        coupon : 0,
        balance : 0,
        Nickname : '',
        card : 0,
        loginKey : false,
        avatarurl : '',
        onceCard : 0,
        level : 0,
        userId : ''
    },
    gotoDocMe(){
        wx.navigateTo({
            url: "../documents/Doc/index?id=memberlevel"

        })
    },
    onTap(){
        if(this.checkLogin())return;
        wx.navigateTo({
            url: "../charge/index/index"

        })
    },
    gotoScorePage(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../scorecard/index/index"

        })
    },
    gotoCoupon(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../coupon/index/index"

        })
    },
    gotoShopCard(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../shopcard/index/index"

        })
    },
    gotoMy(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../mydetail/index/index"

        })
    },
    gotoSecCard(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../seccard/index/index"

        })
    },
    gotoPayCode(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../payCode/payCode"

        })
    },
    gotoLocationMan(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../addressManage/addressManage"

        })
    },
    gotoSetting(){
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: "../setting/setting"

        })
    },
    gotoCus(){
        wx.navigateTo({
            url: "../customerService/customerService?id=customer"

        })
    },
    checkLogin(){
        if (!app.globalData.loginUid) {
            wx.navigateTo({
                url: "../../user/login/step0"
            })
            return true
        }
    },
    onShow(){
        this.getUserData()
       
    },
    showCode(){
        if(this.data.popupkey){
            this.setData({
                popupkey: false
            })
        }else{
            this.setData({
                popupkey: true
            })
        }
    },
    getUserData(){
        if (!app.globalData.loginUid){
            this.setData({
                point: '- -',
                coupon: '- -',
                card: '*',
                balance: '- -',
                loginKey : false,
                onceCard : '*'
            })
        }else{
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
                    console.log(res)
                    app.globalData.mobile = res.data.data.mobile;
                    that.setData({
                        point: res.data.data.point,
                        userId: res.data.data.userId,
                        mobile: res.data.data.mobile,
                        coupon: res.data.data.coupon,
                        card: res.data.data.card,
                        balance: res.data.data.balance,
                        onceCard: res.data.data.onceCard,
                        username: res.data.data.username,
                        avatarurl: app.globalData.avatarUrl,
                        Nickname: app.globalData.Nickname,
                        level : res.data.data.levelName,
                        loginKey: true
                    })
                    barcode.barcode('firstCanvas', JSON.stringify(res.data.data.userId) , 285 * 2, 108 * 2)
                }
            })
        }
    },
    login(){
        wx.navigateTo({
            url: "../../user/login/step0"
        })
    }
})
