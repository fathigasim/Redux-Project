import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";

import { fetchAllOrders } from "../features/orderstatSlice";
import { Col, Container, Row } from "react-bootstrap";
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Link } from "react-router";
import { FaFileCsv } from "react-icons/fa6";
import { FaRegFileExcel } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfReportComponent from './Reports/PdfReportComponent';
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
import { FaRegFilePdf } from "react-icons/fa6";
const OrderAnalytics: React.FC = () => {
 const dispatch = useDispatch<AppDispatch>();
const { chartData,chartData:orders, loading, error } = useSelector((state: RootState) => state.orderstats);

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
    const monData = item.orderItems?.reduce((sum: number, i: { quantity: number; price: number }) => 
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
      <Row>
        <Col sm={4} md={2} style={{marginTop:20}}>
     
 <CSVLink className="btn btn-primary" data={monthlyData} filename={`${new Date().toLocaleDateString("default", { month: "short" })}-report.csv`}>
   <span><FaFileCsv /> Download CSV</span>
</CSVLink>
</Col>
<Col sm={4} md={2} style={{marginTop:20}}>
 <a href="#" className="btn btn-primary" style={{cursor:'pointer'}} onClick={exportToExcel}>
  <span><FaRegFileExcel /> Download Excel</span></a>
  </Col>
<Col sm={4} md={2}  style={{marginTop:20}}>
  {/* <Link className="btn btn-primary" to="/printPdf"><span><FaRegFilePdf /> Pdf Report</span></Link> */}
    {/* Download button */}
        <PDFDownloadLink className="btn btn-primary" style={{textDecoration:"none"}}
          document={<PdfReportComponent orders={orders} />}
          fileName={`orders-report-${new Date().toISOString().split('T')[0]}.pdf`}
        >
         <span><FaRegFilePdf />  
        {/* {({ loading }) =>
            loading ? "Generating PDF..." : "Download Orders Report"
          } */}
          {loading ?("Generating..."):("Download PDF")}
           
             </span>
        </PDFDownloadLink> 
    
  </Col>

</Row>
    </Container>
    <Container style={{marginTop:50}}>
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
