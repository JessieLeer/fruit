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
		portrait_temp: ''
	},
	onLoad(option) {
		this.setData({
			shopId: option.shopId,
			goodId: option.id
		})
		this.initCuser()
		this.initShopcar()
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
			}
		})
	},
	/*-- 获取商品详情 --*/
	show(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/commodity/detail',
			data: {
				storeId: this.data.shopId,
				commodityId: this.data.goodId
			},
			success(res) {
				let incar = _this.data.shopcarGoods.filter((item) => {
					return item.id == res.data.data.id
				})
				if(incar.length > 0){
					res.data.data.count = incar[0].count
				}else{
					res.data.data.count = 0
				}
				res.data.data.shopId = _this.data.shopId
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
	
	/*-- 计算购物车总价 --*/
	calTotal(e) {
		let total = 0
		for(let item of this.data.shopcarGoods){
			total += item.count * item.sellingPrice
		}
		this.setData({
			totalPrice: total
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
    let hostNickname = app.globalData.userInfo.nickName
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
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
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