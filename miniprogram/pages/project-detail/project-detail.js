Page({
  data: {
    project: {
      name: '项目名称',
      location: '成都',
      year: '2025',
      type: '私宅',
      images: []
    }
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '项目详情'
    });

    if (options.name) {
      const project = {
        name: options.name,
        location: options.location || '成都',
        year: options.year || '2025',
        type: options.type || '私宅',
        images: []
      };

      // 如果有 images 数据（JSON 字符串），解析它
      if (options.images) {
        try {
          project.images = JSON.parse(decodeURIComponent(options.images));
        } catch (e) {
          project.images = [];
        }
      }

      this.setData({ project });
    }
  },

  contactUs() {
    wx.switchTab({
      url: '/pages/contact/contact'
    });
  },

  // 点击图片预览
  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.project.images,
      current: index
    });
  }
})
