import utils from '../../utils/dealtime'
import Toast from "../../miniprogram_npm/vant-weapp/toast/toast"
const app = getApp()
Page({
    data : {
        minDate: new Date(1960, 0, 1).getTime(),
        maxDate: new Date().getTime(),
        nowDate: new Date(1990,0,1).getTime(),
        showDate : false,
        showStore : false,
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if(type === 'day') {
                return `${value}日`;
            }
            return value;
        },
        current : "",
        currentadress : "",
        columns: [],
        codetext : "获取验证码",
        num : "",
        codekey : true,
        tel : '',
        showCodeItem : false,
        code : '',
        name : '',
        checked : false,
        wxcode : '',
        cardList : [],
        latitude : 0,
        longitude : 0,
        shopId : '',
        storeId : 0,
        type : '',
			  nickName: ''
    },
    onShow(){
			app.userShow().then((res) => {
				this.setData({
					nickName: res.userInfo.nickName
				})
				this.getUserInfo()
			})
      
      this.getJW()
    },
    getJW(){
        var that = this
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({ latitude: latitude, longitude: longitude })
                that.getStoreName()
            }
        })
    },
    getUserInfo(){
        let loginUid = wx.getStorageSync('loginUid')
        let userId = wx.getStorageSync('userId')
        var that = this
        wx.request({
            url: `${app.globalData.custom.url}/api/member/getUserInfo`,
            data: {
                loginUid: loginUid,
                userId: userId
            },
            success(res) {
                that.setData({
                    tel: res.data.data.mobile
                })
                that.getFormInfo(res.data.data.mobile)
            }
        })
    },
    getStoreName(){
        var that = this;
        wx.request({
            url: `${app.globalData.custom.url}/api/store/all`,
            data: {
                latitude: that.data.latitude,
                longitude: that.data.longitude
            },
            success(res) {
                var columns = []
                res.data.data.map((item)=>{
                    columns.push(item.name)
                })
                // res.data.data
                that.setData({
                    columns
                })
            }
        })
    },
    getFormInfo(mobile){
        var that = this;
        wx.request({
            url: `${app.globalData.custom.url}/api/mini/getBasicInfo`, 
            data: {
                mobile,
                shopId : that.data.shopId
            },
            success(res) {
                if (mobile == res.data.data.name){
                    res.data.data.name = '';
                }
                that.setData({
                    currentadress : res.data.data.storeName,
                    storeId : res.data.data.storeId,
                    name: res.data.data.name == '' ? that.data.nickName : res.data.data.name,
                    current: res.data.data.birthday == '' ? '1990-01-01' : res.data.data.birthday,
                    nowDate: res.data.data.birthday ? new Date(res.data.data.birthday).getTime() : new Date(1990, 0, 1).getTime()
                })
            }
        })
    },
    chooseDate(){
			if(this.data.current == '1990-01-01'){
				this.setData({
          showDate : true,
          showStore: false
        })
			}else{
				Toast({
					message: '生日只能修改一次'
				})
			}
    },
    confirm(e){
        this.setData({
            showDate: false,
            showStore: false,
            current:  utils(e.detail, 'l')
        })
    },
    cancel(e){
        this.setData({
            showDate: false,
            showStore: false
        })
    },
    confirm_select(e){
        this.setData({
            showDate: false,
            showStore: false,
            currentadress:  e.detail.value
        })
    },
    cancel_select(e){
        this.setData({
            showDate: false,
            showStore: false
        })
    },
    showStore(){
        this.setData({
            showDate: false,
            showStore: true
        })
    },
    close(){
        this.setData({
            showDate: false,
            showStore: false
        })
    },
    getCode(){
        this.count()
    },
    count(){
        if (!this.data.codekey) return
        let time = 60
        let timer = setInterval(() => {
            this.setData({
                codetext: '已发送',
                num: `(${time -= 1})`,
                codekey: false
            })
            if (time < 0) {
                clearInterval(timer)
                this.setData({
                    codetext: '获取验证码',
                    num: "",
                    codekey: true
                })
            }
        }, 1000); 
    },
    inputChange(e){
        this.setData({
            showCodeItem : true,
            tel: e.detail.value
        })
    },
    bindcard(){
        var arr = ['tel','name']
        for(var i in arr){
            if(!this.data[arr[i]]){
                wx.showToast({
                    title: '请填写完整资料',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }
        }
        if (!this.data.showCodeItem){
            this.getWxCodeAndSaveCardInfo()
        }else{
            if(!this.data.code){
                wx.showToast({
                    title: '请填写完整资料',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                this.getWxCodeAndSaveCardInfo()
            }
        }
    },
    ajaxBindCard(){
        var that = this
        wx.request({
            url: `${app.globalData.custom.url}/api/mini/saveMemberInfo`,
            data: {
                birthday: that.data.current,
                code: that.data.wxcode,
                loginType : that.data.type,
                mobile: that.data.tel,
                name: that.data.name,
                store: that.data.storeId,
                smsCode: that.data.code,
							avatar: wx.getStorageSync('avatarUrl')
            },
            success(res) {
                if(res.data.code == 200){
                    wx.setStorageSync('loginUid', res.data.data.loginUid)
                    wx.setStorageSync('userId', res.data.data.userId)
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                    that.getCodeAndCardInfo()
                }else{
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
                
            }
        })
    },
    changeHandlerCode(e){
        this.setData({
            code : e.detail.value
        })
    },
    changeHandlerName(e){
        this.setData({
            name : e.detail.value
        })
    },
    checkboxChange(e){
        if(this.data.checked){
            this.setData({
                checked : false
            })
        }else{
            this.setData({
                checked: true
            })
        }
    },
    getWxCodeAndSaveCardInfo(){
        var that = this;
        wx.login({
            success: res => {
                that.setData({
                    wxcode : res.code
                })
                that.ajaxBindCard()
            }
        })
    },
    getCodeAndCardInfo(){
        var that = this
        wx.login({
            success: res => {
                that.setData({
                    wxcode: res.code
                })
                that.getCardInfo()
            }
        })
    },
    getCardInfo(){
        var that = this
        wx.request({
            url: `${app.globalData.custom.url}/api/mini/getAddWeCardInfo`,
            data: {
                code: that.data.wxcode
            },
            success(res) {
                if (res.data.code == 200) {
                    wx.addCard({
                        cardList: [
                            {
                                cardId: res.data.data.cardId,
                                cardExt: res.data.data.cardExt
                            }
                        ],
                        success(res) {
                            wx.switchTab({
                                url: '../user/index/index'
                            })
                        }
                    })
                } else {

                }
            }
        })
    },
    gotodoc(){
        wx.navigateTo({
            url: "../documents/Doc/index?id=memberlevel"
        })
    },
    onLoad(options){
        this.setData({
            shopId: options.shopId,
            type: options.type,
            code : options.code
        })
    }
})