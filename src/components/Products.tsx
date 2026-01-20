import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Alert, Spinner, Row, Form, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { fetchProducts, clearMessages } from "../features/productSlice";
import { GetCategory, type CategoryDto } from "../features/CategorySlice";
import { GetBasket } from "../features/basketSlice";
import { type RootState, type AppDispatch } from "../app/store";

import Basket from "./Basket";
import Paginationbootstrap from "./Paginationbootstrapold";
import ProductCart from "./ProductCart";

import "./Products.css";
import "./imagestyle.css";

const Products = () => {
  const { t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state
  const { 
    error, 
    success, 
    totalCount, 
    pageSize, 
    products,
    loading: productsLoading 
  } = useSelector((state: RootState) => state.products);
  
  const { 
    loading: categoryLoading, 
    error: categoryError, 
    category: categoryDto 
  } = useSelector((state: RootState) => state.category);
  
  const { items } = useSelector((state: RootState) => state.basket);

  // URL params as source of truth
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local state for search input with debounce
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // Helper function to update URL params
  const updateParams = (newParams: Record<string, string>) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams),
      ...newParams,
      page: "1", // Reset to page 1 on filter change
    };
    
    // Ensure category always exists
    if (!params.category) {
      params.category = "";
    }
    
    setSearchParams(params);
  };

  // Load categories on mount
// Load categories on mount
useEffect(() => {
  const fetchCategories = async () => {
    const timeoutId = setTimeout(() => {
      toast.error("Loading categories is taking too long. Please check your connection.");
    }, 5000); // 5 seconds timeout

    try {
      await dispatch(GetCategory()).unwrap();
      clearTimeout(timeoutId); // Cancel timeout if successful
    } catch (err: any) {
      clearTimeout(timeoutId); // Cancel timeout on error
      console.error("Failed to load categories:", err);
      toast.error(err.message || "Failed to load categories");
    }
  };

  fetchCategories();
}, [dispatch]);
  // Load basket on mount
  useEffect(() => {
    dispatch(GetBasket());
  }, [dispatch]);

  // Sync local search with URL on mount/URL change
  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  // Fetch products when URL params change
  useEffect(() => {
    dispatch(fetchProducts({ 
      searchQuery: currentSearch,
      searchCategory: currentCategory,
      sort: currentSort, 
      page: currentPage 
    }));
  }, [dispatch, currentSearch, currentCategory, currentSort, currentPage]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateParams({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // Removed searchParams to avoid infinite loop

  // Toast notifications
  useEffect(() => {
    if (error) {
      // toast.error(error);
      dispatch(clearMessages());
    }
    if (success) {
      // toast.success(success);
      dispatch(clearMessages());
    }
  }, [dispatch, error, success]);

  // Computed values
  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize), 
    [totalCount, pageSize]
  );

  // Loading state
  if (categoryLoading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading categories...</p>
      </Container>
    );
  }

  // Error state
  if (categoryError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{categoryError}</Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Basket Section */}
      {items.length > 0 && (
        <Container 
          fluid="md" 
          style={{ marginTop: 20, fontFamily: 'intel-one-mono-roboto' }}
        >
          {/* <h4>{t("cartItems")}: {items.length}</h4> */}
          <Basket />
        </Container>
      )}

      {/* Filters Section */}
      <Container 
        fluid="md" 
        style={{ marginTop: 30, fontFamily: 'intel-one-mono-roboto' }}
      >
        <Form>
          <Row className="align-items-center">
            {/* Search Input */}
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                aria-label="Search products"
              />
            </Col>

            {/* Sort Dropdown */}
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Select 
                className="mb-2"
                value={currentSort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                aria-label="Sort products"
              >
                <option value="">
                  {i18next.language === "ar" ? "الترتيب" : "Sort by"}
                </option>
                <option value="lowToHigh">
                  {i18next.language === "ar" 
                    ? "السعر: من الأقل إلى الأعلى" 
                    : "Price: Low → High"}
                </option>
                <option value="highToLow">
                  {i18next.language === "ar" 
                    ? "السعر: من الأعلى إلى الأقل" 
                    : "Price: High → Low"}
                </option>
              </Form.Select>
            </Col>

            {/* Category Dropdown */}
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Select 
                className="mb-2"
                value={currentCategory}
                onChange={(e) => updateParams({ category: e.target.value })}
                aria-label="Filter by category"
              >
                <option value="">
                  {i18next.language === "ar" ? "جميع الفئات" : "All Categories"}
                </option>
                {categoryDto?.map((cat: any) => (
                  <option key={cat.id} value={cat.name}>
                    {i18next.language === "ar" ? cat.name : cat.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </Container>

      {/* Products Section */}
      <Container fluid="md" style={{ marginTop: 20 }}>
        {productsLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" />
            <p className="mt-3">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <Alert variant="info" className="text-center">
            {i18next.language === "ar" 
              ? "لم يتم العثور على منتجات" 
              : "No products found"}
          </Alert>
        ) : (
          <Row className="g-3">
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCart product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Pagination */}
      {!productsLoading && products.length > 0 && (
        <Container fluid="md" className="mt-4 d-flex justify-content-center">
          <Paginationbootstrap
            page={currentPage}
            totalPages={totalPages}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Container>
      )}
    </>
  );
};

export default Products;