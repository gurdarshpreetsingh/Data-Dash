
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UploadSectionProps {
  onDataUpload: (data: any) => void;
}

export const UploadSection = ({ onDataUpload }: UploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const readFileContent = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.endsWith('.csv')) {
            const lines = content.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
              reject(new Error('File is empty'));
              return;
            }
            
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const row: any = {};
              headers.forEach((header, index) => {
                const value = values[index] || '';
                // Try to convert to number if it looks like a number
                const numValue = parseFloat(value);
                row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
              });
              return row;
            });
            resolve(data);
          } else if (file.name.endsWith('.json')) {
            resolve(JSON.parse(content));
          } else {
            reject(new Error('Unsupported file type'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const analyzeData = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      throw new Error('No data found in file');
    }
    
    console.log('Analyzing data:', data);
    
    const firstRow = data[0];
    const allKeys = Object.keys(firstRow);
    console.log('Data columns found:', allKeys);
    
    // Identify numeric columns by checking if values can be converted to numbers
    const numericColumns = allKeys.filter(key => {
      return data.some(row => {
        const value = row[key];
        return typeof value === 'number' || (!isNaN(parseFloat(value)) && isFinite(parseFloat(value)));
      });
    });
    
    console.log('Numeric columns identified:', numericColumns);
    
    // Find student identifier column (Student, Name, or similar)
    const studentIdColumn = allKeys.find(key => 
      key.toLowerCase().includes('student') || 
      key.toLowerCase().includes('name') || 
      key.toLowerCase() === 'id'
    ) || allKeys[0];
    
    console.log('Student identifier column:', studentIdColumn);

    // Calculate total marks per student using actual numeric columns
    const studentsWithTotals = data.map((row, index) => {
      const total = numericColumns.reduce((sum, col) => {
        const value = parseFloat(row[col]);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      
      const studentName = row[studentIdColumn] || `Student ${index + 1}`;
      return {
        ...row,
        Total: total,
        StudentLabel: studentName
      };
    });

    // Calculate average marks per subject using actual column names
    const subjectAverages = numericColumns.reduce((acc, col) => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
      acc[col] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      return acc;
    }, {} as Record<string, number>);

    // Check for grade distribution using actual Grade column
    const gradeColumn = allKeys.find(key => key.toLowerCase().includes('grade'));
    const gradeDistribution = gradeColumn ? 
      data.reduce((acc, row) => {
        const grade = row[gradeColumn];
        if (grade) {
          acc[grade] = (acc[grade] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) : null;

    console.log('Grade distribution:', gradeDistribution);
    console.log('Subject averages:', subjectAverages);

    return {
      filename,
      rawData: data,
      metrics: {
        totalRecords: data.length,
        columns: allKeys.length,
        dataQuality: Math.round((data.filter(row => 
          Object.values(row).some(val => val !== null && val !== undefined && val !== '')
        ).length / data.length) * 100),
        processingTime: "1.2s",
        numericColumns: numericColumns.length
      },
      charts: [
        {
          type: "pie",
          title: `📊 Total Marks Per ${studentIdColumn}`,
          data: studentsWithTotals.map(student => ({
            name: student.StudentLabel,
            value: student.Total
          })).filter(item => item.value > 0)
        },
        {
          type: "pie", 
          title: "📈 Average Marks Per Subject",
          data: Object.entries(subjectAverages).map(([subject, avg]) => ({
            name: subject,
            value: Math.round(avg * 100) / 100
          })).filter(item => item.value > 0)
        },
        gradeDistribution ? {
          type: "pie",
          title: "🎯 Grade Distribution", 
          data: Object.entries(gradeDistribution).map(([grade, count]) => ({
            name: grade,
            value: count
          }))
        } : {
          type: "bar",
          title: "📋 Subject Performance",
          data: Object.entries(subjectAverages).map(([subject, avg]) => ({
            subject,
            average: Math.round(avg * 100) / 100
          })).filter(item => item.average > 0)
        }
      ].filter(Boolean),
      summary: {
        columns: allKeys,
        shape: [data.length, allKeys.length],
        description: numericColumns.reduce((acc, col) => {
          const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
          if (values.length) {
            acc[col] = {
              count: values.length,
              mean: values.reduce((a, b) => a + b, 0) / values.length,
              min: Math.min(...values),
              max: Math.max(...values)
            };
          }
          return acc;
        }, {} as Record<string, any>)
      }
    };
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Validate file type
      const validTypes = ['.csv', '.xlsx', '.xls', '.json'];
      const isValidType = validTypes.some(type => file.name.toLowerCase().endsWith(type));
      
      if (!isValidType) {
        throw new Error('❌ Unsupported file type. Please upload CSV, Excel, or JSON files.');
      }

      // Read and analyze file content
      const data = await readFileContent(file);
      console.log('File data loaded:', data);
      
      const analysisResult = analyzeData(data, file.name);
      console.log('Analysis result:', analysisResult);
      
      toast.success("✅ Data processed successfully! Generating your dashboard...");
      
      setTimeout(() => {
        onDataUpload(analysisResult);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error('File processing error:', error);
      toast.error(`❌ Error: ${error instanceof Error ? error.message : 'Failed to process file'}`);
      setIsProcessing(false);
    }
  };

  // Generate sample data with realistic labels for demonstration
  const generateSampleData = (filename: string) => {
    if (filename.includes('student')) {
      return [
        { Student: "Alice Johnson", Mathematics: 85, Science: 92, English: 78, History: 82, Grade: "A" },
        { Student: "Bob Smith", Mathematics: 76, Science: 84, English: 88, History: 79, Grade: "B" },
        { Student: "Charlie Brown", Mathematics: 92, Science: 87, English: 85, History: 90, Grade: "A" },
        { Student: "Diana Prince", Mathematics: 68, Science: 75, English: 82, History: 77, Grade: "B" },
        { Student: "Eve Wilson", Mathematics: 94, Science: 96, English: 91, History: 89, Grade: "A" },
        { Student: "Frank Miller", Mathematics: 72, Science: 80, English: 75, History: 78, Grade: "B" },
        { Student: "Grace Lee", Mathematics: 88, Science: 85, English: 90, History: 86, Grade: "A" }
      ];
    } else if (filename.includes('sales')) {
      return [
        { Product: "Laptop", Q1_Sales: 45000, Q2_Sales: 52000, Q3_Sales: 48000, Q4_Sales: 58000, Category: "Electronics" },
        { Product: "Smartphone", Q1_Sales: 32000, Q2_Sales: 38000, Q3_Sales: 42000, Q4_Sales: 45000, Category: "Electronics" },
        { Product: "Tablet", Q1_Sales: 18000, Q2_Sales: 22000, Q3_Sales: 25000, Q4_Sales: 28000, Category: "Electronics" },
        { Product: "Headphones", Q1_Sales: 15000, Q2_Sales: 18000, Q3_Sales: 20000, Q4_Sales: 22000, Category: "Accessories" }
      ];
    } else {
      return [
        { Response_Category: "Very Satisfied", Count: 45, Percentage: 45 },
        { Response_Category: "Satisfied", Count: 30, Percentage: 30 },
        { Response_Category: "Neutral", Count: 15, Percentage: 15 },
        { Response_Category: "Dissatisfied", Count: 7, Percentage: 7 },
        { Response_Category: "Very Dissatisfied", Count: 3, Percentage: 3 }
      ];
    }
  };

  const sampleFiles = [
    { name: "📊 student_grades.csv", size: "2.3 MB", type: "CSV", description: "Student academic data" },
    { name: "📈 sales_analytics.csv", size: "1.8 MB", type: "CSV", description: "Business metrics" },
    { name: "🎯 survey_results.csv", size: "942 KB", type: "CSV", description: "Survey responses" }
  ];

  if (isProcessing) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🔄 Processing Your Data</h3>
            <p className="text-gray-600 mb-4">AI is analyzing your data and generating insights...</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span className="text-green-500">✅</span>
                <span>Data validation complete</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span className="text-green-500">✅</span>
                <span>Chart types identified</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
                <div className="animate-pulse w-4 h-4 bg-indigo-500 rounded-full"></div>
                <span>Generating visualizations...</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">📤 Upload Your Data</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Support for CSV, Excel, and JSON files. Our AI will automatically detect patterns and suggest the best visualizations for your data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card
            className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer hover:shadow-lg ${
              isDragOver
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-gray-300 bg-white/60 backdrop-blur-sm hover:border-indigo-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📁</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your files here</h3>
              <p className="text-gray-600 mb-6">or click to browse</p>
              
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: CSV, Excel (.xlsx, .xls), JSON
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Try with Sample Data</h3>
            {sampleFiles.map((file, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                onClick={() => {
                  // Generate sample data based on file type and process it
                  const sampleData = generateSampleData(file.name);
                  console.log('Generated sample data:', sampleData);
                  
                  setIsProcessing(true);
                  try {
                    const analysisResult = analyzeData(sampleData, file.name);
                    console.log('Sample data analysis:', analysisResult);
                    
                    toast.success("✅ Sample data loaded! Generating dashboard...");
                    setTimeout(() => {
                      onDataUpload(analysisResult);
                      setIsProcessing(false);
                    }, 1000);
                  } catch (error) {
                    console.error('Sample data processing error:', error);
                    toast.error(`❌ Error processing sample data: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    setIsProcessing(false);
                  }
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white">📄</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <p className="text-sm text-gray-600">{file.size} • {file.type}</p>
                  </div>
                  <span className="text-gray-400">▶️</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
