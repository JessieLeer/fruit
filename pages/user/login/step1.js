const app = getApp()
Page({
	data: {
		phone: {
			value: '',
			message: '',
			verify: false
		},
		countdown: 0,
		sms: {
			value: '',
			verify: false
		},
		cardNo: null,
		shopId : ''
	},
	
	onLoad(option) {
		this.setData({
			shopId: option.shopId
		})
		
	},
	
	/*-- 监听手机号发生改变时验证手机格式 --*/
	phoneChange(event) {
		const phone = event.detail
    let message = ''
		let verify = false
    if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone)) {
      message = ''
			verify = true
    } else {
      message = '请输入正确的手机号'
			verify = false
    }
    this.setData({
			'phone.value': phone,
      'phone.message': message,
			'phone.verify': verify
    })
	},
	
	/*-- 发送手机验证码 --*/
	sendSms(e) {
		var that = this;
		this.setData({
			countdown: 61,
			key : false
		})
		wx.request({
			url: `${app.globalData.url}/api/mini/sendUserSms`,
			data: {
				mobile : this.data.phone.value
			},
			success(res) {
				console.log(res)
				wx.showToast({
					title: res.data.message,
					icon: 'none'
				})
				if(res.data.code == 200){
					let count = setInterval(() => {
						var num = that.data.countdown
						num -=1 
						if (num > 0){
							that.setData({
								countdown : num,
								key : true
							})
						}else{
							clearInterval(count)
							that.setData({
								key: false,
								countdown: 0
							})
						}
					},1000)
				}else{
					that.setData({
						countdown: 61		
					})
				}
			}
		})
	},
	onGetUserinfo() {
		wx.getUserInfo({
			success: function (res) {
				console.log(res)
				wx.removeStorageSync('avatarUrl')
				wx.removeStorageSync('Nickname')
				// app.globalData.avatarUrl = ""
				// app.globalData.Nickname = ""
			}
		})
	},
	/*-- 监听验证码改变 --*/
	smsChange(e) {
		this.setData({
			'sms.verify': e.detail.length == 6,
			'sms.value' : e.detail
		})
	},
	login(){
		this.onGetUserinfo()
		var that = this;
		wx.request({
			url: `${app.globalData.url}/api/mini/login`,
			data: {
				mobile: this.data.phone.value,
				smsCode: this.data.sms.value,
				loginType : 'sms'
			},
			success(res) {
				if(res.data.code == 200){
					console.log(res)
					console.log('__________________')
					wx.showToast({
						icon: 'none',
						title: res.data.message,
						dutation: 2000
					})
					wx.setStorageSync('loginUid', res.data.data.loginUid)
					wx.setStorageSync('userId', res.data.data.userId)
					// wx.getStorageSync('loginUid') = res.data.data.loginUid;
					// wx.getStorageSync('userId') = res.data.data.userId;
					that.setData({
						cardNo: res.data.data.cardNo
					})
					if (!that.data.cardNo){
						setTimeout(() => {
							wx.navigateTo({
								url: `../../bindVIP/index?shopId=${that.data.shopId}`
							})
						}, 2000);
					}else{
						setTimeout(() => {
							wx.switchTab({
								url: "../index/index"

							})
						}, 2000);
					}
				}else{
					wx.showToast({
						icon: 'none',
						title: res.data.message,
						dutation: 2000
					})
				}
			}
		})
	}
})