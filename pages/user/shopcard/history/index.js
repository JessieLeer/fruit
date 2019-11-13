const app = getApp()
Page({
    data : {
      dataList: [],
			minHeight: 0
    },
	  onShow() {
			this.getMinHeight()
		},
	  getMinHeight(){
        let h 
        let minHeight
        wx.getSystemInfo({
            success(res) {
                h = res.windowHeight
               
            }
        })
        minHeight = h - 152 - 41
        this.setData({
            minHeight: minHeight
        })
    }
})