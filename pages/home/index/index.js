import Toast from "../../../miniprogram_npm/vant-weapp/toast/toast"

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
		banners: [],
		goods: [],
		page: 1,
		isLoadAll: false,
		shopcarGoods: [],
		localShopcarGoods: [],
		totalPrice: 0,
		caller: 0
	},

  onLoad(option) {
		this.bannerIndex()
		wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      this.setData({
			  position: app.globalData.position,
				shop: app.globalData.shop,
				cates: [],
				goods: []
		  })
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
				shop: app.globalData.shop,
				cates: [],
				goods: []
			})
			this.shopShow()
			this.initCuser()
		},1000)
	},
	
	/*-- 初始化购物车数据 --*/
	initShopcar(e) {
		let _this = this
		wx.getStorage({
			key: 'shopcar',
			success(res) {
				_this.setData({
					localShopcarGoods: res.data,
				})
				_this.setShopcar()
				_this.calTotal()
			}
		})
	},
	setShopcar(e) {
		this.setData({
			shopcarGoods: this.data.localShopcarGoods.filter((item) => {
				return item.shopId == this.data.shop.id
			})
		})
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
	
	/*-- 获取banner轮播图 --*/
	bannerIndex(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/banner/list',
			data: {},
			success(res) {
				_this.setData({
					banners: res.data.data
				})
			}
		})
	},
	bannerGo(e) {
		let url
		if(e.currentTarget.dataset.banner.type == '1') {
			url = `/pages/home/good/index?shopId=${this.data.shop.id}&id=${e.currentTarget.dataset.banner.value}`
		}
		wx.navigateTo({
			url: url
		})
	},
	
	/*-- 页面跳转 --*/
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	
	/*-- 获取最近店铺 --*/
	shopShow(e) {
		if(this.data.shop.id) {
			this.cateIndex()
			this.initShopcar()
		}else{
			let _this = this
			wx.request({
				url: 'http://192.168.1.103:8080/api/curr/store',
				data: {
					latitude: _this.data.position.location.lat,
					longitude: _this.data.position.location.lng,
				},
				success(res) {
					if(res.data.message == '附近没有门店'){
						_this.setData({
							caller: res.data.data
						})
					}else{
						_this.setData({
							shop: res.data.data
						})
						_this.cateIndex()
						_this.initShopcar()
					}
				}
			})
		}
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
				if(res.data.data.length > 0) {
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
				storeId: this.data.shop.id,
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
						item.shopId = _this.data.shop.id
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
			let good = this.data.goods.filter((item) => {
				return item.id == id
			})[0]
	    good.count = 1
			this.setData({
				goods: this.data.goods
			})
			this.data.localShopcarGoods.push(good)
			this.handleShopcar()
		}else{
			wx.navigateTo({
				url: '/pages/user/login/step0'
			})
		}
	},
	
	handleShopcar(e) {
		this.setData({
			localShopcarGoods: this.data.localShopcarGoods
		})
		this.setShopcar()
		wx.setStorage({
			key: 'shopcar',
			data: this.data.localShopcarGoods,
			success(res) {
			}
		})
		this.calTotal()
	},
	
	onCartChange(e) {
		let count = e.detail.count == undefined ? e.detail : e.detail.count
		let id = e.currentTarget.dataset['good'] ? e.currentTarget.dataset['good'].id : e.detail.id
		if(count == 0) {
			let i = this.data.localShopcarGoods.indexOf(this.data.shopcarGoods.filter((item) => {
				return item.id == id
			})[0])
			this.data.localShopcarGoods.splice(i,1)
		}else{
			this.data.localShopcarGoods.filter((item) => {
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
		this.data.localShopcarGoods = this.data.localShopcarGoods.filter((item) => {
			return item.shopId != this.data.shop.id
		})
		this.handleShopcar()
	},
	
	/*-- 召唤开店 --*/
	calling(e) {
		wx.request({
			url: 'http://192.168.1.103:8080/api/call/store',
			method: 'post',
			data: {
				latitude: this.data.position.location.lat,
				longitude: this.data.position.location.lng,
				userId: this.data.cuser.userId
			},
			success(res) {
				Toast(res.data.message)
			}
		})
	}
})
