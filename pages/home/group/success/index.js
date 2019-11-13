const app = getApp()

Page({
	data: {
		id: '',
		gid: '',
		order: {},
		shareShow: false,
		picShow: false,
		portrait_temp: '',
		canvasHeight: 0,
		qrcode: ''
	},
	onLoad(option) {
		this.setData({
			id: option.id,
			gid: option.gid
		})
		this.show()
		this.initCode()
	},
	/*-- 生成二维码 --*/
	initCode(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/getShareQrImg`,
			data: {
				path: `/pages/home/group/success/index`,
				id: this.data.id,
				gid: this.data.gid,
				shopId: ''
			},
			success(res) {
				_this.setData({
					qrcode: res.data.data
				})
		  }
		})
	},
	go(e) {
		wx.redirectTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/groupUserShare`,
			data: {
				gid: this.data.gid
			},
			success(res) {
				res.data.data.need = parseInt(res.data.data.guserNumber) - res.data.data.userImgList.length
				_this.setData({
					order: res.data.data
				})
			}
		})
	},
	/*-- 打开分享弹窗 --*/
	showShare(e) {
		this.setData({
			shareShow: true
		})
	},
	onShareAppMessage(e) {
    return {
      title: `【仅剩${this.data.order.need}个名额】快来${this.data.order.gprice}元拼${this.data.order.shopName}`,
			imageUrl: this.data.order.shopImg,
      path: `/pages/home/group/join/index?gid=${this.data.gid}`
    }
  },
	/*
	 * 自定义的canvas输入文字方法
	 * 可以实现文字超过一定长度自动换行
	 */
	fillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
    // 设定默认最大宽度
    const systemInfo = wx.getSystemInfoSync()
    const deciveWidth = systemInfo.screenWidth
    // 默认参数
    maxWidth = maxWidth || deciveWidth
    lineHeight = lineHeight || 20
    // 校验参数
    if (
      typeof text !== 'string' ||
      typeof x !== 'number' ||
      typeof y !== 'number'
    ) {
      return
    }
    // 字符串分割为数组
    const arrText = text.split('')
    // 当前字符串及宽度
    let currentText = ''
    let currentWidth
    for (let letter of arrText) {
      currentText += letter
      currentWidth = ctx.measureText(currentText).width
      if (currentWidth > maxWidth) {
        ctx.fillText(currentText, x, y)
        currentText = ''
        y += lineHeight
      }
    }
    if (currentText) {
      ctx.fillText(currentText, x, y)
    }
  },
	
	generateImageCode(e) {
		this.setData({
			picShow: true,
			shareShow: false
		})
		let _this = this
		wx.getImageInfo({
			src: this.data.order.shopImg,
			success(res) {
				let systemInfo = wx.getSystemInfoSync()
				_this.setData({
					canvasHeight: systemInfo.screenWidth / 3 + 100
				})
				const ctx = wx.createCanvasContext('sharePic')
				ctx.drawImage(res.path, 0, 0, systemInfo.screenWidth, systemInfo.screenWidth / 3)
        ctx.fillStyle="#F6931F"
        ctx.fillRect(0,0,60,30)
				ctx.fillStyle="#fff"
        ctx.fillRect(0,systemInfo.screenWidth / 3,systemInfo.screenWidth,100)
				ctx.setFillStyle('white')
				ctx.setFontSize(14)
				ctx.fillText(`${_this.data.order.guserNumber}人团`, 10, 20)
				ctx.setFillStyle('#333')
				ctx.setFontSize(14)
				_this.fillTextWrap(ctx,`【仅剩${_this.data.order.need}个名额】快来${_this.data.order.gprice}元拼${_this.data.order.shopName}`, 10, systemInfo.screenWidth / 3 + 30, 200, 20)
				ctx.setFillStyle('#F6931F')
				ctx.setFontSize(16)
				ctx.fillText(`${_this.data.order.gprice}元`, 10, systemInfo.screenWidth / 3 + 80)
				ctx.setFillStyle('#ccc')
				ctx.setFontSize(14)
				ctx.fillText(`单买价`, 80, systemInfo.screenWidth / 3 + 80)
				ctx.fillText(`${_this.data.order.originalPrice}`, 126, systemInfo.screenWidth / 3 + 80)
				ctx.stroke()
				ctx.drawImage(_this.data.qrcode, 280, systemInfo.screenWidth / 3 + 10, 80, 80)
				ctx.draw()
			}
		})
	},
	
	/*-- 保存分享图 --*/
	saveCanvas(e) {
		let _this = this
		wx.canvasToTempFilePath({
			canvasId: 'sharePic',
			success(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res0) {
						wx.showToast({
							title: '已保存到相册'
						})
						_this.onClose1()
					}
				})
			}
		})
	},
	
	/*-- 关闭分享弹窗 --*/
	onClose(e) {
		this.setData({
			shareShow: false
		})
	},
	onClose1(e) {
		this.setData({
			picShow: false
		})
	}
})