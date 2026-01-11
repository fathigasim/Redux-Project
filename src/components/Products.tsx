import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import {Row,Form,Col} from 'react-bootstrap';
import {
  fetchProducts,

  clearMessages,

} from "../features/productSlice";
import { type CategoryDto } from "../features/CategorySlice";



import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import { GetCategory } from "../features/CategorySlice";  


import { GetBasket } from "../features/basketSlice";
import i18next from "i18next";
import "./Products.css";
import "./imagestyle.css"
import Basket from "./Basket";
import Paginationbootstrap from "./Paginationbootstrap";

import ProductCart from "./ProductCart";





// interface Props {
//   language: "en" | "ar";
// }

const Products= () => {
  
  const { i18n, t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {error, success, totalCount, sort, searchQuery, searchCategory, page, pageSize,products } =
    useSelector((state: RootState) => state.products);
       const {loading:categoryLoading,error:categoryError,category:categoryDto}=useSelector((state:RootState)=>state.category);
    const { items} = useSelector((state: RootState) => state.basket);
  
  const {loading:basketLoading,error:basketError}=useSelector((state: RootState) => state.basket);
 
  const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
  const [debouncedSearch] = useDebounce(localSearch, 500);
  

  // --- Initial load
  useEffect(() => {
      let mounted = true;
    const fetchCategories = async () => {
      try {
        await dispatch(GetCategory()).unwrap();
      }
      catch(err:any){
        console.log(`some error ${err}`)
        toast.error(err.message || 'Failed to load categories');
      }
    };
    fetchCategories();
    return () => {
    mounted = false;
  };
  }, [dispatch]); 

useEffect(() => {
  const search = searchParams.get("search") || "";
  const seCategory = (searchParams.get("category")) || "";
  const sortParam = searchParams.get("sort") ?? "";
  const pageParam = Number(searchParams.get("page")) || 1;


   
  dispatch(fetchProducts({ searchQuery: search,searchCategory:seCategory ,sort: sortParam, page: pageParam }));
}, [dispatch, searchParams]);
// Call once on mount
useEffect(() => {
  dispatch(GetBasket());
}, [dispatch]);

useEffect(() => {
  const s = String(debouncedSearch);
  const currentSearch = searchParams.get("search") || "";

  if (s !== currentSearch) {
    const params = {
      ...Object.fromEntries(searchParams),
      search: s,
      page: "1",
    };
    setSearchParams(params);
  }
}, [debouncedSearch, searchParams, setSearchParams]);

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











  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);
  if (categoryLoading) {
  return <Container className="text-center p-5"><Spinner /></Container>;
}

if (categoryError) {
  return <Alert variant="danger">{categoryError}</Alert>;
}

  return (
    <>
    {}
    {items.length>0 &&
    <Container fluid="md" style={{marginTop:20,fontFamily:'intel-one-mono-roboto'}}>
      <h4>{t("cartItems")}: {items.length}</h4>
      <Basket />
    </Container>
    }
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
        
          <Form.Select className="mb-2"
          value={sort}
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
          <option value="" >{i18next.language === "ar" ? "الترتيب" : "Sort by"}</option>
          <option value="lowToHigh">{i18next.language === "ar" ? "السعر: من الأقل إلى الأعلى" : "Price: Low → High"}</option>
          <option value="highToLow">{i18next.language === "ar" ? "السعر: من الأعلى إلى الأقل" : "Price: High → Low"}</option>
          </Form.Select>
        </Col>
        <Col xs="auto">
            <Form.Select value={searchCategory}  onChange={(e) => {
    const categoryValue = e.target.value;
    const params = {
        ...Object.fromEntries(searchParams),
        category: categoryValue,
        page: "1",
    };
    setSearchParams(params);
  }}
        className="mb-2">
          <option value="">{i18next.language === "ar" ? "الفئة" : "Category"}</option>
          {categoryDto && categoryDto.map((cat:CategoryDto)=>
            <option key={cat.id} value={cat.name}>{i18next.language === "ar" ? cat.name : cat.name}</option>
          ) }
        </Form.Select>
        </Col>
   
      </Row>
    </Form>
    </Container>
    <Container fluid="md" style={{ marginTop: 20 }}>
  <Row className="g-3">
    {products.map(product => (
      <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
        <ProductCart product={product} />
      </Col>
    ))}
  </Row>
</Container>

<Container fluid="md" className="mt-4 d-flex justify-content-center">
  <Paginationbootstrap
    page={page}
    totalPages={totalPages}
    searchParams={searchParams}
    setSearchParams={setSearchParams}
  />
</Container>

    </>
  );
};

export default Products;
