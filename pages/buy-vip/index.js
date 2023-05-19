// pages/vip/index.js
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const dateUtil = require('../../utils/date.js')
import Toast from 'tdesign-miniprogram/toast';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    vipList: [],
    vipBenefits:[]
  },
  queryVIPBenefits(){
    let that = this;

    WXAPI.queryAllVipBenefits().then(function (res) {
      var vipBenefits = res;

      that.setData({
        vipBenefits
      });
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  queryVIPList() {

    let that = this;

    WXAPI.queryVIPList().then(function (res) {
      var vipList = res;

      that.setData({
        vipList
      });
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  goBuy(e) {
    var data = e.currentTarget.dataset.data;

    wx.navigateTo(
      {
        url: "/pages/vip-details/index?data=" + JSON.stringify(data) 
      }
    )

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



    this.queryVIPList();
    this.queryVIPBenefits();

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