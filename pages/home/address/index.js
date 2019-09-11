let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'N4TBZ-BDWCU-ZQPVN-2XVXR-DNJYH-35B7S'
})

//获取应用实例
const app = getApp()

Page({
	data: {
		position: {},
		suggestion: '',
		searchValue: '',
		shops: []
	},
	onLoad() {
		this.setData({
			position: app.globalData.position,
		})
		this.index()
	},
	
	rePosition(e) {
		app.globalData.shop = {}
		let url = e.currentTarget.dataset.url
		/*-- 根据坐标点获取地理位置信息 --*/
		qqmapsdk.reverseGeocoder({
			//获取表单传入的位置坐标,不填默认当前位置,示例为string格式
			location: '', 
			//是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
			//get_poi: 1, 
			success(res) {
				app.globalData.position = res.result
				wx.navigateBack({
			    delta: 1
		    })
			},
			fail(error) {
				console.error(error)
			},
			complete(res) {
			}
		})
		
	},
	
	/*-- 获取附近店铺 --*/
	index(e) {
		let _this = this
		wx.request({
			url: 'http://192.168.1.103:8080/api/near/store',
			data: {
				latitude: this.data.position.location.lat,
				longitude: this.data.position.location.lng
			},
			success(res) {
				_this.setData({
					shops: res.data.data
				})
			}
		})
	},
 
  //触发关键词输入提示事件
  getsuggest(e) {
		if(e.detail == '') {
			this.setData({
				suggestion: []
			})
		}else{
			let _this = this
			//调用关键词提示接口
			qqmapsdk.getSuggestion({
				//获取输入框值并设置keyword参数
				keyword: e.detail,
				//设置城市名，限制关键词所示的地域范围，非必填参数
				region: this.data.position.address_component ? this.data.position.address_component.city : this.data.position.city, 
				//搜索成功后的回调
				success(res) {
					_this.setData({
						suggestion: res.data
					})
				},
				fail(error) {
					console.error(error)
				},
				complete(res) {
				}
			})
		}
  },
	
	handleAddress(e) {
		let position = e.currentTarget.dataset.address
		this.setData({
			position: position,
			searchValue: position.title,
			suggestion: []
		})
		app.globalData.position = position
		this.index()
	},
	
	handleShop(e) {
		app.globalData.shop = e.currentTarget.dataset.shop
		wx.switchTab({
			url: `/pages/home/index/index`
		})
	}
})