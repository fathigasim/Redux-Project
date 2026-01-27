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
        // Detect production
  const isDevelopment = process.env.NODE_ENV === "development";
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
            {/* Only show preview in development */}
      {isDevelopment && (
        <>
          <h4>Preview (Development Only):</h4>
      <h4>Preview:</h4>
      <div style={{ border: "1px solid #ddd", height: "600px" }}>
        <PDFViewer width="100%" height="600">
          <PdfReportComponent orders={orders} />
        </PDFViewer>
      </div>
      </>
      )}
    </div>
  )
}

 export default PdfReport
// import React from 'react';
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import { Document, Page, Text } from '@react-pdf/renderer';

// // Define the PDF document as a component
// const TestPdfDocument = () => (
//   <Document>
//     <Page>
//       <Text>Test</Text>
//     </Page>
//   </Document>
// );

// // Main component
// const PdfReport = () => {
//   return (
//     <div className="container mt-4">
//       <h2>PDF Report</h2>
      
//       <PDFDownloadLink document={<TestPdfDocument />} fileName="test.pdf">
//         {({ loading }) => (loading ? "Generating PDF..." : "Download Test PDF")}
//       </PDFDownloadLink>
//     </div>
//   );
// };

// export default PdfReport;