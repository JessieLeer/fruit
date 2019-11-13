import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

const app = getApp()

Page({
	data: {
		cuser: {},
		shopId: '',
		goodId: '',
		good: {},
		shopcarGoods: [],
		totalPrice: 0,
		shareShow: false,
		portrait_temp: '',
		canvasHeight: 0,
		qrcode: ''
	},
	onLoad(option) {
		this.setData({
			shopId: option.shopId,
			goodId: option.id
		})
		this.initCuser()
		this.initShopcar()
		this.show()
		this.initCode()
	},
	onShow() {
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
			}
		})
	},
	/*-- 获取商品详情 --*/
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/commodity/detail`,
			data: {
				storeId: this.data.shopId,
				commodityId: this.data.goodId
			},
			success(res) {
				console.log(res.data.data)
				if(_this.data.cuser.userId) {
					let incar = _this.data.shopcarGoods.filter((item) => {
						return item.id == res.data.data.id
					})
					if(incar.length > 0){
						res.data.data.count = incar[0].count
					}else{
						res.data.data.count = 0
					}
				}else{
					res.data.data.count = 0
				}
				res.data.data.shopId = _this.data.shopId
				if(res.data.data.details.indexOf('style=') == -1) {
					res.data.data.details = res.data.data.details.replace(/>/gi, 'style="max-width:100%;height:auto;display:block;">')
				}else{
					res.data.data.details = res.data.data.details.replace(/style="/gi, 'style="max-width:100%;height:auto;display:block;')
				}
				_this.setData({
					good: res.data.data
				})
			}
		})
	},
	
	/*-- 初始化购物车数据 --*/
	initShopcar(e) {
		let _this = this
		wx.getStorage({
			key: 'shopcar',
			success(res) {
				_this.setData({
					shopcarGoods: res.data
				})
				_this.calTotal()
			}
		})
	},
	/*-- 加入购物车 --*/
	addShopcar(e) {
		if(this.data.cuser.userId) {
			this.data.good.count = 1
			this.setData({
				good: this.data.good
			})
			this.data.shopcarGoods.push(this.data.good)
			this.handleShopcar()
		}else{
			wx.navigateTo({
				url: '/pages/user/login/step0'
			})
		}
	},
	
	handleShopcar(e) {
		wx.setStorage({
			key: 'shopcar',
			data: this.data.shopcarGoods
		})
		let _this = this
		wx.getStorage({
			key: 'shopcar',
			success(res) {
				_this.setData({
					shopcarGoods: res.data
				})
			}
		})
		this.calTotal()
	},
	
	onCartChange(e) {
		let count = e.detail.count == undefined ? e.detail : e.detail.count
		let id = e.currentTarget.dataset['good'] ? e.currentTarget.dataset['good'].id : e.detail.id
		if(count == 0) {
			let i = this.data.shopcarGoods.indexOf(this.data.shopcarGoods.filter((item) => {
				return item.id == id
			})[0])
			this.data.shopcarGoods.splice(i,1)
		}else{
			this.data.shopcarGoods.filter((item) => {
				return item.id == id
			})[0].count = count
		}
		this.data.good.count = count
		this.setData({
			good: this.data.good
		})
		this.handleShopcar()
	},
	
	formatFloat(e) {
		let m = Math.pow(10, e.digit)
		return parseFloat(e.f * m, 10) / m
	},
	
	/*-- 计算购物车总价 --*/
	calTotal(e) {
		let total = 0
		for(let item of this.data.shopcarGoods){
			total = this.formatFloat({f:item.count * item.sellingPrice + total, digit: 2})
		}
		this.setData({
			totalPrice: total.toFixed(2)
		})
	},
	
	/*-- 清空购物车 --*/
	onCartClear() {
		this.data.good.count = 0
		this.setData({
			good: this.data.good
		})
	  this.data.shopcarGoods = []
		this.handleShopcar()
	},
	
	/*-- 生成二维码 --*/
	initCode(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/getShareQrImg`,
			data: {
				path: `/pages/home/good/index`,
		  	id: this.data.goodId,
				gid: '',
				shopId: this.data.shopId
			},
			success(res) {
				_this.setData({
					qrcode: res.data.data
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
			src: this.data.good.headImage,
			success(res) {
				let systemInfo = wx.getSystemInfoSync()
				_this.setData({
					canvasHeight: systemInfo.screenWidth + 100
				})
				const ctx = wx.createCanvasContext('sharePic')
				ctx.drawImage(res.path, 0, 0, systemInfo.screenWidth, systemInfo.screenWidth)
				ctx.fillStyle="#fff"
        ctx.fillRect(0,systemInfo.screenWidth,systemInfo.screenWidth,100)
				ctx.setFillStyle('#333')
				ctx.setFontSize(14)
				_this.fillTextWrap(ctx,_this.data.good.name, 10, systemInfo.screenWidth + 30, 200, 20)
				ctx.setFillStyle('#F6931F')
				ctx.setFontSize(16)
				ctx.fillText(`${_this.data.good.sellingPrice}元`, 10, systemInfo.screenWidth + 80)
				ctx.setFillStyle('#ccc')
				ctx.setFontSize(14)
				ctx.fillText("单买价", 80, systemInfo.screenWidth + 80)
				ctx.fillText(`${_this.data.good.originalPrice}`, 126, systemInfo.screenWidth + 80)
				ctx.stroke()
				ctx.drawImage(_this.data.qrcode, 280, systemInfo.screenWidth + 10, 80, 80)
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