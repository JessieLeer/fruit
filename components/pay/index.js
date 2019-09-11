const app = getApp()

Component({
  properties: {
    isShow: {
			type: Boolean,
			default: false
		},
		type: {
			type: String
		},
		cost: {
			type: Number
		},
		paShow: {
			type: Boolean,
			default: false
		},
		password: {
			type: String
		},
		passFocus: {
			type: Boolean,
			default: true
		}
  },
  data: {
		cuser: {},
		balance: 0,
  },
	
  ready() { 
	},
	lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
			this.initUser()
		},
    moved() { 
			
		},
    detached() { 
			
		},
  },
	pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
			
		},
    hide() { 
		},
    resize() { 
			
		},
  },
  methods: {
		initUser(e) {
			let _this = this
			wx.getStorage({
				key: 'cuser',
				success (res) {
					_this.setData({
						cuser: res.data
					})
					_this.balanceShow()
				}
			})
		},
		balanceShow(e) {
			let _this = this
			wx.request({
				url: 'http://192.168.1.103:8080/api/user/balance',
				data: {
					userId: this.data.cuser.userId
				},
				success(res) {
					_this.setData({
						balance: res.data.data
					})
				}
			})
		},
    onClose(e) {
			this.triggerEvent('onClose', {})
		},
		onClick(e) {
			if(e.currentTarget.dataset.name == 'balance' && this.properties.cost > this.data.balance) {
			}else{
				this.triggerEvent('onChange', e.currentTarget.dataset.name)
			}
		},
		handlePass(e) {
			this.triggerEvent('handlePass', {})
		},
		
		/**
		 * 输入密码监听
		 */
		onPassChange(e){
			this.triggerEvent('passInput', e.detail)
		},
		
		onPassclose(e) {
			this.triggerEvent('passClose', {})
		}
  }
})
