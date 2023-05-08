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
      navHeight: 88, // 顶部导航栏高度
      statusBarHeight: 20, // 状态栏高度
    },
    lifetimes: {
      attached() {
        // 获取设备信息
        const systemInfo = wx.getSystemInfoSync();
        const navHeight = systemInfo.platform === 'android' ? 48 : 44;
        const statusBarHeight = systemInfo.statusBarHeight;
        this.setData({
          navHeight,
          statusBarHeight
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
      }
    }
  });
  