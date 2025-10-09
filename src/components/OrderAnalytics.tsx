import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";
import { fetchOrders } from "../features/orderSlice";
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
  const { order, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // 📊 Prepare monthly data
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    order.forEach((order) => {
      const month = new Date(order.orderDate).toLocaleString("default", { month: "short" });
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

      <div style={{ width: "100%", height: 300 }}>
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
  );
};

export default OrderAnalytics;
