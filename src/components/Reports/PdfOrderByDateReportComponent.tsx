import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image, // <--- 1. Import Image
} from "@react-pdf/renderer";
import Amiri from "../../assets/fonts/Amiri-Regular.ttf";
// 2. Import your logo file here
import LogoImage from "../../assets/logo.jpg"; 
import { Order } from "../../features/orderSlice";
import i18n from "../../i18n";

Font.register({
  family: "Amiri",
  src: Amiri,
});

interface Props {
  orders: Order[];
  locale: string;
  isRTL: boolean;
}

const COL_WIDTHS = {
  product: "45%",
  qty: "15%",
  price: "20%",
  total: "20%",
};
// ... (Imports and register font stay the same)

const PdfOrderByDateReportComponent = ({ orders, locale, isRTL }: Props) => {
  const t = i18n.getFixedT(locale, "order");

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "SAR",
    }).format(n);

  // Helper to handle text alignment dynamically

const getTextAlign = (isRTL: boolean) => (isRTL ? "right" : "left");
  return (
 <Document>
      <Page size="A4" style={[styles.page, { direction: isRTL ? "rtl" : "ltr" }]}>
        
        {/* --- HEADER --- */}
        <View style={[styles.headerContainer, isRTL ? styles.rowRTL : styles.rowLTR]}>
          {/* <View style={styles.logoWrapper}>
            <Image style={styles.logo} src={LogoImage} />
          </View> */}

          {/* Fixed Alignment for Heading */}
          <View style={[styles.headerTextWrapper, { alignItems: isRTL ? "flex-start" : "flex-end" }]}>
            <Text style={[styles.companyName, { textAlign: getTextAlign(isRTL) }]}> Happy Store </Text>
            <Text style={[styles.reportTitle, { textAlign: getTextAlign(isRTL) }]}>{t("Order_Report")}</Text>
            <Text style={[styles.generatedDate, { textAlign: getTextAlign(isRTL) }]}>
              {new Date().toLocaleDateString(locale)}
            </Text>
          </View>
        </View>

        {/* --- ORDERS LIST --- */}
        {orders.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <View style={styles.headerSection}>
              <InfoRow label={t("Order_ID")} value={order.id} isRTL={isRTL} />
              <InfoRow
                label={t("Order_Date")}
                value={new Date(order.createdAt).toLocaleString(locale)}
                isRTL={isRTL}
              />
              <InfoRow label={t("Status")} value={t(order.status)} isRTL={isRTL} />
            </View>

            {/* --- TABLE --- */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader, isRTL ? styles.rowRTL : styles.rowLTR]}>
                <Text style={[styles.cell, styles.colProduct, { textAlign: getTextAlign(isRTL) }]}>{t("Product")}</Text>
                <Text style={[styles.cell, styles.colQty, styles.textCenter]}>{t("Quantity")}</Text>
                <Text style={[styles.cell, styles.colPrice, styles.textCenter]}>{t("Price")}</Text>
                {/* Remove border on the last cell based on direction */}
                <Text style={[styles.cell, styles.colTotal, styles.textCenter, isRTL ? { borderLeftWidth: 0 } : { borderRightWidth: 0 }]}>
                  {t("Total")}
                </Text>
              </View>

              {/* Table Items */}
              {order.orderItems.map((item, i) => (
                <View key={i} style={[styles.tableRow, isRTL ? styles.rowRTL : styles.rowLTR]}>
                  <Text style={[styles.cell, styles.colProduct, { textAlign: getTextAlign(isRTL) }]}>{item.name}</Text>
                  <Text style={[styles.cell, styles.colQty, styles.textCenter]}>{item.quantity}</Text>
                  <Text style={[styles.cell, styles.colPrice, styles.textCenter]}>{money(item.price)}</Text>
                  <Text style={[styles.cell, styles.colTotal, styles.textCenter, isRTL ? { borderLeftWidth: 0 } : { borderRightWidth: 0 }]}>
                    {money(item.quantity * item.price)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

// Fixed InfoRow Sub-component
// Refined InfoRow for crisp alignment
const InfoRow = ({ label, value, isRTL }: any) => (
  <View style={[styles.infoRow, isRTL ? styles.rowRTL : styles.rowLTR]}>
    <Text style={[styles.infoLabel, { textAlign: isRTL ? "right" : "left" }]}>{label}:</Text>
    <Text style={[styles.infoValue, { textAlign: isRTL ? "right" : "left" }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Amiri", fontSize: 10, color: "#333" },
 headerContainer: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    display: 'flex',
    alignItems: "center", 
    justifyContent: "space-between",
  },
  headerTextWrapper: {
    width: "70%",
    display: 'flex',
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    width: '100%', // Ensures textAlign works across the container
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    textDecoration: "underline",
    width: '100%',
  },
  generatedDate: {
    fontSize: 9,
    color: "#888",
    width: '100%',
  },
  logoWrapper: { width: "30%" },
  logo: { width: 60, height: 60, objectFit: "contain" },
 
  orderContainer: { marginBottom: 30 },
  headerSection: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  infoRow: { flexDirection: "row", marginBottom: 4, alignItems: "center" },
  infoLabel: { fontWeight: "bold", width: 80 },
  infoValue: { flex: 1 },
  table: { width: "100%", borderWidth: 1, borderColor: "#e0e0e0" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e0e0e0", minHeight: 24 },
  rowLTR: { flexDirection: "row" },
  rowRTL: { flexDirection: "row-reverse" },
  tableHeader: { backgroundColor: "#f5f5f5" },
  tableFooter: { backgroundColor: "#fafafa" },
  cell: { padding: 5, borderRightWidth: 1, borderRightColor: "#e0e0e0", justifyContent: "center" },
  colProduct: { width: COL_WIDTHS.product },
  colQty: { width: COL_WIDTHS.qty },
  colPrice: { width: COL_WIDTHS.price },
  colTotal: { width: COL_WIDTHS.total, borderRightWidth: 0 },
  textCenter: { textAlign: "center" },
  bold: { fontWeight: "bold" },
  pageNumber: { position: "absolute", fontSize: 8, bottom: 20, left: 0, right: 0, textAlign: "center", color: "grey" },
});
export default PdfOrderByDateReportComponent;