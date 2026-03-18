Page({
  data: {
    project: {
      name: '项目名称',
      location: '成都',
      year: '2025',
      type: '私宅'
    }
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '项目详情'
    });

    if (options.name) {
      this.setData({
        project: {
          name: options.name,
          location: options.location || '成都',
          year: options.year || '2025',
          type: options.type || '私宅'
        }
      });
    }
  },

  contactUs() {
    wx.switchTab({
      url: '/pages/contact/contact'
    });
  }
})
