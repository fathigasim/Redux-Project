
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {Font } from '@react-pdf/renderer';

import i18n from "../../i18n";
import { Order, OrderItems } from "../../features/orderSlice";

interface OrderData {
  orders: Order[];
}
Font.register({
  family: "NotoNaskhArabic",
 
  src: "/fonts/NotoNaskhArabic-Regular.ttf",
});
const PdfOrderByDateReportComponent = ({orders}:OrderData) => {
    
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
              <Text style={styles.text}>User ID: </Text>
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
              {order.orderItems && order.orderItems.map((item:OrderItems, idx:number) => (
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

export default PdfOrderByDateReportComponent

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

