import { timestampToString, moment } from '../../../../utils/cndealtime'

const app = getApp()
Page({
    data : {
        showkey : -1,
        selectedFlag : [],
        dataList : [],
        minHeight : 0
    },
    clickMore(e){
        var index = e.currentTarget.dataset.index;
        if (this.data.selectedFlag[index]) {
            this.data.selectedFlag[index] = false;
        } else {
            this.data.selectedFlag[index] = true;
        }
        this.setData({
            selectedFlag: this.data.selectedFlag
        })
        
    },
    onShow (){
        this.getCouponList()
        this.data.dataList.map((item,index)=>{
            this.data.selectedFlag[index] = false;
        })
        this.getMinHeight()
    },
    getMinHeight(){
        let h ;
        let minHeight ;
        wx.getSystemInfo({
            success: function (res) {
                h = res.windowHeight
               
            }
        })
        minHeight = h - 152 - 41;
        this.setData({
            minHeight: minHeight
        })
    },
    gotoDoc(){
        wx.navigateTo({
            url: "../../documents/Doc/index?id=discount"
        })
    },
    gotoHistory() {
        wx.navigateTo({
            url: "../history/index"
        })
    },
    getCouponList(){
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/coupon`, //仅为示例，并非真实的接口地址
            data: {
                uid: app.globalData.userId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                res.data.data.forEach(element => {
                    if (element.ctimeType == 1) {
                        element.cstartTime = element.ctime;
                        element.cendTime = moment(element.cstartTime).add(element.timelimit, 'd').format('YYYY-MM-DD');
                    }
                })
                that.setData({
                    dataList: res.data.data
                })
                console.log(res.data.data)
            }
        })
    },
    convertCoupon(){
        if (!this.data.value){
            wx.showToast({
                title: '请输入兑换码',
                icon: 'none',
                duration: 2000
            })
            return
        }
        var that = this
        wx.request({
            url: `${app.globalData.url}/api/getCoupon`, //仅为示例，并非真实的接口地址
            data: {
                uid: app.globalData.userId,
                rid  : that.data.value
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                wx.showToast({
                    title: res.data.tip,
                    icon: 'none',
                    duration: 2000
                })
                that.getCouponList()
            }
        })
    },
    getValue(e){
        console.log(e)
        this.setData({
            value : e.detail
        })
    }
})