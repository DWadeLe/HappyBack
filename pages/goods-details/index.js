const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const regeneratorRuntime = require('../../utils/runtime')
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    goodsDetail: {
      name: "马里奥主题包间",
      desc: "",
      icon: "../../images/banner/banner3.jpg",
      orginalPrice: 120.00,
      realPrice: "100.00"
    },
    fabButton: {
      icon: 'call',
      openType: 'getPhoneNumber',
    },
    isYYNightOrder: false,
    isAfterNoomOrder: false,
    isOrderType: 1,
    visible: false,
    YDTipVisible: false,
    isReadTip: false,
    calendarVisible: false,
    date: null,
    showDate: null,
    minDate: null,
    maxDate: null
  },
  watch: {

    date: function (_this, newValue) {
      const date = new Date(newValue);
      const year = date.getFullYear();
      var month = date.getMonth() + 1
      const monthShow = (month < 10 ? '0' + month : month);
      var day = date.getDate();
      const dayShow = (day < 10 ? '0' + day : day);
      
      _this.setData({
        showDate: `${year}-${monthShow}-${dayShow}`
      });
    }

  },




  goPay() {
    let isReadTip = this.data.isReadTip;
    if (!isReadTip) {
      this.setData({
        YDTipVisible: true
      });
      return;
    }

    //TODO 调用微信支付接口


  },

  closeYDTip() {
    this.setData({
      YDTipVisible: false,
      isReadTip: true
    });
  },
  onTabsChange(event) {
    console.log(event.detail)
    console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
    this.setData({
      isOrderType: event.detail.value
    })
  },

  onTabsClick(event) {

    console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
    this.setData({
      isOrderType: event.detail.value
    })
  },
  onLoad(e) {
    
    getApp().setWatcher(this); // 设置监听器
   
    debugger
    this.setData({
        goodsDetail:JSON.parse(e.data)
    })
    var that = this
    const now = new Date();

    // 转换为 yyyy-mm-dd 的格式
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const d7ays = new Date();
    d7ays.setDate(d7ays.getDate() + 7);
    this.setData({
      minDate: tomorrow.getTime(),
      maxDate: d7ays.getTime(),
    })
    //TODO 不同会员有不同的预约时间


    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    WXAPI.queryAppointment(this.data.goodsDetail.id, formattedDate).then(function (res) {
      var info = res;
      if (info && info.length > 0) {
        info.forEach(item => {
          if (item.session == 1) {
            that.setData({
              isAfterNoomOrder: true,
            });
          } else {
            that.setData({
              isYYNightOrder: true,
            });
          }

        })
        if (that.data.isAfterNoomOrder && that.data.isYYNightOrder) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: this.data.showDate+'已预约满了，请下次再来',
            theme: 'warning',
            direction: 'column',
          });
        }


      }


      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
    WXAPI.queryVenuePrice(this.data.goodsDetail.id).then(function (res) {
      var info = res;
      
        
     

      


      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

  },
  onShow() {


  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  handleCalendar() {
    if (this.data.date == null) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.setData({
        date: tomorrow.getTime(),
      })
    }
    this.setData({
      calendarVisible: true
    })
  },
  handleConfirm(e) {
    const {
      value
    } = e.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    this.setData({
      date: new Date(value).getTime(),
      showDate: format(value),
    });
    console.log(this)
  },
  goYY: function () {

    this.setData({
      visible: true
    })
  },



})