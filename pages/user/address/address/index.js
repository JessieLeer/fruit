let QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js')
import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"
import areaList from './area.js'
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'N4TBZ-BDWCU-ZQPVN-2XVXR-DNJYH-35B7S'
})
const app = getApp()

Page({
	data: {
		position: {},
		suggestion: [],
		searchValue: '',
		from: '',
		area: {
			show: false,
			data: areaList
		}
	},
	onLoad(option) {
		this.setData({
			from: option.from,
			position: app.globalData.position
		})
	},
	openArea(e) {
		this.setData({
			'area.show': true
		})
	},
	cityConfirm(e) {
		this.setData({
			cuscity: e.detail.values[1].name,
			'area.show': false
		})
	},
	cityCancel(e) {
		this.setData({
			'area.show': false
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
				region: this.data.cuscity || this.data.position.address_component.city, 
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
		let pages = getCurrentPages()
		let prevPage = pages[pages.length - 2]
		prevPage.setData({
			'form.address.value': position.address + position.title,
			'form.latitude.value': position.location.lat,
			'form.longitude.value': position.location.lng
		})
    wx.navigateBack({
      delta: 1
    })
	},
})