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
    isReadTip: false,
    calendarVisible: false,
    date: null,
    showDate: null,
    minDate: null,
    maxDate: null,
    venuePriceMap: {},
    canUseCoupons: [],
    coupons_current_no: 0,
    coupons_page_size: 1,
    isLastPage: false,
    couponVisible: false,
    use_coupon: '',
    selectedCoupon: null,
    confirmCoupon: null,
    remark: "",
    userInfo: {},
    themeColor: app.globalData.themeColor,
    sessionVisible:false,
    sessionOptions:[],
    sessionShow:""
  },
  watch: {

    date: function (_this, newValue) {
      // const date = new Date(newValue);
      // const year = date.getFullYear();
      // var month = date.getMonth() + 1
      // var day = date.getDate();
      const format = (val) => {
        const date = new Date(val);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      };
      _this.setData({
        showDate: format(newValue)
      });
    }

  },
  confirmCoupon() {
    // 把选中的券名字显示在上面
    var { selectedCoupon } = this.data;
    if(selectedCoupon){
      this.setData({
        use_coupon: selectedCoupon.coupon_name,
        confirmCoupon: selectedCoupon,
        couponVisible: false,
        visible: true
      })
    }else{
      this.setData({
        use_coupon: '',
        confirmCoupon: null,
        couponVisible: false,
        visible: true
      })
    }
    
  },
  onSelectCoupon(e) {
    const data = e.currentTarget.dataset.data;
    
    if(this.data.selectedCoupon && data.id==this.data.selectedCoupon.id){
      //取消
      this.setData({
        selectedCoupon: null
      });
      return;
    }
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
  onSessionPicker(){
    this.setData({
      sessionVisible: true,
    })
  },
  goPay() {
    var that=this;
    let isReadTip = this.data.isReadTip;
    if (!isReadTip) {
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
      if(res.error){
        Toast({
          context: that,
          selector: '#t-toast',
          message: "预约异常:"+res.message,
          theme: 'error',
          direction: 'column',
        });
        return
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


  sessionConfirm(e) {
    const { value,text,disabled } = e.detail.value;
    if(disabled){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '无法选中，已被预约',
        theme: 'warning',
        direction: 'column',
      });
      return
    }
    this.setData({
      session:value,
      sessionShow:text,
      sessionVisible:false
    })
  },
  sessionPickerCancel(){
    this.setData({
       sessionVisible:false
    })
  },
  onLoad(e) {

    getApp().setWatcher(this); // 设置监听器


    this.setData({
      venueDetail: JSON.parse(decodeURIComponent(e.data)),
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
    const format = (val) => {
      const date = new Date(val);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    };
    this.setData({
      minDate: tomorrow.getTime(),
      maxDate: this.data.userInfo.vip?d7ays.getTime():tomorrow.getTime(),
      date: tomorrow.getTime(),
      showDate: format(tomorrow)
    })
    this.queryAppiontment(format(tomorrow));
    WXAPI.queryVenuePrice(this.data.venueDetail.id).then(function (res) {

      var info = res;
      var venuePriceMap = {};
      var sessionOptions=[];

      info.forEach(item => {
        venuePriceMap[item.type] = item;
        if(item.type>2){
          return
        }
        sessionOptions.push({
          value:item.type,
          text:`(${item.type==1?'下午场':'夜晚场'})${item.begin_hour}:00-${item.end_hour}:00`
       })
      });

      var sesionJson=venuePriceMap[that.data.session];
      that.setData({
        venuePriceMap,
        sessionOptions,
        sessionShow:`(${sesionJson.type==1?'下午场':'夜晚场'})${sesionJson.begin_hour}:00-${sesionJson.end_hour}:00`
      })

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

    this.queryCanUseCoupon();

  },
  loadMoreCoupons() {
    let { coupons_current_no, coupons_page_size } = this.data;
    this.setData({
      coupons_current_no: coupons_current_no + coupons_page_size
    })
    var scrollView = wx.createSelectorQuery().select('#scroll-view');
    scrollView.scroll({
      top: 1
    })
    this.queryCanUseCoupon();
  },
  
  /**
   * 根据日期查询当日预约情况
   */
  queryAppiontment(formattedDate){
    var that=this;
    WXAPI.queryAppointment(this.data.venueDetail.id, formattedDate).then(function (res) {
      var info = res;
      if (info && info.length > 0) {
        var isAfterNoomOrder=false,isYYNightOrder=false;
        info.forEach(item => {
          if (item.session == 1) {
            var sessionOptions=that.data.sessionOptions;
            sessionOptions.forEach(it=>{
               if(it.value==item.session){
                   it.disabled=true
               }
            })
            isAfterNoomOrder=true
            that.setData({
              isAfterNoomOrder: true,
              sessionOptions
            });
          } else {
            var sessionOptions=that.data.sessionOptions;
            sessionOptions.forEach(it=>{
               if(it.value==item.session){
                   it.disabled=true
               }
            })
            isYYNightOrder=true
            that.setData({
              isYYNightOrder: true,
              sessionOptions
            });
          }

        })

        if (isAfterNoomOrder && isYYNightOrder) {
          Toast({
            context: that,
            selector: '#t-toast',
            message: '当前日期已预约满了',
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
  queryCanUseCoupon() {
    var that = this;
    let { coupons_current_no, coupons_page_size, isLastPage } = this.data;
    let _canUseCoupons=this.data.canUseCoupons
    if (isLastPage) {
      return;
    }
    //venue==3 机位结算
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
      canUseCoupons.forEach(item => {
        item.expire_time = dateUtil.toDate(item.expire_time)
        item.use_time = dateUtil.toDate(item.use_time)
      })
      if(_canUseCoupons!=undefined && _canUseCoupons.length>0)
      _canUseCoupons=_canUseCoupons.concat(canUseCoupons)
      else
      _canUseCoupons=canUseCoupons
      
      that.setData({
        canUseCoupons:_canUseCoupons
      })

    })
  },
  letMeKnow(){
     this.setData({
      isReadTip:!this.data.isReadTip
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