// pages/Products.tsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Spinner, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { fetchProducts, clearMessages } from "../features/productSlice";
import { GetCategory } from "../features/CategorySlice";
import { GetBasket } from "../features/basketSlice";
import { type RootState, type AppDispatch } from "../app/store";
import { useUrlFilters } from "../hooks/useUrlFilters";

import { FilterBar } from "../filters/FilterBar";
import { SearchFilter } from "../filters/SearchFilter";
import { SelectFilter } from "../filters/SelectFilter";
import { ActiveFilters } from "../filters/ActiveFilters";
import Basket from "./Basket";
import Paginationbootstrap from "../components/Paginationbootstrap";
import ProductCart from "./ProductCart";

interface ProductFilters {
  search: string;
  category: string;
  sort: string;
  page: string;
  [key: string]: string;
}

const Products = () => {
  const { t, i18n } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  
  // URL-based filters
  const { filters, updateFilters, resetFilters, clearFilter } = 
    useUrlFilters<ProductFilters>({
      search: "",
      category: "",
      sort: "",
      page: "1",
    });

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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(GetCategory()).unwrap(),
          dispatch(GetBasket()).unwrap(),
        ]);
      } catch (err: any) {
        console.error("Failed to load initial data:", err);
        toast.error(err.message || "Failed to load data");
      }
    };
    loadInitialData();
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    dispatch(fetchProducts({ 
      searchQuery: filters.search,
      searchCategory: filters.category,
      sort: filters.sort, 
      page: Number(filters.page) || 1,
    }));
  }, [dispatch, filters]);

  // Handle notifications
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

  // Prepare select options
  const categoryOptions = useMemo(() => 
    categoryDto?.map(cat => ({
      value: cat.name,
      label: i18n.language === "ar" ?  cat.name : cat.name,
    //   label: i18n.language === "ar" ? cat.arabicName || cat.name : cat.name,
    })) || [],
    [categoryDto, i18n.language]
  );

  const sortOptions = useMemo(() => [
    { 
      value: "lowToHigh", 
      label: i18n.language === "ar" 
        ? "السعر: من الأقل إلى الأعلى" 
        : "Price: Low → High" 
    },
    { 
      value: "highToLow", 
      label: i18n.language === "ar" 
        ? "السعر: من الأعلى إلى الأقل" 
        : "Price: High → Low" 
    },
  ], [i18n.language]);

  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize), 
    [totalCount, pageSize]
  );

  const filterLabels = {
    search: t("search") || "Search",
    category: t("category") || "Category",
    sort: t("sort") || "Sort",
  };

  // Loading state
  if (categoryLoading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">{t("loadingCategories") || "Loading categories..."}</p>
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
      {/* Basket */}
      {items.length > 0 && (
        <Container fluid="md" className="mt-3">
          <h4>{t("cartItems") || "Cart Items"}: {items.length}</h4>
          <Basket />
        </Container>
      )}

      {/* Filters */}
      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={6} md={4} lg={3}>
          <SearchFilter
            value={filters.search}
            onSearch={(value) => updateFilters({ search: value })}
            placeholder={t("searchPlaceholder") || "Search..."}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <SelectFilter
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => updateFilters({ sort: value })}
            placeholder={t("sortBy") || "Sort by"}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <SelectFilter
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => updateFilters({ category: value })}
            placeholder={t("allCategories") || "All Categories"}
          />
        </Col>
      </FilterBar>

      {/* Active Filters */}
      <Container fluid="md">
        <ActiveFilters
          filters={filters}
          onClear={clearFilter}
          labels={filterLabels}
        />
      </Container>

      {/* Products */}
      <Container fluid="md">
        {productsLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" />
            <p className="mt-3">{t("loadingProducts") || "Loading products..."}</p>
          </div>
        ) : products.length === 0 ? (
          <Alert variant="info" className="text-center">
            {t("noProductsFound") || "No products found"}
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
        <Paginationbootstrap
          page={Number(filters.page) || 1}
          totalPages={totalPages}
          onPageChange={(page) => updateFilters({ page: String(page) }, false)}
          maxVisible={5}
          showFirstLast={true}
        />
      )}
    </>
  );
};

export default Products;