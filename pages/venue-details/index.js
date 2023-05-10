const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const regeneratorRuntime = require('../../utils/runtime')
const dateUtil = require('../../utils/date.js')

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
    coupons_current_no: 0,
    coupons_page_size: 10,
    isLastPage: false,
    couponVisible: false,
    use_coupon: '',
    selectedCoupon: null,
    confirmCoupon: null,
    remark: "",
    userInfo: {},
    themeColor: app.globalData.themeColor
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
    var { selectedCoupon } = this.data;
    this.setData({
      use_coupon: selectedCoupon.coupon_name,
      confirmCoupon: selectedCoupon,
      couponVisible: false,
      visible: true
    })
  },
  onSelectCoupon(e) {
    const data = e.currentTarget.dataset.data;
    this.setData({
      selectedCoupon: data
    });
  },
  openCouponList() {
    var that = this;
    if (this.data.canUseCoupons.length == 0) {
      return;
    }
    this.setData({
      selectedCoupon: this.data.confirmCoupon,
      couponVisible: true,
      visible: false
    })

  },
  closeCouponListPop() {
    this.setData({
      couponVisible: false,
      visible: true
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
    var { remark, userInfo, venueDetail, selectedCoupon, session, showDate } = this.data;
    var param = {
      user_id: userInfo.id,
      wx_no: userInfo.wx_no,
      venue_id: venueDetail.id,
      remark,
      session,
      date: showDate
    }
    if (selectedCoupon && selectedCoupon.id != null)
      param.coupon_id = selectedCoupon.id
    //TODO 调用微信支付接口

    WXAPI.appoint(venueDetail.id, param).then(res => {
      if(res.status==400){
         wx.showToast({
           title: '预约异常:'+res.message,
         })
         return;
      }

      wx.requestPayment({
        appid: "wxf83224ed1b5ec2f4",
        timeStamp: "1414561699",
        nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
        package: 'prepay_id=wx201410272009395522657a690389285100',
        signType: 'RSA',
        paySign: 'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==',
        success(res) {
          console.log(res)
        },
        fail(res) {
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
      userInfo: wx.getStorageSync("userInfo")

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
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    };
    this.setData({
      minDate: tomorrow.getTime(),
      maxDate: d7ays.getTime(),
      date: tomorrow.getTime(),
      showDate: format(tomorrow)
    })
    this.queryAppiontment(formattedDate);
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

    this.queryCouponsByUser();

  },
  loadMoreCoupons() {
    let { coupons_current_no, coupons_page_size } = this.data;
    this.setData({
      coupons_current_no: coupons_current_no + coupons_page_size
    })
    this.queryCouponsByUser();
  },
  
  /**
   * 根据日期查询当日预约情况
   */
  queryAppiontment(formattedDate){
    var that=this;
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
  },
  /**
   * 查询未使用的卡券
   * @returns 
   */
  queryCouponsByUser() {
    var that = this;
    let { coupons_current_no, coupons_page_size, isLastPage } = this.data;
    if (isLastPage) {
      return;
    }
    //3包场结算
    WXAPI.queryCouponsByUser(this.data.userInfo.id, {
      "payment_venue": 3, "status": 1,
      "current_no": coupons_current_no,
      "page_size": coupons_page_size
    }).then(res => {

      var canUseCoupons = res;
      if (!canUseCoupons || canUseCoupons.length == 0) {
        that.setData({
          isLastPage: true
        })
        return;
      }
      canUseCoupons.forEach(item=>{
        item.expire_time = dateUtil.toDate(item.expire_time)
        item.use_time = dateUtil.toDate(item.use_time)
      })
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
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    };
    var selectedDate=format(value)
    this.setData({
      date: new Date(value).getTime(),
      showDate: selectedDate,
    });
    this.queryAppiontment(selectedDate);
  },
  goYY: function () {

    this.setData({
      visible: true
    })
  },



})