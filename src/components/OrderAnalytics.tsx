import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";

import { fetchAllOrders } from "../features/orderstatSlice";
import { Container } from "react-bootstrap";
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Link } from "react-router";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const OrderAnalytics: React.FC = () => {
 const dispatch = useDispatch<AppDispatch>();
const { chartData, loading, error } = useSelector((state: RootState) => state.orderstats);

useEffect(() => {
  dispatch(fetchAllOrders());
}, [dispatch]);
// Add this debug log
useEffect(() => {
  console.log('chartData:', chartData);
  console.log('Is array?', Array.isArray(chartData));
  console.log('First item:', chartData?.[0]);
  console.log('First item createdAt:', chartData?.[0]?.id);
}, [chartData]);
const monthlyData = useMemo(() => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return [];
  }
  
  const map: Record<string, number> = {};
  
  chartData.forEach((item) => {
    if (!item?.createdAt) return;
    
    const date = new Date(item.createdAt);
    if (isNaN(date.getTime())) return;
    
    const month = date.toLocaleString("default", { month: "short" });
    const monData = item.orderItems?.reduce((sum: number, i: any) => 
      sum + (i.quantity * i.price), 0
    ) || 0;
    
    map[month] = (map[month] || 0) + monData;
  });

  return Object.entries(map).map(([month, total]) => ({ month, total }));
}, [chartData]);


// Excel Export
const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(monthlyData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${new Date().toLocaleDateString("default", { month: "short" })}-report.xlsx`);
};
// Handle loading and error states
if (loading) {
  return <div>Loading chart data...</div>;
}

if (error) {
  return <div>Error loading data: {error}</div>;
}

if(monthlyData.length === 0){
  return <div>No data available for chart.</div>;
}
// Now safe to use monthlyData
  return (
    <>
    <Container>
      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',border:'2px solid firebrick',gap:'4rem',marginTop:'2rem'}}>
 <div style={{flex:1}}><CSVLink data={monthlyData} filename={`${new Date().toLocaleDateString("default", { month: "short" })}-report.csv`}>
   Download CSV
</CSVLink>
 <a href="#" style={{cursor:'pointer'}} onClick={exportToExcel}>Download Excel</a>
  
  <Link to="/printPdf"> Pdf Report</Link>
</div>
</div>
    </Container>
    <Container style={{marginTop:100}}>
    <div className="p-4 space-y-8">
      <h2 className="text-xl font-semibold mb-4">📊 Order Analytics</h2>

      <div style={{ width: "100%", height: 300 }}>
        <h3 className="font-medium mb-2">Monthly Order Totals (Line)</h3>
        <ResponsiveContainer>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h3 className="font-medium mb-2">Monthly Order Totals (Bar)</h3>
        <ResponsiveContainer>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </Container>
    </>
  );
};

export default OrderAnalytics;
