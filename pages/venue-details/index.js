const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const regeneratorRuntime = require('../../utils/runtime')
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    venueDetail: {
    },
    fabButton: {
      icon: 'call',
      openType: 'getPhoneNumber',
    },
    isYYNightOrder: false,
    isAfterNoomOrder: false,
    session: 1,
    visible: false,
    YDTipVisible: false,
    isReadTip: false,
    calendarVisible: false,
    date: null,
    showDate: null,
    minDate: null,
    maxDate: null,
    venuePriceMap: {},
    canUseCoupons: [],
    couponVisible: false,
    use_coupon: '',
    selectedCoupon:null,
    confirmCoupon:null,
    remark:"",
    userInfo:{}
  },
  watch: {

    date: function (_this, newValue) {
      const date = new Date(newValue);
      const year = date.getFullYear();
      var month = date.getMonth() + 1
      var day = date.getDate();

      _this.setData({
        showDate: `${year}-${month}-${day}`
      });
    }

  },
  confirmCoupon() {
       // 把选中的券名字显示在上面
       var {selectedCoupon}=this.data;
       this.setData({
         use_coupon:selectedCoupon.coupon_name,
         confirmCoupon:selectedCoupon,
         couponVisible:false,
         visible:true
       })
  },
  onSelectCoupon(e){
    const data = e.currentTarget.dataset.data;
    this.setData({
      selectedCoupon: data
    });  
  },
  openCouponList() {
    var that = this;
    if(this.data.canUseCoupons.length==0){
      return;
    }
    this.setData({
       selectedCoupon:this.data.confirmCoupon,
       couponVisible: true,
        visible:false
    })
    
  },
  closeCouponListPop(){
     this.setData({
      couponVisible:false,
      visible:true
     })
  },

  goPay() {
    let isReadTip = this.data.isReadTip;
    if (!isReadTip) {
      this.setData({
        YDTipVisible: true
      });
      return;
    }
    var {remark,userInfo,venueDetail,selectedCoupon,session,showDate}=this.data;
    var param={
      user_id:userInfo.id,
       wx_no:userInfo.wx_no,
       venue_id:venueDetail.id,
       remark,
       session,
       date:showDate
    }
    if(selectedCoupon && selectedCoupon.id!=null)
        param.coupon_id=selectedCoupon.id
        //TODO 调用微信支付接口

    WXAPI.appoint(venueDetail.id, param).then(res => {
        console.log(res,11)

        wx.requestPayment({
          appid:"wxf83224ed1b5ec2f4",
          timeStamp: "1414561699",
          nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
          package: 'prepay_id=wx201410272009395522657a690389285100',
          signType: 'RSA',
          paySign: 'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==',
          success (res) { 
            console.log(res)
          },
          fail (res) { 
            console.log(res)

          }
        })

    })



  },

  closeYDTip() {
    this.setData({
      YDTipVisible: false,
      isReadTip: true
    });
  },
  onTabsChange(event) {
    this.setData({
      session: event.detail.value
    })
  },

  onTabsClick(event) {
    this.setData({
      session: event.detail.value
    })
  },
  onLoad(e) {

    getApp().setWatcher(this); // 设置监听器


    this.setData({
      venueDetail: JSON.parse(e.data),
      userInfo:wx.getStorageSync("userInfo")

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

    // 不同会员有不同的预约时间


    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
    this.setData({
      minDate: tomorrow.getTime(),
      maxDate: d7ays.getTime(),
      date: tomorrow.getTime(),
      showDate: format(tomorrow)
    })
    WXAPI.queryAppointment(this.data.venueDetail.id, formattedDate).then(function (res) {
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
            message: this.data.showDate + '已预约满了，请下次再来',
            theme: 'warning',
            direction: 'column',
          });
        }


      }


      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
    WXAPI.queryVenuePrice(this.data.venueDetail.id).then(function (res) {

      var info = res;
      var venuePriceMap = {};
      info.forEach(item => {
        venuePriceMap[item.type] = item;
      });

      that.setData({
        venuePriceMap
      })

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

    WXAPI.queryCouponsByUser(this.data.userInfo.id, { "payment_venue": 1,"status":1 }).then(res => {

      var canUseCoupons = res;
      that.setData({
        canUseCoupons,
      })

    })

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