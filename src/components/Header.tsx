
export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <span className="text-2xl text-white">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Dash</h1>
              <p className="text-sm text-gray-600">AI-Powered Dashboard Generator</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <span>🧠</span>
              <span className="text-sm">AI Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>⚡</span>
              <span className="text-sm">Auto-Generate</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
