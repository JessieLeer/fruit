const app = getApp()

Component({
  properties: {
    goods: {
      type: Array
    },
		totalPrice: {
			type: Number
		},
		shopId: {
			type: String
		}
  },
  data: {
    // 这里是一些组件内部数据
		goodHidden: true,
  },
	
  ready() { 
	},
	lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
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
    // 这里是一个自定义方法
    toggleGood(e) {
			this.setData({
				goodHidden: !this.data.goodHidden
			})
		},
		onChange(event) {
			// detail对象，提供给事件监听函数
      let detail = {
				count: event.detail,
				id: event.currentTarget.dataset['good'].id
			}
      // 触发事件的选项
      let option = {} 
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('onCartChange', detail, option)
		},
		onClose(e) {
			this.setData({
				goodHidden: true
			})
  	},
		onClear(e) {
			this.triggerEvent('onClear', {})
		},
		onSubmit(e) {
			app.globalData.orderGoods = this.properties.goods
			wx.navigateTo({
				url: `/pages/home/order/show/index?shopId=${this.properties.shopId}`
			})
		}
  }
})
