import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import {BsCartPlus} from 'react-icons/bs';

import {Card,Row,Form,Col} from 'react-bootstrap';
import {
  fetchProcProducts,

  clearMessages,

} from "../features/productSlice";



import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import i18next from "i18next";
import "./Products.css";
import "./imagestyle.css"
import Paginationbootstrap from "./Paginationbootstrap";






// interface Props {
//   language: "en" | "ar";
// }

const ProductTest= () => {
  
  const { i18n, t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {error, success, totalRecords,maxPrice ,searchTerm, pageProcNumber, pageProcSize,productProcDto } =
    useSelector((state: RootState) => state.products);
   
  const [localSearch, setLocalSearch] = useState(searchTerm ?? "");
 // const [localMinPrice, setLocalMinPrice] = useState(minPrice ?? null);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice ?? null);
  const [debouncedSearch] = useDebounce(localSearch, 500);
  //const [debouncedMin] = useDebounce(localMinPrice, 500);
  const [debouncedMax] = useDebounce(localMaxPrice, 500);

  // --- Initial load
  
useEffect(() => {
  const search = searchParams.get("search") || "";
   const maxpriceParam =searchParams.get("maxPrice") || null;
   // const minpriceParam =searchParams.get("minprice");
  const pageParam = Number(searchParams.get("page")) || 1;

 
  dispatch(fetchProcProducts({ searchTerm: search,maxPrice:maxpriceParam ,page: pageParam }));
}, [dispatch, searchParams]);
// useEffect(() => {
//   const s = String(debouncedSearch);
//   const currentSearch = searchParams.get("search") || "";
  
//   if (s !== currentSearch) {
//     setSearchParams(prev => {
//       const params = Object.fromEntries(prev);
//       return {
//         ...params,
//         search: s,
//         page: "1",
//       };
//     });
//   }
// }, [debouncedSearch, searchParams, setSearchParams]);

// useEffect(() => {
//   const mx = String(debouncedMax);
//   const currentMaxPrice = searchParams.get("maxPrice") || "";
  
//   if (mx !== currentMaxPrice) {
//     setSearchParams(prev => {
//       const params = Object.fromEntries(prev);
//       return {
//         ...params,
//         maxPrice: mx,
//         page: "1",
//       };
//     });
//   }
// }, [debouncedMax, searchParams, setSearchParams]);

useEffect(() => {
  const s = String(debouncedSearch || "");
  const mx = String(debouncedMax || "");
  //const mn = String(debouncedMin || "");
  
  const currentSearch = searchParams.get("search") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  //const currentMinPrice = searchParams.get("minPrice") || "";
  
  // Check if any value has changed
  const hasChanges = 
    s !== currentSearch || 
    mx !== currentMaxPrice;
   // mn !== currentMinPrice;
  
  if (hasChanges) {
    const params = {
      ...Object.fromEntries(searchParams),
      search: s,
      maxPrice: mx,
      //minPrice: mn,
      page: "1",
    };
    setSearchParams(params);
  }
}, [debouncedSearch, debouncedMax, searchParams, setSearchParams])

// useEffect(() => {
//   const s = String(debouncedSearch);
//   //const mx = String(debouncedMax);
//   //const mn = String(debouncedMin);
//   const currentSearch = searchParams.get("search") || "";
//   //const currentMaxPriceSearch = searchParams.get("maxPrice") || null;
//   if (s !== currentSearch  ) {
//     const params = {
//       ...Object.fromEntries(searchParams),
//       search: s,
//      // maxPrice: mx,
//      // minPrice: mn,
//       page: "1",
//     };
//     setSearchParams(params);
//   }
// }, [debouncedSearch]);
// useEffect(() => {
//   //const s = String(debouncedSearch);
//   const mx = String(debouncedMax);
//   //const mn = String(debouncedMin);
//   //const currentSearch = searchParams.get("search") || "";
//   const currentMaxPriceSearch = searchParams.get("maxPrice") || null;
//   if (mx !== currentMaxPriceSearch  ) {
//     const params = {
//       ...Object.fromEntries(searchParams),
//      // search: s,
//       maxPrice: mx,
//      // minPrice: mn,
//       page: "1",
//     };
//     setSearchParams(params);
//   }
// }, [debouncedMax]);
  // --- Toast notifications
  useEffect(() => {
    if (error) {
    //  toast.error(error);
      dispatch(clearMessages());
    }
    if (success) {
     // toast.success(success);
      dispatch(clearMessages());
    }
  }, [dispatch,error, success]);











  const totalPages = Math.ceil(totalRecords / pageProcSize);
  console.log(productProcDto)
  return (
    <>
 
    <div></div>
    <Container  fluid="md" style={{marginTop:30,fontFamily:'intel-one-mono-roboto'}}>
 <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          {/* <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Name
          </Form.Label> */}
          <Form.Control
            className="mb-2"
            id="inlineFormInput"
            type="text"
            placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          {/* <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Name
          </Form.Label> */}
          <Form.Control
            className="mb-2"
            id="inlineFormInputPriceMax"
            type="text"
            placeholder={"Max Price"}
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
          />
        </Col>
        {/* <Col xs="auto">
        
          <Form.Select defaultValue="Choose..." className="mb-2"
          value={sort}
        //  onChange={(e) => dispatch(sortByPrice(e.target.value))}
        onChange={(e) => {
    const sortValue = e.target.value;
    const params = {
      ...Object.fromEntries(searchParams),
      sort: sortValue,
      page: "1",
    };
    setSearchParams(params);
  }}
          >
          <option value="">{i18next.language === "ar" ? "الترتيب" : "Sort by"}</option>
          <option value="lowToHigh">{i18next.language === "ar" ? "السعر: من الأقل إلى الأعلى" : "Price: Low → High"}</option>
          <option value="highToLow">{i18next.language === "ar" ? "السعر: من الأعلى إلى الأقل" : "Price: High → Low"}</option>
          </Form.Select>
        </Col> */}
        {/* <Col xs="auto">
          <Form.Check
            type="checkbox"
            id="autoSizingCheck"
            className="mb-2"
            label="Remember me"
          />
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2">
            Submit
          </Button>
        </Col> */}
      </Row>
    </Form>
    </Container>
    <Container style={{marginTop:20}} fluid="md">
      <Row>
     {productProcDto.map((product,index) =>( 
     
         <Card key={index} style={{ width: '14rem',gap:"1",fontFamily:"intel-one-mono-roboto"}}  className="m-3">
      
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Footer style={{margin:'0.5rem',display:"flex",flexShrink:"1",height:"2rem",flexWrap:"wrap"}}><span>
                      <strong>{t("Price")}:</strong>{" "}
                      {new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                      }).format(product.price)}
                    </span></Card.Footer>
        
      </Card.Body>
    </Card>
   
     ))}
     </Row>
     </Container>
   

{/* 
      <Container className="pagination-container">
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                className={`page-btn ${page === num ? "active" : ""}`}
                // onClick={() => dispatch(setPage(num))}
                onClick={() => {
  const params = {
    ...Object.fromEntries(searchParams),
    page: num.toString(),
  };
  setSearchParams(params);
}}

              >
                {num}
              </button>
            );
          })}
        </div>
      )}
    </Container> */}
    <Paginationbootstrap
  page={pageProcNumber}
  totalPages={totalPages}
  searchParams={searchParams}
  setSearchParams={setSearchParams}
/>
    </>
  );
};

export default ProductTest;
