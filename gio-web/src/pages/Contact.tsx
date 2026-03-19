const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mt-2">
            联系我们
          </h1>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* 联系信息 */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">联系方式</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-medium text-gray-800">地址</h3>
                    <p className="text-gray-500">四川省成都市锦江区 XXX 路 XXX 号</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-medium text-gray-800">邮箱</h3>
                    <p className="text-gray-500">contact@giosj.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h3 className="font-medium text-gray-800">电话</h3>
                    <p className="text-gray-500">+86 028-XXXXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h3 className="font-medium text-gray-800">工作时间</h3>
                    <p className="text-gray-500">周一至周五 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* 社交媒体 */}
              <div className="mt-10">
                <h3 className="font-medium text-gray-800 mb-4">关注我们</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <span className="text-sm">微</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <span className="text-sm">博</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <span className="text-sm">红</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 联系表单 */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">在线留言</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="请输入您的联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">留言内容</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                    placeholder="请输入您想咨询的内容..."
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-3">
                  提交留言
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 地图 */}
      <section className="h-96 bg-gray-200">
        {/* 这里可以嵌入百度地图或高德地图 */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          地图加载中...
        </div>
      </section>
    </div>
  );
};

export default Contact;
