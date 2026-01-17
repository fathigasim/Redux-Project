import React from 'react'
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import { useSelector } from "react-redux";
import { type RootState,type AppDispatch } from "../../app/store";
import PdfOrderByDateReportComponent from './PdfOrderByDateReportComponent';

import { useDispatch } from "react-redux";
//import { Order, OrderByDate } from '../../features/orderSlice';

const OrderByDatePdfReport = () => {
      const orders = useSelector((state: RootState) => state.orders.order);
          //  const dispatch=useDispatch<AppDispatch>();
            // React.useEffect(() => {
            //   dispatch(OrderByDate(''));
              
            // }, [dispatch]);
  return (
 
 

   <div className="container mt-4">
      <h2>PDF Report Example</h2>

      {/* Download button */}
      <PDFDownloadLink
        document={<PdfOrderByDateReportComponent orders={orders} />}
        fileName="ordersByDate-report.pdf"
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
          <PdfOrderByDateReportComponent orders={orders} />
        </PDFViewer>
      </div>
    </div>
   
  )
}

export default OrderByDatePdfReport
