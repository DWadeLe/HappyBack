// pages/order/index.js
import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    payStatus: -1,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no: 0,
    isLastPage: false,
    page_size: 10,
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
    userInfo:{}


  },
  goOrderDetail(e) {

    wx.navigateTo({
      url: "/pages/order-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data)
    })
  },
  onPullDownRefresh() {
    
    var that = this;
    var {current_no,page_size}=this.data;
   
    this.setData({
      current_no:0,
      orderList:[]
    })
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
      payStatus,
      orderList:[],
      current_no: 0,
      page_size: 10,
      isLastPage:false
    })
    this.queryOrder(payStatus);
  },

  queryOrder(payStatus, callback) {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据'
      })
      return;
    }
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      current_no: 0,
      isLastPage: false
    })
    var { current_no, page_size } = this.data;
    var param = {
      current_no,
      page_size
    }

    if (payStatus!="-1")
      param.status = payStatus
    
    WXAPI.queryOrder(userInfo.id, param).then(function (res) {
      var now=new Date().getTime();
      var orderList = res;
      orderList.forEach(item => {
        item.close_time=new Date(item.expire_time).getTime()-now;
        
        item.order_time = dateUtil.toDate(item.order_time);
        item.payment_time = dateUtil.toDate(item.payment_time);
      })
      that.setData({
        orderList: orderList,
      });
      if (callback) {
        callback()
      }
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  //触底刷新
  onReachBottom() {
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    var { current_no, page_size, payStatus } = this.data;

    current_no = current_no + page_size;
    var param = {
      current_no,
      page_size
    }
    if (payStatus)
      param.status = payStatus
    WXAPI.queryOrder(user_id, param).then(function (res) {

      var orderList = res;

      if (orderList.length > 0) {
        orderList.forEach(item => {
          item.order_time = dateUtil.toDate(item.order_time);
          item.payment_time = dateUtil.toDate(item.payment_time);
        })
        var newList = that.data.orderList.concat(orderList);
        that.setData({
          orderList: newList,
          current_no
        });
      } else {
        that.setData({
          isLastPage: true,
        });
      }
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  refreshData(){
    this.setData({
      orderList:[],
      current_no: 0,
      page_size: 10,
      isLastPage:false
    })
    this.queryOrder(this.data.pageStatus);
     
  },

  toPay(e){
    var data=e.currentTarget.dataset.data;
    var that=this;
    
    WXAPI.payOrderOnline(data.order_no).then(function (res) {

      if(res.code==200){
          wx.showToast({
            "title":"支付订单成功"
          })
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
          message: "支付订单失败:"+res.message,
        });
      }
      this.refreshData();
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  toCancel(e){
    var data=e.currentTarget.dataset.data;
    var that=this;
    WXAPI.cancelOrder(data.order_no).then(function (res) {
 
      if(res.code==200){
          wx.showToast({
            "title":"取消订单成功"
          })
          that.refreshData();
      }else{
        Toast({
          context: that,
          selector: '#t-toast',
          message: "取消订单失败:"+res.message,
        });
      }
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  toRefund(e){
    var data=e.currentTarget.dataset.data;
    var that=this;
    WXAPI.refundOrder(data.order_no).then(function (res) {
 
      if(res.code==200){
          wx.showToast({
            "title":"取消订单成功"
          })
      }else{
        Toast({
          context: that,
          selector: '#t-toast',
          message: "取消订单失败:"+res.message,
        });
      }
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    
    this.setData({
      orderList:[],
      userInfo:wx.getStorageSync('userInfo')
   })
    this.queryOrder(this.data.payStatus);
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