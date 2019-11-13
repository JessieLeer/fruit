import Toast from "../../../../miniprogram_npm/vant-weapp/toast/toast"

//获取应用实例
const app = getApp()

Page({
	data: {
		cuser: {},
		form: {
			id: {
				value: '',
				message: ''
			},
			address: {
				value: '',
				message: '请选择收货地址'
			},
			house: {
				value: '',
				message: '请输入门牌号'
			},
			contact: {
				value: '',
				message: '请填写联系人'
			},
			gender: {
				value: '',
				message: '请选择性别'
			},
			phone: {
				value: '',
				message: '请输入正确格式的手机号'
			},
			tag: {
				value: '',
				message: '请选择标签'
			},
			latitude: {
				value: '',
				message: '请选择收货地址'
			},
      longitude: {
				value: '',
				message: '请选择收货地址'
			},
			defaultFlag: {
				value: false,
				message: ''
			}
		}
	},
	onLoad(option) {
		this.initCuser()
		this.setData({
			'form.id.value': option.id
		}, () => {
			this.show()
		})
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
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	show(e) {
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/member/getUserAddressById`,
			data: {
				addrId: this.data.form.id.value,
				loginUid: this.data.cuser.loginUid,
				userId: this.data.cuser.userId
			},
			success(res) {
				Object.keys(res.data.data).forEach((key) => {
					_this.setData({
						[`form.${key}.value`]: res.data.data[key]
					})
				})
			}
		})
	},
	onChange(e) {
		let prop = `form.${e.currentTarget.dataset.field}.value`
		this.setData({
			[prop]: e.detail
		})
	},
	submit(e) {
		let form = new Object
		let patten
		for(let i in this.data.form) {
			patten = i == 'phone' ? /^1(3|4|5|6|7|8|9)\d{9}$/ : /\S/
			if(patten.test(this.data.form[i].value)){
				form[i] = this.data.form[i].value
			}else{
				Toast.fail(this.data.form[i].message)
				return false
			}
		}
		form.defaultFlag ? form.defaultFlag = 1 : form.defaultFlag = 0
		let _this = this
		wx.request({
			url: `${app.globalData.custom.url}/api/member/updateUserAddress?loginUid=${this.data.cuser.loginUid}&userId=${this.data.cuser.userId}`,
			method: 'post',
			data: {
				userAddr: form
			},
			success(res) {
				if(res.data.code == 200) {
					Toast({
						message: '更新成功'
					})
					setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          },2000)
				}
			}
		})
	}
})