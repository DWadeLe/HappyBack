const app = getApp()
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
import Toast from 'tdesign-miniprogram/toast/index';
const dateUtil = require('../../utils/date')

Page({
  data: {
    select: ["select", "", ""],
    display: ["display", "hidden", "hidden"],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userNickName: "",
    window_display: "none",
    msgCode: '',
    serviceNum: '',
    codeDesc: '免费获取',
    loginTip: '',
    login_disabled: 'disabled',
    userId: "",
    integralCount: "",
    hasWelfareInfo: "",
    avatarUrl: "",
    isVip: false,
    isManager: true,
    userInfo: {},
    haveCoupons:false,
      title: "个人中心", // 导航栏标题
    top_color_height:app.globalData.navBarHeight
  },
  onLoad() {

  },
  onShow() {
    wx.showShareMenu();
    // 查看是否授权
    var self = this;
    var hasUserInfo = false;
  
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              hasUserInfo = true;
              console.log(res.userInfo);
              self.setData({
                userNickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl
              });
              wx.setStorageSync("nickName", res.userInfo.nickName);
              wx.setStorageSync("headImgUrl", res.userInfo.avatarUrl);
              self.queryUser(()=>{
                console.log(res)
                WXAPI.addUser({
                  nick_name:res.userInfo.nickName,
                  wx_no:res.cloudId
                }).then(res=>{
                      
                })
              });
        

              
            }
          })
        } else {
          if (wx.getStorageSync('loginRet') != '0') {
            self.setData({
              userNickName: "授权登录",
              avatarUrl: "../../images/user_photo.png"
            })
          } else {
            self.setData({
              userNickName: wx.getStorageSync("nickName"),
              avatarUrl: wx.getStorageSync("headImgUrl")
            });
          }
        }
      }
    });
    if (wx.getStorageSync('loginRet') == '0') {
      self.setData({
        userId: wx.getStorageSync('userInfo').id
      });

    }
    this.getCanUseCouponSize(wx.getStorageSync('userInfo').id);

  },
  goVipCneter(){
       wx.navigateTo({
        url:"/pages/vip/index"
       })
  },
  getCanUseCouponSize(userId){
    var that=this;
    WXAPI.queryCouponsByUser(userId,{
      current_no:0,
      page_size:10,
      status:1
    }).then(function (res) {
      var coupons = res;
      if(coupons.length>0)
         {
          that.setData({
             haveCoupons:true
          })
         }

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  goMap(e) {

    var typeMap = {
      "1": "/pages/order/index",
      "2": "/pages/vip/index",
      "3": "/pages/mycoupons/index",
      "4": "/pages/appointment/index",
      // "5": "/pages/helporder/index",
      "6": "/pages/usecoupons/index",
      // "7": "/pages/startvenue/index",
      // "8": "/pages/endvenue/index",
    }
    wx.navigateTo({
      url: typeMap[e.target.id]
    })

  },
  queryUser(callback) {

    let that = this;

    WXAPI.queryUser().then(function (res) {
      var userInfo = res;
      if(!userInfo && userInfo.id==null){
          callback();
          return;
      }
      userInfo.vip_expire_time=dateUtil.toDate(userInfo.vip_expire_time)
      that.setData({
        userInfo: userInfo,
        isVip: userInfo.vip,
      });
      wx.setStorageSync("userInfo",userInfo);

      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });

  },

  toPayTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _msg = '订单金额: ' + money + ' 元'
        if (res.data.balance > 0) {
          _msg += ',可用余额为 ' + res.data.balance + ' 元'
          if (money - res.data.balance > 0) {
            _msg += ',仍需微信支付 ' + (money - res.data.balance) + ' 元'
          }
        }
        money = money - res.data.balance
        wx.showModal({
          title: '请确认支付',
          content: _msg,
          confirmText: "确认支付",
          cancelText: "取消支付",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              that._toPayTap(orderId, money)
            } else {
              console.log('用户点击取消支付')
            }
          }
        });
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        })
      }
    })
  },
  _toPayTap: function (orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
    }
  }
})