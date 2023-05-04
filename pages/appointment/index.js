// pages/appointment/index.js
const WXAPI = require('../../wxapi/main')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    appointmentList:[{"refund":false,"venue_name":"统文如即正经","end_hour":26,"wx_no":"eu occaecat dolore exercitation voluptate","date":"1987-02-14","begin_hour":28,"session":1,"venue_id":61,"id":26,"user_id":20,"cancel":false},{"venue_id":5,"wx_no":"laborum minim pariatur","end_hour":85,"refund":true,"session":2,"venue_name":"电中而最近通","id":14,"cancel":false,"user_id":13,"begin_hour":50,"date":"2021-12-24"},{"date":"1983-02-19","end_hour":55,"user_id":76,"venue_name":"京总点口","cancel":true,"begin_hour":42,"id":42,"session":1,"refund":true,"wx_no":"culpa qui commodo esse","venue_id":71},{"session":2,"user_id":53,"venue_id":68,"cancel":false,"begin_hour":78,"wx_no":"Ut est nulla minim ad","date":"1994-12-20","end_hour":33,"refund":true,"id":97,"venue_name":"场派流人已"},{"venue_id":90,"wx_no":"sint","cancel":false,"begin_hour":31,"id":94,"venue_name":"些也万般必易识","session":2,"refund":false,"end_hour":39,"date":"1978-09-12","user_id":61}],
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    pageNo:1,
    totalNum:null,
    pageSize:10

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
    var that=this;
    WXAPI.queryAppointmentByUser(1,1).then(function(res) {
      var info=res;
      if(info && info.length>0){
            
             that.setData({
                appointmentList:info
             })
          
          }
            
        
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