import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import {BsCartPlus} from 'react-icons/bs';

import {Card,Row,Button,Form,Col} from 'react-bootstrap';
import {
  fetchProducts,

  clearMessages,

} from "../features/productSlice";



import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import i18next from "i18next";
import "./Products.css";
import "./imagestyle.css"
import Paginationbootstrap from "./Paginationbootstrap";
// import { addToBasket,GetBasket,type basketInput } from "../features/basketSlice";
// import Basket from "./Basket";





// interface Props {
//   language: "en" | "ar";
// }

const Products= () => {
  
  const { i18n, t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {error, success, totalCount, sort, searchQuery, page, pageSize,products } =
    useSelector((state: RootState) => state.products);
    //const { items} = useSelector((state: RootState) => state.basket);
  //const products = useSelector(selectFilteredProducts);
  // const {loading:basketLoading,error:basketError}=useSelector((state: RootState) => state.basket);
 
  const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // --- Initial load
  
useEffect(() => {
  const search = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  // dispatch(filterBySearch(search));
  // dispatch(sortByPrice(sortParam));
  // dispatch(setPage(pageParam));
  //  dispatch(GetBasket());
  dispatch(fetchProducts({ searchQuery: search, sort: sortParam, page: pageParam }));
}, [dispatch, searchParams]);


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
}, [debouncedSearch]);

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









//  const  handleAddToCart = async (basket: basketInput) => { 
//     try{
//    await dispatch(addToBasket({prodId:basket.prodId,inputQnt:1})).unwrap();
//     toast.success("Product added to cart");
//     }
//     catch(err :any){
//       console.log(`some error ${err}`)
//       if(err.response.status===400)
//       alert(err.response.data)
//       toast.error(err.response.data)
//     }
//   };

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <>
    {/* {items.length>0 &&
    <Container fluid="md" style={{marginTop:20,fontFamily:'intel-one-mono-roboto'}}>
      <h4>{t("cartItems")}: {items.length}</h4>
      <Basket />
    </Container>
    }
    <div></div> */}
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
        </Col>
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
     {products.map((product,index) =>( 
     
         <Card key={index} style={{ width: '14rem',gap:"1",fontFamily:"intel-one-mono-roboto"}}  className="m-3">
      <Card.Img variant="top" src={product.imageUrl} className=".image-container img-thumbnail card-img-top mt-2" style={{height:"10rem",width:"100% !important",objectFit:"cover" }}/>
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
        <Button variant="primary" onClick={()=>handleAddToCart({prodId:product.id,inputQnt:1})}><span>{t("addToCart")} <BsCartPlus size="1.5em" /></span></Button>
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
  page={page}
  totalPages={totalPages}
  searchParams={searchParams}
  setSearchParams={setSearchParams}
/>
    </>
  );
};

export default Products;
