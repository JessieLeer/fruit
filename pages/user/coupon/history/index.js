import { timestampToString, moment } from '../../../../utils/cndealtime'

const app = getApp()
Page({
  data: {
    showkey : -1,
    selectedFlag : [],
    dataList : [],
	  minHeight : 0
  },
	onShow (){  
		this.index()
		this.getMinHeight()
  },
	index(e) {
		let userId = wx.getStorageSync('userId')
    let _this = this
    wx.request({
      url: `${app.globalData.custom.url}/api/coupon`, 
      data: {
        uid: userId,
			  cuse: 0
      },
      success(res) {
        res.data.data.forEach(element => {
          if (element.ctimeType == 1) {
            element.cstartTime = element.ctime
            element.cendTime = moment(element.cstartTime).add(element.timelimit, 'd').format('YYYY-MM-DD')
          }
        })
        _this.setData({
          dataList: res.data.data
        })
      }
    })
	},
  clickMore(e){
    let index = e.currentTarget.dataset.index
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false
    } else {
      this.data.selectedFlag[index] = true
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })    
  },
	getMinHeight(){
    let h,minHeight
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