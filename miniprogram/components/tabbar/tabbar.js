Component({
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  data: {},

  methods: {
    switchTab(e) {
      const page = e.currentTarget.dataset.page;
      const pages = [
        '/pages/index/index',
        '/pages/about/about',
        '/pages/projects/projects',
        '/pages/contact/contact'
      ];

      if (page !== this.data.current) {
        wx.switchTab({
          url: pages[page]
        });
      }
    }
  }
})
