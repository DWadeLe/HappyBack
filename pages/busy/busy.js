// pages/category/category.js

const WXAPI = require('../../wxapi/main')
const app = getApp();
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    venueList: [],
    venueWrap: [],
    categorySelected: "",
    venueToView: "",
    userInfo: {}, 
    endTimeVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })

  },
  startTime(e) {
    var that = this;

    WXAPI.startTime(e.currentTarget.dataset.id).then(res => {
      if (res.code == 200) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: "开机成功",
          theme: 'success',
          direction: 'column',
        });
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '开机失败:' + (res.msg || res.message),
          theme: 'error',
          direction: 'column',
        });
      }
      that.initData();

    })
  },
  confirmEndtime(e) {
    var that = this;

    WXAPI.endTime(e.currentTarget.dataset.id).then(res => {
      if (res.order_no) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: "关机成功",
          theme: 'success',
          direction: 'column',
        });
        wx.showLoading({
          title: '前往结算页面中',
        })
        debugger
        setTimeout(() => {
          wx.hideLoading({
            success: (res1) => {
              wx.navigateTo({
                url: `/pages/settlement/index?order_no=${res.order_no}`
              })
            },
          })

        }, 500)
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '开机失败:' + (res.msg || res.message),
          theme: 'error',
          direction: 'column',
        });
      }
      that.initData();
    })
  },
  async endTime(e) {
    var that = this;
    try {
      const res = await wx.showModal({
        title: '确认',
        content: '是否结束当前机位'
      })
      if (res.confirm) {
        that.confirmEndtime(e)
      } else if (res.cancel) {
        return;
      }
    } catch (e) {
      console.error(e)
    }
    
  },
  initData() {
    let that = this;
    wx.showNavigationBarLoading();
    this.getVenueList();
  },
  getVenueList: function () {

    let that = this;

    WXAPI.queryVenue({
    }).then(function (res) {
      var venueList = res;
      //mock 数据
      venueList.forEach((item, index) => {
        item.icon = "../../images/banner/banner" + (index % 3 + 1) + ".jpg";
      })
      that.setData({
        venueList: venueList,
      });

      console.log(venueList);

      wx.hideNavigationBarLoading();
    }).catch((e) => {

      wx.hideNavigationBarLoading();
    });
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/venue-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  scroll: function (e) {

    if (this.categoryClick) {
      this.categoryClick = false;
      return;
    }

    let scrollTop = e.detail.scrollTop;

    let that = this;

    let offset = 0;
    let isBreak = false;

    for (let g = 0; g < this.data.venueWrap.length; g++) {

      let goodWrap = this.data.venueWrap[g];

      offset += 30;

      if (scrollTop <= offset) {

        if (this.data.categoryToView != goodWrap.scrollId) {
          this.setData({
            categorySelected: goodWrap.scrollId,
            categoryToView: goodWrap.scrollId,
          })
        }

        break;
      }


      for (let i = 0; i < goodWrap.venue.length; i++) {

        offset += 91;

        if (scrollTop <= offset) {

          if (this.data.categoryToView != goodWrap.scrollId) {
            this.setData({
              categorySelected: goodWrap.scrollId,
              categoryToView: goodWrap.scrollId,
            })
          }

          isBreak = true;
          break;
        }
      }

      if (isBreak) {
        break;
      }


    }


  }
})