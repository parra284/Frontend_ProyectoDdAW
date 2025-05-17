import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Navbar from '../components/Navbar';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const InventoryReports = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('stockLevels');
  const [dateRange, setDateRange] = useState('30days');
  const [stockMovements, setStockMovements] = useState([]);
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });
  const [valueData, setValueData] = useState({ labels: [], data: [] });
  
  // Fetch products data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await axios.get('http://localhost:3000/api/products');
        if (productsResponse.status === 200 && productsResponse.data.products) {
          setProducts(productsResponse.data.products);
          
          // Process product data for charts
          processProductData(productsResponse.data.products);
        }
        
        // Fetch stock movements/history (mock data for now)
        // In a real app, we'd call an API for this data
        const mockMovementData = generateMockStockMovements(30);
        setStockMovements(mockMovementData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory report data:', err);
        setError('Failed to load inventory report data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Process products for visualization data
  const processProductData = (products) => {
    // Process category distribution
    const categoryMap = new Map();
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    setCategoryData({
      labels: Array.from(categoryMap.keys()),
      data: Array.from(categoryMap.values())
    });
    
    // Process inventory value by category
    const valueByCategory = new Map();
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      const value = (product.price * product.stock) || 0;
      valueByCategory.set(category, (valueByCategory.get(category) || 0) + value);
    });
    
    setValueData({
      labels: Array.from(valueByCategory.keys()),
      data: Array.from(valueByCategory.values())
    });
  };
  
  // Generate mock stock movement data for demonstration
  const generateMockStockMovements = (days) => {
    const data = [];
    const endDate = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        inStock: Math.floor(Math.random() * 50) + 150,
        lowStock: Math.floor(Math.random() * 20) + 10,
        outOfStock: Math.floor(Math.random() * 10) + 5,
      });
    }
    
    return data;
  };
  
  // Filter stock movements based on date range
  const getFilteredMovements = () => {
    if (!stockMovements || stockMovements.length === 0) return [];
    
    const now = new Date();
    let daysToInclude = 30; // Default
    
    switch (dateRange) {
      case '7days':
        daysToInclude = 7;
        break;
      case '30days':
        daysToInclude = 30;
        break;
      case '90days':
        daysToInclude = 90;
        break;
      default:
        daysToInclude = 30;
    }
    
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - daysToInclude);
    
    return stockMovements.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };
  
  // Stock Levels Bar Chart configuration
  const stockLevelsChartData = {
    labels: products.slice(0, 10).map(product => product.name),
    datasets: [
      {
        label: 'Current Stock',
        data: products.slice(0, 10).map(product => product.stock),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Low Stock Threshold',
        data: products.slice(0, 10).map(product => product.lowStockThreshold || 10),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Category Distribution Pie Chart
  const categoryDistributionData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Products by Category',
        data: categoryData.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Inventory Value by Category
  const inventoryValueData = {
    labels: valueData.labels,
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: valueData.data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Stock Movement Trends Line Chart
  const filteredMovements = getFilteredMovements();
  const stockMovementData = {
    labels: filteredMovements.map(item => item.date),
    datasets: [
      {
        label: 'In Stock',
        data: filteredMovements.map(item => item.inStock),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Low Stock',
        data: filteredMovements.map(item => item.lowStock),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Out of Stock',
        data: filteredMovements.map(item => item.outOfStock),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  // Options for charts
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Stock Levels vs Thresholds (Top 10 Products)'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Distribution by Category'
      }
    },
    maintainAspectRatio: false
  };
  
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Movement Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gain insights into your inventory status and movement trends
          </p>
        </header>
        
        {/* Error state */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Report Data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && !error && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading report data...</span>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Report Selection */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Report Options</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                    Report Type
                  </label>
                  <select
                    id="reportType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="stockLevels">Current Stock Levels</option>
                    <option value="categoryDistribution">Category Distribution</option>
                    <option value="inventoryValue">Inventory Value by Category</option>
                    <option value="stockMovement">Stock Movement Trends</option>
                  </select>
                </div>
                
                {reportType === 'stockMovement' && (
                  <div>
                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <select
                      id="dateRange"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Charts */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="h-72 md:h-96">
                {reportType === 'stockLevels' && (
                  <Bar data={stockLevelsChartData} options={barChartOptions} />
                )}
                
                {reportType === 'categoryDistribution' && (
                  <Pie data={categoryDistributionData} options={pieChartOptions} />
                )}
                
                {reportType === 'inventoryValue' && (
                  <Pie data={inventoryValueData} options={pieChartOptions} />
                )}
                
                {reportType === 'stockMovement' && (
                  <Line data={stockMovementData} options={lineChartOptions} />
                )}
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Key Inventory Metrics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Products
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {products.length}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Inventory Value
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Low Stock Products
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Out of Stock Products
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {products.filter(p => p.stock === 0).length}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Export options */}
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.print()}
              >
                <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => alert('Export functionality would be implemented here.')}
              >
                <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export to CSV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryReports;
