import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import {BsCartPlus} from 'react-icons/bs';

import {Card,Row,Button,Form,Col,InputGroup} from 'react-bootstrap';
import {
  fetchProducts,
  filterBySearch,
  sortByPrice,
  setPage,
  clearMessages,
  type Product,
} from "../features/productSlice";
import { addToCart} from "../features/cartSlice";
import { selectFilteredProducts } from "../features/memoizedSelector";
import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import i18next from "i18next";
import "./Products.css";
import "./imagestyle.css"



// interface Props {
//   language: "en" | "ar";
// }

const Products= () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, success, totalCount, sort, searchQuery, page, pageSize,products } =
    useSelector((state: RootState) => state.products);
  //const products = useSelector(selectFilteredProducts);

 
  const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // --- Initial load
  
useEffect(() => {
  const search = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  dispatch(filterBySearch(search));
  dispatch(sortByPrice(sortParam));
  dispatch(setPage(pageParam));

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









  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }));
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <>
    <Container  fluid="md" style={{marginTop:30}}>
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
     
         <Card key={index} style={{ width: '14rem',gap:"1"}}  className="m-3">
      <Card.Img variant="top" src={product.imageUrl} className=".image-container img-thumbnail card-img-top mt-2" style={{height:"10rem",width:"100% !important",objectFit:"cover" }}/>
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary" onClick={()=>handleAddToCart(product)}><span>addToCart <BsCartPlus size="1.5em" /></span></Button>
      </Card.Body>
    </Card>
   
     ))}
     </Row>
     </Container>
   


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
    </Container>
    </>
  );
};

export default Products;
