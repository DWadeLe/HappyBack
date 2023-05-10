// pages/game-details/index.js
const colorUtil = require('../../utils/color')
const app = getApp();
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameDetail:{
      },
      colorMap:{

      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    
    this.setData({
      gameDetail:JSON.parse(e.data),
      colorMap:JSON.parse(e.colorMap)
    })

  },
  getRandomColor(){
    var color=colorUtil.getRandomColor();
    
    return {
      backgroundColor:color
    };
    
  },
  goUrl(e){
      var url=e.currentTarget.dataset.url;
      let lastIndex;
      let bvid;
      try{
        
        lastIndex= url.lastIndexOf("/");
        if(lastIndex==-1){
          bvid=url;
        }else if(lastIndex==url.length-1){

          var url = url.substring(0,lastIndex);
          lastIndex= url.lastIndexOf("/");
          bvid= url.substring(lastIndex + 1);

        }else{
          bvid= url.substring(lastIndex + 1);
        }
      }catch(e){
        console.log(url,e)
        wx.showToast({
          title: '地址异常，跳转失败',
        })
        return;
      }
      const timestamp=new Date().getTime()
      // path: '/index?bvid=BV1hE411k7Ae', // 要跳转的小程序页面路径（可选）

      const path=`pages/video/video?__preload_=${timestamp*10+3}&__key_=${timestamp*10+4}&bvid=${bvid}`
      wx.navigateToMiniProgram({
        appId: 'wx7564fd5313d24844',
        path,
        success: res => {
          console.log('跳转成功')
        }
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