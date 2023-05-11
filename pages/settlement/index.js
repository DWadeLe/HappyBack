// pages/order/index.js
const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
import drawQrcode from '../../utils/weapp.qrcode.min.js'
import Toast from 'tdesign-miniprogram/toast/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    userInfo: {},
    orderMethodMap: {
      0: "线上支付",
      1: "线下支付"
    },
    paymentVenueMap: {
      "1": "开通会员",
      "2": "预约",
      "3": "机位结算"
    },
    showConfirm: false,
    confirmContent: "",
    canUseCoupons: [],
    coupons_current_no: 0,
    coupons_page_size: 10,
    isLastPage: false,
    couponVisible: false,
    use_coupon: '',
    //选择框选中的
    selectedCoupon: {},
    //选中后确认的
    confirmCoupon: {},
    

  },
  async changeAmount(event) {
    var that = this;
    try {
      const res = await wx.showModal({
        title: '确认',
        content: `实际金额由${this.data.orderDetail.amount}变更为：${event.detail.value}`
      })
      if (res.confirm) {
        that.updateOrder({amout:event.detail.value})
      } else if (res.cancel) {
        return;
      }
    } catch (e) {
      console.error(e)
    }
  },
  updateOrder(param) {
    var that=this;
    var {order_no}=this.data.orderDetail;
    WXAPI.updateOrder(order_no,param).then(res => {
      if(res.order_no){
        Toast({
          context: that,
          selector: '#t-toast',
          message: "更新成功",
          theme: 'success',
          direction: 'column',
        });
      }
      
      return
    })
  },
  closeDialog() {
    this.setData({
      showConfirm: false,
      confirmContent: ""
    })
  },
  async changeMemo(event) {
    var that = this;
    try {
      const res = await wx.showModal({
        title: '确认',
        content: `修改备注为${event.detail.value}`
      })
      if (res.confirm) {
        that.updateOrder({memo:event.detail.value})
      } else if (res.cancel) {
        return;
      }
    } catch (e) {
      console.error(e)
    }
  },
  payByManger(e) {
    var that = this
    var data =that.data.orderDetail
    var type =e.currentTarget.dataset.index;
    debugger
    //线上
    if (type == 0) {
      var content="/pages/settlement/index?order_no="+data.order_no;
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: content,
        _this: that
      })
      this.setData({
        qrCodeVisible:true
      })
  
    } else {
      WXAPI.payOrderOutline(data.order_no).then(res => {
        if(res.code==200){
          Toast({
            context: this,
            selector: '#t-toast',
            message: "线下支付订单更新成功",
            theme: 'success',
            direction: 'column',
          });
          return
        }
        Toast({
          context: this,
          selector: '#t-toast',
          message: (res.msg || res.message),
          theme: 'warning',
          direction: 'column',
        });
  
      })
      

    }
  },
  payByUser(){
   
  },
  onPullDownRefresh() {
    var that = this;
    this.queryOrder(this.data.payStatus, () => {
      that.setData({
        'baseRefresh.value': false
      })
    });

  },
  onScroll(e) {
    const { scrollTop } = e.detail;

    this.setData({
      backTopVisible: scrollTop > 100,
    });
  },
  onTabsClick(e) {
    var payStatus = e.detail.value;
    this.setData({
      payStatus
    })
    this.queryOrder(payStatus);
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })

    if (this.data.userInfo.id == this.data.orderDetail.user_id) {
      this.queryCanUseCoupon();
      this.queryCurrentOrder(e.order_no);
    }
    if(this.data.userInfo.admin){
       setInterval(this.queryCurrentOrder(e.order_no),10000)
    }
  },
  queryCurrentOrder(order_no){
    var that=this;
    WXAPI.queryOrderByNo(order_no).then(res => {

      var orderDetail = res;
      that.setData({
        orderDetail,
      })

    })
  },
  showCouponsList() {
    this.setData({
      couponVisible: true,
    })
  },
  closeCouponListPop() {
    this.setData({
      couponVisible: false,
    })
  },
  closeQrCode(){
    this.setData({
      qrCodeVisible:false
    })
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
  queryCanUseCoupon() {
    var that = this;
    let { coupons_current_no, coupons_page_size, isLastPage } = this.data;
    if (isLastPage) {
      return;
    }
    //
    WXAPI.queryCouponsByUser(this.data.userInfo.id, {
      "payment_venue": that.orderDetail.payment_venue, "status": 1,
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
      that.setData({
        canUseCoupons,
      })

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})