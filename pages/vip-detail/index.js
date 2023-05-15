// pages/order/index.js
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
    vipDetail:{},
    userInfo:{},
    orderMethodMap:{
       0:"线上支付",
       1:"线下支付"
    },
    paymentVenueMap: {
      "1": "开通会员",
      "2": "预约",
      "3": "机位结算"
    },

  },
  
  onPullDownRefresh() {
    var that=this;
    this.queryOrder(this.data.payStatus,()=>{
        that.setData({
          'baseRefresh.value':false
        })
    });

  },
  onScroll(e) {
    const { scrollTop } = e.detail;

    this.setData({
      backTopVisible: scrollTop > 100,
    });
  },
  onTabsClick(e){
      var payStatus=e.detail.value;
       this.setData({
           payStatus
       })
       this.queryOrder(payStatus);
  },

  toPay(e) {

    let that = this;

    WXAPI.buyVip(this.data.orderMethodMap.id, {
      user_id: this.data.userInfo.id
    }).then(function (res) {

      if (res.code == 200) {
        wx.showToast({
          title: '会员订购成功',
        })
        wx.requestPayment({
          appid: "wxf83224ed1b5ec2f4",
          timeStamp: "1414561699",
          nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
          package: 'prepay_id=wx201410272009395522657a690389285100',
          signType: 'RSA',
          paySign: 'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==',
          success(res) {
            that.refreshUser()
            setTimeout(function () {
              wx.navigateTo({
                url: "/pages/my/index"
              })
            }, 1000)
          },
          fail(res) {
            console.log(res)

          }
        });

      } else {
        Toast({
          context: that,
          selector: '#t-toast',
          message: "会员订购失败:" + res.message,
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
  onLoad(e) {
    this.setData({
      vipDetail: JSON.parse(e.data),
      userInfo:wx.getStorageSync("userInfo")

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