import React from 'react'
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import { useSelector } from "react-redux";
import { type RootState,type AppDispatch } from "../../app/store";
import PdfReportComponent from './PdfReportComponent';
import { fetchAllOrders } from "../../features/orderstatSlice";
import { useDispatch } from "react-redux";
const PdfReport = () => {
        const { chartData: orders } = useSelector((state: RootState) => state.orderstats);
        const dispatch=useDispatch<AppDispatch>();
        React.useEffect(() => {
          dispatch(fetchAllOrders());
          
        }, [dispatch]);
  return (
   <div className="container mt-4">
      <h2>PDF Report Example</h2>

      {/* Download button */}
      <PDFDownloadLink
        document={<PdfReportComponent orders={orders} />}
        fileName="orders-report.pdf"
      >
        {({ loading }) =>
          loading ? "Generating PDF..." : "Download Orders Report"
        }
      </PDFDownloadLink>

      <hr />

      {/* In-page viewer (optional) */}
      <h4>Preview:</h4>
      <div style={{ border: "1px solid #ddd", height: "600px" }}>
        <PDFViewer width="100%" height="600">
          <PdfReportComponent orders={orders} />
        </PDFViewer>
      </div>
    </div>
  )
}

export default PdfReport
