import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		gid: '',
		order: {},
		cuser: {}
	},
	onLoad(option) {
		this.setData({
			gid: option.id
		})
		this.initCuser()
		this.show()
	},
	/*-- 初始化用户 --*/
	initCuser(e) {
		let _this = this
		wx.getStorage({
			key: 'cuser',
			success (res) {
				_this.setData({
					cuser: res.data
				})
			},
			fail() {
				wx.navigateTo({
					url: 'pages/user/login/step0'
				})
			}
		})
	},
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.url}/api/groupUser`,
			data: {
				gid: this.data.gid
			},
			success(res) {
			  if(res.data.code == 200) {
					res.data.data.voCommodityDetail.details = res.data.data.voCommodityDetail.details.replace(/style=""/gi, '')
					res.data.data.voCommodityDetail.details = res.data.data.voCommodityDetail.details.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
					res.data.data.gendTime = res.data.data.gendTime.replace(/-/g, '/')
					let leftCount = Math.ceil((new Date(res.data.data.gendTime) - new Date()) / 86400000)
					if(leftCount > 0) {
						res.data.data.leftCount = leftCount
					}else{
						res.data.data.left = _this.calTime({start: new Date().getTime(), end: new Date(_this.addDate(_this.data.order.gendTime,1)).getTime()})
					}
					_this.setData({
						order: res.data.data
					})
					app.globalData.groupbuy = _this.data.order
					if(leftCount == 0) {
						setInterval(() => {
							_this.setData({
								'order.left': _this.calTime({start: new Date().getTime(), end: new Date(_this.addDate(_this.data.order.gendTime,1)).getTime()})
							})
						}, 1000)
					}
				}else{
					Toast({
						message: res.data.message
					})
					setTimeout(() => {
						wx.navigateBack()
					},2000)
				}
			}
		})
	},
	addDate(date,days){ 
    let d = new Date(date) 
    d.setDate(d.getDate()+days) 
    let m = d.getMonth() + 1 
    return d.getFullYear()+'/'+m+'/' + d.getDate() 
  }, 
	calTime(e) {
		//时间差的毫秒数      
		let leftDay = e.end - e.start
		let leave1 = leftDay%(24*3600*1000)    
		let hours = Math.floor(leave1/(3600*1000))
		let leave2 = leave1%(3600*1000)        
		let minutes = Math.floor(leave2/(60*1000))
		let leave3 = leave2%(60*1000)      
		let seconds = Math.round(leave3/1000)
		return {
			hour: hours,
			minute: minutes,
			second: seconds
		}			
	},
	/*-- 打开分享弹窗 --*/
	showShare(e) {
		this.setData({
			shareShow: true
		})
	},
	/*-- 生成分享图片 --*/
	generateImageCode(e) {
		let _this = this
		wx.downloadFile({
      url: this.data.good.headImage,
      success(res) {
        //缓存头像图片
        _this.setData({
          portrait_temp: res.tempFilePath
        })
        //缓存canvas绘制小程序二维码
        wx.downloadFile({
          url: _this.data.good.headImage,
          success(res0) {
            //缓存二维码
            _this.setData({
              qrcode_temp: res0.tempFilePath
            })
            _this.drawImage()
            wx.hideLoading()
            setTimeout(function () {
              _this.canvasToImage()
            }, 1000)
          }
        })
      }
    })
	},
	drawImage() {
    //绘制canvas图片
    let _this = this
    const ctx = wx.createCanvasContext('myCanvas')
    let bgPath = _this.data.good.headImage
    let portraitPath = _this.data.portrait_temp
    let hostNickname = '缘疆佳园'
    let qrPath = _this.data.qrcode_temp
    let windowWidth = _this.data.windowWidth
    _this.setData({
      scale: 1.6
    })
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, _this.data.scale * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    ctx.draw()
  },
	canvasToImage() {
    let _this = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: _this.data.windowWidth,
      height: _this.data.windowWidth * _this.data.scale,
      destWidth: _this.data.windowWidth * 4,
      destHeight: _this.data.windowWidth * 4 * _this.data.scale,
      canvasId: 'myCanvas',
      success(res) {
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
	/*-- 关闭分享弹窗 --*/
	onClose(e) {
		this.setData({
			shareShow: false
		})
	}
})