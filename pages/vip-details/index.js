// pages/order/index.js
const app = getApp()
const wxpay = require('../../utils/pay.js')
const dateUtil = require('../../utils/date.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main.js')
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

    WXAPI.buyVip(this.data.vipDetail.id, {
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
    const systemInfo = wx.getSystemInfoSync();
    //屏幕高，屏幕宽，可视区高度，状态栏高，像素比
    var { screenHeight, screenWidth, windowHeight, statusBarHeight, pixelRatio } = systemInfo;
    var margin = screenWidth * 20 / 750;
    var itemWidth = (screenWidth - 3 * margin) / 2;
    var swiperHeight = 475 * screenWidth / 750;
    const navBarHeight = 44; // 顶部导航栏高度
    const tabBarHeight = 50; // 底部导航栏高度，注意这个值是固定的
    /**
     * 当我们自定义custiom的时候，底部导航栏不在可视区里面
     * https://blog.csdn.net/qq_46199553/article/details/126030693
     */
    const contentHeight = windowHeight - navBarHeight - statusBarHeight;
    var vip_title_top = navBarHeight + statusBarHeight + 10 * screenWidth / 750
    var vip_title_left = (screenWidth - (300 * screenWidth/750))/ 2 
    var vip_desc_title_left = (screenWidth  - (400 * screenWidth/750))/ 2
    var qy_item_width = screenWidth - 20 * 2 * screenWidth / 750
    var vip_desc_center_left=(screenWidth -(520 * screenWidth/750))/2
    var vip_center_left=(screenWidth -(420 * screenWidth/750))/2
    this.setData({
      vip_title_top,
      vip_title_left,
      vip_desc_title_left,
      vip_desc_center_left,
      vip_center_left,
      qy_item_width,
      userInfo: wx.getStorageSync("userInfo")

    })

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