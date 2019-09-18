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
    }
})