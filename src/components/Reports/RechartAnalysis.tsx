
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
AreaChart,
Area,
ReferenceLine,
} from "recharts";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";
const RechartAnalysis = () => {
 const { order, loading, error } = useSelector((state: RootState) => state.orders);
    
   const monthlyData = useMemo(() => {
     const map: Record<string, number> = {};
     order.forEach((order) => {
       const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
        const monData=order.orderItems.reduce((sum, i:any) => sum+i.quantity*i.price,0);
       // map[month] = (map[month] || 0) + order.totalAmount;
       map[month] = (map[month] || 0) + monData;
     });
 
     return Object.entries(map).map(([month, total]) => ({ month, total }));
   }, [order]);
     console.log(monthlyData)
   if (loading) return <p>Loading charts...</p>;
   if (error) return <p style={{ color: "red" }}>{error}</p>;
 
  return (
    <React.Fragment>
  <div className="container py-4">
<h1 className="h3 mb-4">Recharts + React — Quick Guide & Demo</h1>


<section className="mb-8">
<h2 className="h5">Installation</h2>
<pre className="bg-light p-3 rounded mt-2 text-sm">npm install recharts</pre>
<p className="text-sm mt-2">This demo uses the following imports from <code>recharts</code>:</p>
<code className="block bg-gray-100 p-2 rounded mt-2 text-sm">import {'{'} ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend {'}'} from 'recharts'</code>
</section>


<section className="mb-8">
<h2 className="h5"> Simple Line Chart</h2>
<div className="h-64 bg-white rounded shadow-sm p-3">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
<defs>
<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopOpacity={0.8} />
<stop offset="95%" stopOpacity={0} />
</linearGradient>
</defs>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<ReferenceLine y={2500} stroke="red" label={{ position: 'top', value: 'Target' }} />
<Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
<Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
</LineChart>
</ResponsiveContainer>
</div>
<p className="text-sm mt-2">Notes: <em>dataKey</em> points to object keys in your data array; wrap with ResponsiveContainer for responsive sizing.</p>
</section>


<section className="mb-8">
<h2 className="h5"> Simple Bar Chart</h2>
<div className="h-64 bg-white rounded shadow-sm p-3">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="pv" barSize={20} />
<Bar dataKey="uv" barSize={20} />
</BarChart>
</ResponsiveContainer>
</div>
<p className="text-sm mt-2">Tip: control bar widths with <code>barSize</code> and stacking with <code>stackId</code>.</p>
</section>


<section className="mb-8">
<h2 className="h5">Area Chart with Gradient</h2>
<div className="h-64 bg-white rounded shadow-sm p-3">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
<defs>
<linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
</linearGradient>
</defs>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Legend />
<Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
</AreaChart>
</ResponsiveContainer>
</div>
</section>
</div>
</React.Fragment>
  )
};

export default RechartAnalysis;
