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
    statusMap: {
      '0': '初始化',
      '1': '未付款',
      "2":"已支付",
      "3":"已取消",
      "4":"发起退款",
      "5":"已退款",
    },
    canUseCoupons: [],
    coupons_current_no: 0,
    coupons_page_size: 1,
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
      if(!event.detail.value||event.detail.value=='')
      return;
      const res = await wx.showModal({
        title: '确认',
        content: `实际金额:${this.data.orderDetail.amount}变更为：${event.detail.value}`
      })
      if (res.confirm) {
        that.updateOrder({amount:event.detail.value})
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
  async changeMemo(event) {
    var that = this;
    try {
      if(!event.detail.value||event.detail.value=='')
      return;
      const res = await wx.showModal({
        title: '确认',
        content: `修改备注为:${event.detail.value}`
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
            context: that,
            selector: '#t-toast',
            message: "线下支付订单更新成功",
            theme: 'success',
            direction: 'column',
          });
          return
        }
        Toast({
          context: that,
          selector: '#t-toast',
          message: (res.msg || res.message),
          theme: 'warning',
          direction: 'column',
        });
  
      })
      

    }
  },
  payByUser(){
    var that=this
    var data =that.data.orderDetail

    WXAPI.payOrderOutline(data.order_no).then(res => {
      if(res.code==200){
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
        });
      }else{
        Toast({
          context: that,
          selector: '#t-toast',
          message: (res.msg || res.message),
          theme: 'warning',
          direction: 'column',
        });
      }

    })
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    this.queryCurrentOrder(e.order_no);

    if(this.data.userInfo.admin){
       setInterval(()=>{
        this.queryCurrentOrder(e.order_no)
       },10000)
    }else{
      //不是管理员扫码默认来付钱的
      this.queryCanUseCoupon();
    }
  },
  queryCurrentOrder(order_no){
    var that=this;
    WXAPI.queryOrderByNo(order_no).then(res => {

      var orderDetail = res;
      orderDetail.payment_time = dateUtil.toDate(orderDetail.payment_time);
      orderDetail.order_time = dateUtil.toDate(orderDetail.order_time);
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
      that.setData({
        canUseCoupons,
      })

    })
  },
  loadMoreCoupons() {
    let { coupons_current_no, coupons_page_size } = this.data;
    this.setData({
      coupons_current_no: coupons_current_no + coupons_page_size
    })
    this.queryCanUseCoupon();
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