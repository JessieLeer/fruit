
import utils from '../../utils/dealtime'
const app = getApp()
Page({
    data : {
        minDate: new Date(1960, 1, 1).getTime(),
        maxDate: new Date().getTime(),
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
        columns: ['缘疆佳园齐河花甲店', '缘疆佳园齐河花甲店', '缘疆佳园齐河花甲店', '缘疆佳园齐河花甲店', '缘疆佳园齐河花甲店'],
        codetext : "获取验证码",
        num : "",
        codekey : true,
        tel : '13905308888',
        showCodeItem : false,
        code : '',
        name : ''
    },
    chooseDate(){
        this.setData({
            showDate : true,
            showStore: false
        })
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
    inputChange(){
        this.setData({
            showCodeItem : true
        })
    },
    bindcard(){
        var arr = ['tel', 'name', 'current','currentadress']
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
            this.ajaxBindCard()
        }else{
            if(!this.data.code){
                wx.showToast({
                    title: '请填写完整资料',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                this.ajaxBindCard()
            }
        }
    },
    ajaxBindCard(){
        console.log(111)
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
    }
})