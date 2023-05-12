// pages/gamelib/index.js
const WXAPI = require('../../wxapi/main')
const colorUtil = require('../../utils/color')
const dateUtil = require('../../utils/date')
const app = getApp();
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameList: [
    ],
    tag: {
      value: "-1",
      options: [
        { text: '全部', value: '-1' }, {
          value: '0',
          text: '新上架',
          icon: "/images/icon/hot.png"
        },
        { text: '聚会', value: '聚会' },
        { text: '动作', value: '动作' },
        { text: '角色扮演', value: '角色扮演' },
        { text: '冒险', value: '冒险' },
        { text: '射击', value: '射击' },
        { text: '策略', value: '策略' },
        { text: '横版过关', value: '横版过关' },
        { text: '益智', value: '益智' },
        { text: '模拟', value: '模拟' },
        { text: '体育', value: '体育' },
        { text: '即时战略', value: '即时战略' },
        { text: '音乐', value: '音乐' },
        { text: '赛车', value: '赛车' },
        { text: '训练', value: '训练' },
        { text: '国行', value: '国行' },
        { text: '恋爱', value: '恋爱' },
        { text: '文字冒险', value: '文字冒险' },
        { text: '像素', value: '像素' },
        { text: '解谜', value: '解谜' },
        { text: '街机', value: '街机' },
        { text: '恐怖', value: '恐怖' },
        { text: '独立', value: '独立' },
        { text: '休闲', value: '休闲' },
        { text: '桌游', value: '桌游' },
        { text: '飞行', value: '飞行' },
        { text: '球类', value: '球类' },
        { text: '体感', value: '体感' }
      ]

    },
    activeTitleStyle:{
      fontSize:"1.5rem",
      fontWeight:"bold"
    },
    colorMap: {},
    sorter: {
      value: "-1",
      options: [{
        value: '-1',
        text: '排序',
      },
      {
        value: 'score,2',
        text: '评分',
      },
      {
        value: 'release_time,2',
        text: '发售时间',
      }
      ]
    },
    themeColor: app.globalData.themeColor,
    gameType: 1,
    normalSearch: true,
    baseRefresh: {
      value: false,
    },
    loadingProps: {
      size: '50rpx',
    },
    backTopVisible: false,
    current_no: 0,
    page_size: 10,
    isLastPage: false,
    vipTip: false,
    vipTipTop: app.globalData.navBarHeight
  },
  closeNoticeNar() {
    this.setData({
      vipTip: false
    })
  },
  selectCondition(callback) {
    var param = {};
    var tag = this.data.tag.value;
    var sorter = this.data.sorter.value;
    var searchName = this.data.searchName;
    this.setData({
      current_no: 0,
      page_size: 10,
      gameList: [],
      isLastPage: false
    })
    if (tag && tag != "-1") {
      param.tag = tag
      if (tag == 0) {
        this.setData({
          vipTip: true
        })
      }
    }

    if (sorter && sorter != "-1") {
      var index = sorter.indexOf(",");
      param.order_by = sorter.substring(0, index);
      param.order_type = sorter.substring(index + 1);
    }
    if (searchName && searchName != '')
      param.name = searchName
    param.type = this.data.gameType
    this.getGameList(param, callback);
  },


  onPullDownRefresh() {

    this.selectCondition(() => {
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
  showHighSearch() {

    this.setData({
      normalSearch: false
    })
  },
  hideHighSearch() {

    this.setData({
      normalSearch: true
    })
  },
  toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/game-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data) + "&colorMap=" + JSON.stringify(this.data.colorMap)
    })

  },
  search() {

  },
  onTagChange(e) {
    var tag = this.data.tag;
    tag.value = e.detail.value;
    this.setData({
      tag
    });
    this.selectCondition()
  },
  onSorterChange(e) {
    var sorter = this.data.sorter;
    sorter.value = e.detail.value;
    this.setData({
      sorter
    });
    this.selectCondition()

  },
  onTabsClick(e) {
    var gameType = e.detail.value;
    this.setData({
      gameType,
      current_no: 0,
      page_size: 10,
      isLastPage: false,
      gameList: []
    });
    this.getGameList({ type: gameType });
  },

  getGameList(param) {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多的数据'
      })
      return;
    }
    var that = this;
    var { current_no, page_size, colorMap } = this.data;

    const realParam = Object.assign({}, param, { current_no, page_size });
    console.log(realParam)
    WXAPI.queryGame(realParam).then(function (res) {

      var gameList = res;

      if (gameList.length > 0) {
        gameList.forEach(item => {
          //处理显示颜色

          if (item.tag_list && item.tag_list.length > 0) {
            item.tag_list.forEach(tag => {
              if (!colorMap[tag])
                colorMap[tag] = colorUtil.getRandomColor()
            })
          }
          //处理时间
          item.release_time = dateUtil.toDate(item.release_time)

        })
        var newList = that.data.gameList.concat(gameList);
        that.setData({
          gameList: newList,
          colorMap
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
  onReachBottom() {
    var { current_no, page_size } = this.data;
    this.setData({
      current_no: current_no + page_size
    })
    this.selectCondition();
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
      gameList: []
    })
    this.getGameList({ type: this.data.gameType });
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