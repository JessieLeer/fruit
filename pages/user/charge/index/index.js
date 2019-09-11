const app = getApp()
Page({
    data : {
        tel : '123323232',
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
    }
})