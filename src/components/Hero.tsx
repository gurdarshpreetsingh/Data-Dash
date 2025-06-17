
export const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Transform Your Data Into
            <br />
            Interactive Dashboards
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your data and watch as AI creates beautiful, interactive dashboards with automated insights, 
            trend analysis, and smart chart recommendations—no technical expertise required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-white">📤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Upload</h3>
              <p className="text-gray-600">Drag and drop your CSV, Excel, or JSON files. We handle the rest automatically.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Visualization</h3>
              <p className="text-gray-600">AI analyzes your data and automatically selects the best chart types and layouts.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl text-white">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Insights</h3>
              <p className="text-gray-600">Get automated insights, trend analysis, and actionable recommendations.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="animate-bounce">
              <span className="text-2xl text-indigo-600">👇</span>
            </div>
            <span className="ml-2 text-lg font-medium text-indigo-600">Start by uploading your data below</span>
          </div>
        </div>
      </div>
    </section>
  );
};
