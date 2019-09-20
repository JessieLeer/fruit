var WxParse = require('../../../../wxParse/wxParse');
var app = getApp()

Page({
    data : {
        html : ''
    },
    onLoad(options){
        switch (options.id) {
            case 'aboutus':
                wx.setNavigationBarTitle({
                    title: '关于我们'
                })
               break;
            case 'countCard':
                wx.setNavigationBarTitle({
                    title: '次卡说明'
                })
               break;
            case 'shopCard':
                wx.setNavigationBarTitle({
                    title: '购物卡说明'
                })
               break;
            case 'discount':
                wx.setNavigationBarTitle({
                    title: '优惠券说明'
                })
               break;
            case 'charge':
                wx.setNavigationBarTitle({
                    title: '充值说明'
                })
               break;
            case 'integral':
                wx.setNavigationBarTitle({
                    title: '积分说明'
                })
               break;
            case 'memberlevel':
                wx.setNavigationBarTitle({
                    title: '会员等级说明'
                })
               break;
       
           default:
               break;
       }
        console.log(options.id)
        this.getContent(options.id)
    },
    getContent(id){
        var that = this;
        //3. 解密
        wx.request({

            url: `${app.globalData.url}/api/mini/getContentById`,
            data: {
                contentId: id
            },
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log(res)
                WxParse.wxParse('article', 'html', res.data.data.contentText, that, 5);
            }
        }) 
    }
})