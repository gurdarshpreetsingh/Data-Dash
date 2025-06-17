
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  data: any;
}

export const Dashboard = ({ data }: DashboardProps) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#ff6b6b', '#4ecdc4', '#45b7d1'];

  if (!data) return null;

  const renderChart = (chart: any, index: number) => {
    if (chart.type === 'pie') {
      return (
        <Card key={index} className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{chart.title}</CardTitle>
            <Button variant="outline" size="sm">
              <span>💾</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chart.data.map((entry: any, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Value']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    } else if (chart.type === 'bar') {
      return (
        <Card key={index} className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{chart.title}</CardTitle>
            <Button variant="outline" size="sm">
              <span>💾</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.metrics.totalRecords.toLocaleString()}</div>
            <div className="text-sm opacity-90">📊 Total Records</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.metrics.columns}</div>
            <div className="text-sm opacity-90">📋 Data Columns</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.metrics.dataQuality}%</div>
            <div className="text-sm opacity-90">✅ Data Quality</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{data.metrics.processingTime}</div>
            <div className="text-sm opacity-90">⚡ Processing Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      {data.summary && Object.keys(data.summary.description).length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">📈 Statistical Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.summary.description).map(([column, stats]: [string, any]) => (
                <div key={column} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{column}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>📊 Count: {stats.count}</div>
                    <div>📊 Mean: {stats.mean?.toFixed(2)}</div>
                    <div>📊 Min: {stats.min}</div>
                    <div>📊 Max: {stats.max}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.charts.map((chart: any, index: number) => renderChart(chart, index))}
      </div>

      {/* Raw Data Preview */}
      {data.rawData && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">🔍 Data Preview (First 5 rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(data.rawData[0] || {}).map((header) => (
                      <th key={header} className="text-left p-2 font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rawData.slice(0, 5).map((row: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {Object.values(row).map((value: any, idx: number) => (
                        <td key={idx} className="p-2">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
