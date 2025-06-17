
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { Dashboard } from "@/components/Dashboard";
import { InsightsPanel } from "@/components/InsightsPanel";

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'dashboard'>('upload');
  const [uploadedData, setUploadedData] = useState<any>(null);

  const handleDataUpload = (data: any) => {
    setUploadedData(data);
    setCurrentView('dashboard');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setUploadedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {currentView === 'upload' ? (
        <>
          <Hero />
          <UploadSection onDataUpload={handleDataUpload} />
        </>
      ) : (
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Your Data Dashboard</h1>
            <button
              onClick={handleBackToUpload}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ← Upload New Data
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Dashboard data={uploadedData} />
            </div>
            <div>
              <InsightsPanel data={uploadedData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
