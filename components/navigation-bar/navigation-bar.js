// const app = getApp()
// Component({
//     properties: {
//         // defaultData（父页面传递的数据-就是引用组件的页面）
//         defaultData: {
//             type: Object,
//             value: {
//                 title: "我是默认标题"
//             },
//             observer: function(newVal, oldVal) {}
//         }
//     },
//     data: {
//         navBarHeight: app.globalData.navBarHeight,
//         menuRight: app.globalData.menuRight,
//         menuTop: app.globalData.menuTop,
//         menuHeight: app.globalData.menuHeight,
        
//     },
//     attached: function() {},
//     methods: {
//         scanCode(){
//             wx.scanCode({
//                 onlyFromCamera: false, // 是否只能从相机扫码，不允许从相册选择图片，默认是false
//                 success (res) {
//                     console.log(res)
//                 }
//               })
//         }
//     }
// })
// 顶部导航栏组件的 JS 代码
const app = getApp()

Component({
    options: {
      addGlobalClass: true,
      multipleSlots: true
    },
    properties: {
      title: {
        type: String,
        value: ''
      }
    },
    data: {
      statusBarHeight: 20, // 状态栏高度
      navBarHeight: app.globalData.navBarHeight,
      rightLeft:'',
      centerLeft:'',
      top:"",
      isCanBack:false,
    },
    lifetimes: {
      attached() {
        // 获取设备信息
        const systemInfo = wx.getSystemInfoSync();
        const statusBarHeight = systemInfo.statusBarHeight;
        const screenWidth=systemInfo.screenWidth;
         //自定义上面的导航栏
          // 获取系统信息
          // 胶囊按钮位置信息
          const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
          // 导航栏高度 = 状态栏高度 + 44
        var menuRight = systemInfo.screenWidth - menuButtonInfo.right;
        var menuTop= menuButtonInfo.top;
        var top=menuButtonInfo.top;
        var menuHeight = menuButtonInfo.height;
        var   navBarHeight = systemInfo.statusBarHeight + 44;
        var menuWidth=screenWidth-menuButtonInfo.width
        var centerLeft=(menuButtonInfo.left-32) /2 ;
        var rightLeft=menuButtonInfo.left-32;
        var rightWidth=menuButtonInfo.width;
                // 获取页面栈
        const pages = getCurrentPages();
        // 获取当前页面的索引
        const currentIndex = pages.length - 1;
        this.setData({
          menuRight,
          menuTop,
          menuHeight,
          navBarHeight,
          statusBarHeight,
          centerLeft,
          rightLeft,
          top,
          rightWidth,
          isCanBack:currentIndex > 0
        });
      }
    },
    methods: {
      scanCode() {
        // 扫一扫操作
        wx.scanCode({
                            onlyFromCamera: false, // 是否只能从相机扫码，不允许从相册选择图片，默认是false
                            success (res) {
                                console.log(res)
                            }
                          })
      },
      back(){
        wx.navigateBack({
          delta: 1 // 返回上一个页面
        })
      }
    }
  });
  