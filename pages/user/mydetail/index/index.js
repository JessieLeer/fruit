import { moment } from '../../../../utils/cndealtime'
const app = getApp()
Page({
    data : {
        maxDate: new Date().getTime(),
        select: false,
        current : '',
        valuecurrent : ''
    },
    gotoHistory(){
        wx.navigateTo({
            url: "../history/index"

        })
    },
    chooseDate(){
        this.setData({
            select : true
        })
    },
    close(){
        this.setData({
            select: false
        })
    },
    confirm(e) {
        this.setData({
            select: false,
            current: moment(e.detail).format("YYYY-MM-DD"),
            valuecurrent: e.detail
        })
    }
})