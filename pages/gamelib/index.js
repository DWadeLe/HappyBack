// pages/gamelib/index.js
const WXAPI = require('../../wxapi/main')
const colorUtil = require('../../utils/color')
const dateUtil = require('../../utils/date')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameList: [
    ],
    tag: {
      value: "-1",
      options: [{
        value: '-1',
        label: '分类',
      },
      {
        value: '动作',
        label: '动作',
      },
      {
        value: '剧情',
        label: '剧情',
      }]
    },
    colorMap: {},
    sorter: {
      value: "-1",
      options: [{
        value: '-1',
        label: '排序',
      },
      {
        value: 'score,2',
        label: '按评分高',
      },
      {
        value: 'score,1',
        label: '按评分低',
      }, {
        value: 'release_time,2',
        label: '按发售时间晚',
      },
      {
        value: 'release_time,1',
        label: '按发售时间早',
      }]
    },
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
  },
  selectCondition() {
    var param = {};
    var tag = this.data.tag.value;
    var sorter = this.data.sorter.value;
    var searchName = this.data.searchName;
    this.setData({
      current_no: 0,
      page_size: 10,
      gameList:[]
    })
    if (tag != "-1")
      param.tag = tag
    if (sorter != "-1") {
      var index = sorter.indexOf(",");
      param.order_type = sorter.substring(0, index - 1);
      param.order_by = sorter.substring(index + 1);
    }
    if (searchName != '')
      param.name = searchName

    this.getGameList(param);
  },


  onPullDownRefresh() {
    var that = this;
    var { current_no, page_size } = this.data;

    this.setData({
      current_no: current_no + page_size
    })
    this.getGameList({ type: this.data.gameType }, () => {
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
      url: "/pages/game-details/index?data=" + JSON.stringify(e.currentTarget.dataset.data)+"&colorMap="+JSON.stringify(this.data.colorMap)
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
          item.release_time=dateUtil.toDate(item.release_time)
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
    var gameType = this.data.gameType;
    var that = this;
    var { current_no, page_size } = this.data;

    this.setData({
      current_no: current_no + page_size
    })
    this.getGameList({ type: gameType });
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