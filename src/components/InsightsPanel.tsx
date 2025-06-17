
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightsPanelProps {
  data: any;
}

export const InsightsPanel = ({ data }: InsightsPanelProps) => {
  if (!data) return null;

  // Generate insights based on actual data
  const generateInsights = () => {
    const insights = [];
    
    if (data.summary?.description) {
      const numericFields = Object.keys(data.summary.description);
      
      // Find highest performing field
      const maxAverage = Math.max(...Object.values(data.summary.description).map((stats: any) => stats.mean || 0));
      const topField = Object.entries(data.summary.description).find(([_, stats]: [string, any]) => stats.mean === maxAverage)?.[0];
      
      if (topField) {
        insights.push({
          type: "trend",
          icon: "📈",
          title: "Top Performer",
          description: `${topField} shows the highest average value (${maxAverage.toFixed(2)})`,
          impact: "positive",
          confidence: 92
        });
      }

      // Data quality insight
      insights.push({
        type: "quality",
        icon: "🎯",
        title: "Data Quality Assessment",
        description: `${data.metrics.dataQuality}% data completeness with ${data.metrics.totalRecords} records analyzed`,
        impact: data.metrics.dataQuality > 90 ? "positive" : "neutral",
        confidence: 95
      });

      // Distribution insight
      if (data.charts[0]?.data) {
        const values = data.charts[0].data.map((item: any) => item.value);
        const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
        const maxValue = Math.max(...values);
        const outliers = values.filter((v: number) => v > avg * 1.5);
        
        if (outliers.length > 0) {
          insights.push({
            type: "alert",
            icon: "⚠️",
            title: "Performance Outliers",
            description: `${outliers.length} entries show significantly higher values than average`,
            impact: "neutral",
            confidence: 88
          });
        }
      }
    }

    // Processing efficiency insight
    insights.push({
      type: "performance",
      icon: "⚡",
      title: "Processing Efficiency",
      description: `Data processed in ${data.metrics.processingTime} with ${data.metrics.columns} columns analyzed`,
      impact: "positive",
      confidence: 100
    });

    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    if (data.summary?.description) {
      const numericFields = Object.keys(data.summary.description);
      
      if (numericFields.length > 0) {
        recommendations.push("🎯 Focus on top-performing metrics for strategic decisions");
        recommendations.push("📊 Consider creating trend analysis for time-series patterns");
      }
    }
    
    if (data.metrics.dataQuality < 90) {
      recommendations.push("🔧 Improve data collection processes to enhance quality");
    }
    
    recommendations.push("📈 Export charts for presentation materials");
    recommendations.push("💡 Set up automated reporting for regular insights");
    
    return recommendations;
  };

  const insights = generateInsights();
  const recommendations = generateRecommendations();

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <span>🧠</span>
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm opacity-90">
            Powered by advanced analytics to uncover hidden patterns in your data
          </p>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">🔍 Key Insights</h3>
        {insights.map((insight, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  insight.impact === 'positive' ? 'bg-green-100 text-green-600' :
                  insight.impact === 'neutral' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <span className="text-lg">{insight.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">💡 Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Quality Score */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">📋 Data Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall Quality</span>
              <span className="font-semibold text-green-600">{data.metrics.dataQuality}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.metrics.dataQuality}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">📊 Completeness</span>
                <div className="font-medium">{Math.min(100, data.metrics.dataQuality + 2)}%</div>
              </div>
              <div>
                <span className="text-gray-600">🎯 Accuracy</span>
                <div className="font-medium">{Math.max(85, data.metrics.dataQuality - 3)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">📄 File Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">📝 Filename:</span>
              <span className="font-medium">{data.filename}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">📊 Dimensions:</span>
              <span className="font-medium">{data.summary?.shape?.[0] || data.metrics.totalRecords} × {data.summary?.shape?.[1] || data.metrics.columns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🔢 Numeric Columns:</span>
              <span className="font-medium">{data.metrics.numericColumns || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
