//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
    userInfo: {},
		cuser: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
		position: null,
		shop: {},
		cates: [],
		active: 1,
		imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
		goods: [
			
		],
		page: 1,
		isLoadAll: false,
		shopcarGoods: [],
		totalPrice: 0
	},

  onLoad() {
		wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      this.setData({
			  position: app.globalData.position,
		  })
			this.shopShow()
			this.initCuser()
      wx.hideLoading()
    }, 1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
	
	onShow() {
		setTimeout(() => {
			this.setData({
				position: app.globalData.position,
			})
			this.initCuser()
		},1000)
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
	
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.target.id
		})
	},
	
	/*-- 获取最近店铺 --*/
	shopShow(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/curr/store',
			data: {
				latitude: _this.data.position.location.lat,
				longitude: _this.data.position.location.lng,
			},
			success(res) {
				_this.setData({
					shop: res.data.data
				})
				_this.cateIndex()
			}
		})
	},
	
	/*--获取分类列表--*/
	cateIndex(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/category/list',
			data: {
				storeId: _this.data.shop.id
			},
			success (res) {
				_this.setData({
					cates: res.data.data.sort((a,b) => {
						return a.rank - b.rank
					})
				})
				_this.setData({
					active: _this.data.cates.filter((item) => {
						return item.onShow == true
					})[0].id
				})
				_this.index()
			}
		})
	},
	
	/*-- 切换分类 --*/
	cateChange(e) {
		this.setData({
			active: e.target.id,
			goods: []
		})
		this.index()
	},
	
	/*-- 获取商品列表 --*/
	index(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/commodity/category',
			data: {
				categoryId: this.data.active,
				pageNum: this.data.page,
				pageSize: 10
			},
			success(res) {
				if(res.data.data.length == 0) {
					_this.setData({
						isLoadAll: true
					})
				}else{
					for(let item of res.data.data) {
						let incart = _this.data.shopcarGoods.filter((itemer) => {
							return itemer.id == item.id
						})[0]
						if(incart) {
							item.count = incart.count
						}else{
							item.count = 0
						}
					}
					_this.setData({
						goods: _this.data.goods.concat(res.data.data)
					})
				}
			}
		})
	},
	
	/*-- 上拉刷新 --*/
	refresh(e) {
		this.setData({
			goods: [],
			page: 1
		})
		this.index()
	},
	
	/*-- 下拉加载更多商品 --*/
	loadMore(e) {
		if(this.data.isLoadAll) {
		}else{
			this.setData({
				page: this.data.page + 1
			})
			this.index()
		}
	},
	
	/*-- 加入购物车 --*/
	addShopcar(e) {
		if(this.data.cuser.userId) {
			let id = e.currentTarget.dataset['good'].id
			this.data.goods.filter((item) => {
				return item.id == id
			})[0].count = 1
			this.setData({
				goods: this.data.goods
			})
			this.data.shopcarGoods.push(this.data.goods.filter((item) => {
				return item.id == id
			})[0])
			this.handleShopcar()
		}else{
			wx.navigateTo({
				url: '/pages/login/step0'
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
		this.data.goods.filter((item) => {
			return item.id == id
		})[0].count = count
		this.setData({
			goods: this.data.goods
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
		for(let item of this.data.goods) {
			item.count = 0
		}
		this.setData({
			goods: this.data.goods
		})
	  this.data.shopcarGoods = []
		this.handleShopcar()
	}
})
