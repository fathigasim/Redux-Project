import React, { useState } from "react";
import { OrderByDate } from "../../features/orderSlice";
import { useAppDispatch } from "../../app/hook";
import { type RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Alert, Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { formatters } from "../../utils/formatters";
import { FaSearch } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfOrderByDateReportComponent from "./PdfOrderByDateReportComponent";
import { FaRegFilePdf } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const OrderDates = () => {
  const { t, i18n } = useTranslation("order");
  const isRTL = i18n.language === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";

  const { loading, error, order } = useSelector((state: RootState) => state.orders);
  const dispatch = useAppDispatch();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(OrderByDate(date));
  };

  return (
    <>
      <Container dir={isRTL ? "rtl" : "ltr"}>
        <Row>
          <Col>
            <h2 className="text-center mb-5">
              {t("Order_Report_By_Date")}
            </h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <label>{t("Search_By_Date")}</label>

              <input
                className="form-control"
                style={{ maxWidth: 200 }}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Button size="sm" type="submit">
                <FaSearch /> {loading ? t("Searching") : t("Search")}
              </Button>
            </form>
          </Col>
        </Row>

        {error && (
          <div className="text-center mt-4">
            <BiSolidError color="red" size={20} /> {t("Error")}
          </div>
        )}
      </Container>

      {/* LOADING */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner animation="border" />
        </div>
      ) : order.length > 0 ? (
        <Container dir={isRTL ? "rtl" : "ltr"}>
          <Row>
            <Col>

              {/* PDF BUTTON */}
              <PDFDownloadLink
                className="btn btn-primary mb-4"
                document={
                  <PdfOrderByDateReportComponent
                    orders={order}
                    locale={locale}
                
                    isRTL={isRTL}
                  />
                }
                fileName={`orders-${date}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <>⏳ {t("Generating")}</>
                  ) : (
                    <>
                      <FaRegFilePdf /> {t("Print_PDF")}
                    </>
                  )
                }
              </PDFDownloadLink>

              {/* ORDERS */}
              {order.map((ord: any) => (
                <Card key={ord.id} className="mb-3">
                  <Card.Header>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <strong>{t("Order_ID")}:</strong> {ord.id}
                      </span>

                      <span>
                        <strong>{t("Order_Date")}:</strong>{" "}
                        {new Date(ord.createdAt).toLocaleString(locale)}
                      </span>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    <table className="table text-center">
                      <thead>
                        <tr>
                          <th>{t("Product")}</th>
                          <th>{t("Quantity")}</th>
                          <th>{t("Price")}</th>
                          <th>{t("Total")}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {ord.orderItems.map((item: any) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>
                              {formatters.currency(item.quantity * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card.Body>

                  <Card.Footer>
                    <strong>
                      {t("Order_Total")} : {formatters.currency(ord.totalAmount)}
                    </strong>
                  </Card.Footer>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      ) : (
        <Alert className="text-center mt-4">{t("No_Data")}</Alert>
      )}
    </>
  );
};

export default OrderDates;
