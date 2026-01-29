
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {Font } from '@react-pdf/renderer';


import { useTranslation } from "react-i18next";
import { Order, OrderItems } from "../../features/orderSlice";
import { text } from "node:stream/consumers";
import NotoNaskhArabic from "../../assets/fonts/NotoNaskhArabic-Regular.ttf";

Font.register({
  family: "NotoNaskhArabic",
  src: NotoNaskhArabic,
});
interface OrderData {
  orders: Order[];
  labels: {
    order: string;
    orderDate: string;
    status: string;
    items: string;
    totalAmount: string;
  };
  locale: string;
}


Font.register({
  family: "NotoNaskhArabic",
  src: NotoNaskhArabic,
});

const PdfOrderByDateReportComponent = ({orders,labels,locale}:OrderData) => {
      // const { i18n, t } = useTranslation('order');
   




  return (
 
      <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ direction: "rtl", textAlign: "right" }}>
          <Text style={styles.heading}>Order Report</Text>
        </View>

        {orders.map((order, index) => (
          <View key={index} style={styles.section}>
            {/* Order Header - Use View instead of div */}
            <View style={styles.heading}>
              <Text style={styles.text}>{labels.order}: {order.id}</Text>
              <Text style={styles.text}>{labels.orderDate} : {order.createdAt}</Text>
              <Text style={styles.text}>
                Total Amount: {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "SAR",
                }).format(order.totalAmount)}
              </Text>
              <Text style={styles.text}>{labels.status}: {order.status}</Text>
            </View>

            {/* Items Section - Use View instead of div */}
            <View>
              <Text style={styles.heading}>{labels.items}:</Text>
              {order.orderItems && order.orderItems.map((item:OrderItems, idx:number) => (
                <View key={idx} style={styles.section}>
                  <Text style={styles.text}>
                    - {item.name}: {item.quantity} x {item.price}
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
  fontFamily: "A",
  textAlign: "right",
  },
  text: {
    fontSize: 12,
   
    fontFamily: "NotoNaskhArabic",  
    direction:"rtl",
    textAlign:"right"
  },
 
  
});

