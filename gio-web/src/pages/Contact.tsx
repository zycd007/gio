const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <section className="bg-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label">Contact Us</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest text-white mt-2">
            联系我们
          </h1>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* 联系信息 */}
            <div>
              <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-6 md:mb-8">联系方式</h2>
              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-2xl flex-shrink-0">📍</div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">地址</h3>
                    <p className="text-gray-500 text-sm md:text-base">四川省成都市锦江区 XXX 路 XXX 号</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-2xl flex-shrink-0">📧</div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">邮箱</h3>
                    <p className="text-gray-500 text-sm md:text-base">contact@gio-light.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-2xl flex-shrink-0">📱</div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">电话</h3>
                    <a href="tel:+86028XXXXXXXX" className="text-primary hover:underline text-sm md:text-base">
                      +86 028-XXXXXXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-2xl flex-shrink-0">⏰</div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">工作时间</h3>
                    <p className="text-gray-500 text-sm md:text-base">周一至周五 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* 社交媒体 */}
              <div className="mt-8 md:mt-10">
                <h3 className="font-medium text-gray-800 mb-4 text-sm md:text-base">关注我们</h3>
                <div className="flex gap-3 md:gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.194 14.197c0-.506-.043-.895-.129-1.167.401-.506.615-1.103.615-1.79 0-.776-.258-1.446-.772-2.01.258-.97.193-1.938-.193-2.907-.257-.048-.549-.024-.88.072a8.15 8.15 0 00-1.544-.48c-.537-.12-1.073-.18-1.609-.18-1.802 0-3.332.601-4.59 1.803-.773-.12-1.545-.12-2.317 0-1.223-.12-2.446 0-3.67.361-.258 1.397-.15 2.698.323 3.901a3.17 3.17 0 00-.451 1.622c0 .67.194 1.267.58 1.79-.129.362-.194.748-.194 1.167 0 .938.323 1.743.968 2.416.645.673 1.416 1.085 2.317 1.235.322 1.323.968 2.38 1.932 3.173.967.792 2.103 1.188 3.412 1.188.967 0 1.867-.217 2.703-.65a5.844 5.844 0 002.188-1.802c.515-.072.967-.253 1.352-.541.387-.289.687-.637.903-1.045.215-.408.322-.845.322-1.31 0-.506-.107-.947-.322-1.323.085-.253.128-.529.128-.819zM16.17 16.79c-.537.578-1.223.867-2.059.867-.837 0-1.523-.289-2.06-.867-.537-.578-.806-1.304-.806-2.178 0-.875.269-1.6.806-2.178.537-.578 1.223-.867 2.06-.867.836 0 1.522.289 2.059.867.537.578.806 1.303.806 2.178 0 .874-.269 1.6-.806 2.178z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.615 14.615c-.195.195-.512.195-.707 0l-1.896-1.896a.75.75 0 00-.53-.22h-.54a3.003 3.003 0 01-3-3v-.54a.75.75 0 00-.22-.53l-1.896-1.896a.5.5 0 010-.707l.354-.354a.5.5 0 01.707 0l1.896 1.896c.14.14.22.33.22.53v.54c0 .827.673 1.5 1.5 1.5h.54c.2 0 .39.08.53.22l1.896 1.896a.5.5 0 010 .707l-.354.354z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* 联系表单 */}
            <div>
              <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-6 md:mb-8">在线留言</h2>
              <form className="space-y-5 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 md:py-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-sm"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 md:py-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-sm"
                    placeholder="请输入您的联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 md:py-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-sm"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">留言内容</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 md:py-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none rounded-sm"
                    placeholder="请输入您想咨询的内容..."
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-3 md:py-4 active:scale-[0.98] transition-transform">
                  提交留言
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 地图 - 占位区域，实际接入可替换为真实地图组件 */}
      <section className="h-64 md:h-96 bg-gray-100 relative">
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-sm">地图区域</span>
        </div>
      </section>
    </div>
  );
};

export default Contact;
