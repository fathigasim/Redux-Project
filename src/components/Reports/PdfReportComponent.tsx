
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {Font } from '@react-pdf/renderer';

import i18n from "../../i18n";

interface Order {
  orders: any[];
}
Font.register({
  family: "NotoNaskhArabic",
 
  src: "/fonts/NotoNaskhArabic-Regular.ttf",
});
const PdfReportComponent = ({orders}:Order) => {
    
const locale = i18n.language === "ar" ? "ar-SA" : i18n.language;
  return (
 
      <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Order Report</Text>
        </View>

        {orders.map((order, index) => (
          <View key={index} style={styles.section}>
            {/* Order Header - Use View instead of div */}
            <View style={styles.heading}>
              <Text style={styles.text}>Order ID: {order.id}</Text>
              <Text style={styles.text}>User ID: {order.userId}</Text>
              <Text style={styles.text}>
                Total Amount: {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "SAR",
                }).format(order.totalAmount)}
              </Text>
              <Text style={styles.text}>Status: {order.status}</Text>
            </View>

            {/* Items Section - Use View instead of div */}
            <View>
              <Text style={styles.heading}>Items:</Text>
              {order.orderItems && order.orderItems.map((item:any, idx:number) => (
                <View key={idx} style={styles.section}>
                  <Text style={styles.text}>
                    - {item.name}: {item.quantity} x ${item.price}
                  </Text>
                  <Text style={styles.text}>
                    - Total: {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "SAR",
                    }).format(item.quantity * item.price)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export default PdfReportComponent

// MyDocument.jsx
// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
   
    fontFamily: "NotoNaskhArabic",  
 
  },
});

// The PDF layout component
// export default function MyDocument({ orders }) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.section}>
//           <Text style={styles.heading}>Order Report</Text>
//         </View>

//         {orders.map((order, index) => (
//           <View key={index} style={styles.section}>
//             <Text style={styles.text}>Order ID: {order.id}</Text>
//             <Text style={styles.text}>User ID: {order.userId}</Text>
//             <Text style={styles.text}>Total Amount: {order.totalAmount}</Text>
//             <Text style={styles.text}>Status: {order.status}</Text>
//           </View>
//         ))}
//       </Page>
//     </Document>
//   );
// }
