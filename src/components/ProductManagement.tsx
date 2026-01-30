import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { Button, Form, FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";
import { GetCategory, type CategoryDto } from "../features/CategorySlice";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  clearMessages,
  type Product,
  fetchProducts,
} from "../features/productSlice";
import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import i18next from "i18next";
import "./Products.css";
import {Row,Col} from "react-bootstrap";

import Paginationbootstrap from "./Paginationbootstrapold";

const ProductManagement = () => {
  const { t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { 
    loading, 
    error, 
    success, 
    message,
    totalCount, 
    sort, 
    searchQuery, 
    page, 
    pageSize, 
    products,
 
  } = useSelector((state: RootState) => state.products);
 const { 
    loading: categoryLoading, 
    error: categoryError, 
    category: categoryDto 
  } = useSelector((state: RootState) => state.category);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state
  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState("1");
  const [stock, setStock] = useState("0");    
    const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editname, setEditName] = useState("");
  const [editprice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editimage, setEditImage] = useState<File | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
  const [debouncedSearch] = useDebounce(localSearch, 500);
 const [formErrors, setFormErrors] = useState<{ 
    name?: string; 
    price?: string; 
    image?:string;
    stock?:string;
  }>({});

  const editFileInputRef = useRef<HTMLInputElement>(null);

  // URL params as source of truth
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  // Initial load - sync URL params with Redux
  useEffect(() => {
      // const search = searchParams.get("search") || "";
      // const sortParam = searchParams.get("sort") || "";
      // const pageParam = Number(searchParams.get("page")) || 1;
   
    dispatch(fetchProducts({ 
      searchQuery: currentSearch,
      searchCategory: currentCategory,
      sort: currentSort, 
      page: currentPage 
    }));
  }, [dispatch, searchParams]);

  // Debounced search - update URL params
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

  // Load categories with error handling
  
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
  // Add Product
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", thename);
      formData.append("price", theprice);
      formData.append("stock", stock);
        formData.append("categoryId", category);
      if (image) {
        formData.append("image", image);
      }

      const result = await dispatch(addProduct( formData )).unwrap();

      toast.success(result.message);
      
      // Reset form
      setTheName("");
      setThePrice("");
      setStock("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh products
      dispatch(fetchProducts({ page: 1 }));
    } catch (err: any) {
      console.error("Add product error:", err);
      if(err?.Name||err?.Image||err?.Price||err?.Stock){
        setFormErrors({
         name: Array.isArray(err.Name) ? err.Name[0] : err.Email,
          price: Array.isArray(err.Password) ? err.Price[0] : err.Price,
          image: Array.isArray(err.Image) ? err.Image[0] : err.Image,
           stock: Array.isArray(err.Stock) ? err.Stock[0] : err.Stock,
        })
          
      }
      // Errors are now handled in Redux and displayed via formErrors from state
    }
  };

  // Edit handlers
  const handleEditStart = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditImage(null);
  };

  const handleUpdate = async (id: string) => {
    if (!editname || !editprice) {
      toast.error(
        i18next.language === "ar" 
          ? "الاسم والسعر مطلوبان" 
          : "Name and price are required"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editname);
      formData.append("price", editprice);
      formData.append("stock", editStock);
    
      if (editimage) {
        formData.append("image", editimage);
      }

      await dispatch(updateProduct({ 
        id, 
        formData 
      })).unwrap();

      toast.success(
        i18next.language === "ar" 
          ? message
          : message
      );

      setEditingId(null);
      setEditName("");
      setEditPrice("");
      setEditImage(null);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }

      // Refresh products
      dispatch(fetchProducts({ page }));
    } catch (err: any) {
      toast.error(err?.message || "Error updating product");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(
      i18next.language === "ar" 
        ? "هل أنت متأكد من الحذف؟" 
        : "Are you sure?"
    )) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          toast.success(
            i18next.language === "ar" 
              ? "تم الحذف بنجاح" 
              : "Successfully deleted"
          );
          dispatch(fetchProducts({ page }));
        })
        .catch((error) => {
          toast.error(error.message || "Error deleting product");
        });
    }
  };
// Helper function to update URL params
  const updateParams = (newParams: Record<string, string>) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams),
      ...newParams,
      page: "1", // Reset to page 1 on filter change
    };
    setSearchParams(params);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
    <Container style={{ marginTop: 10 }} className="neucha-regular">
      <h2 className="title">
        {i18next.language === "ar" ? "إدارة المنتجات" : "Product Management"} 
      </h2>

      {/* FORM ERRORS */}
  

      {/* ADD FORM */}
      <Form noValidate
        onSubmit={handleAdd} 
       
       className="mb-10"
      >
        <div >
          <Row>
            <Col>
            <FormGroup>
        <Form.Control
       
          placeholder={i18next.language === "ar" ? "الاسم" : "Name"}
          value={thename}
          onChange={(e) =>{ setTheName(e.target.value)

                   if (formErrors.name) {
      setFormErrors(prev => ({
        ...prev,
        name: undefined
      }))}
          }}
          //  className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
           isInvalid={!!formErrors.name}
           disabled={loading}
        />
          <Form.Control.Feedback type="invalid">
                            {formErrors.name}
                          </Form.Control.Feedback>
        </FormGroup>
</Col>
        <Col>
        <FormGroup>
        <FormControl
        
          placeholder={i18next.language === "ar" ? "السعر" : "Price"}
          min="1"
         
          type="number"
          value={theprice}
          onChange={(e) =>{ setThePrice(e.target.value)
                   if (formErrors.price) {
      setFormErrors(prev => ({
        ...prev,
        price: undefined
      }))}
          }}
          // className={formErrors.price ? "form-control col-md-2 is-invalid" : "form-control"}
       isInvalid={!!formErrors.price}
       disabled={loading}
       />
        <Form.Control.Feedback type="invalid">
                            {formErrors.price}
                          </Form.Control.Feedback>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
 <FormControl
          style={{ padding: "0.5rem", borderRadius: "0.3rem", flex: "1 1 150px" }}
          placeholder={i18next.language === "ar" ? "المخزون" : "Stock"}
          min="0"
          //step="0.01"
          type="number"
          value={stock}
          onChange={(e) =>{setStock(e.target.value)

              if (formErrors.stock) {
      setFormErrors(prev => ({
        ...prev,
        stock: undefined
      }))}
          }}
          
          // className={formErrors.stock ? "form-control col-md-2 is-invalid" : "form-control"}
           isInvalid={!!formErrors.stock}
       disabled={loading}
        />
          <Form.Control.Feedback type="invalid">
                            {formErrors.stock}
                          </Form.Control.Feedback>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
         <FormSelect 
                     className="mb-2 form-control col-md-2"
                     value={category}
                     onChange={(e) => setCategory(e.target.value )}
                    // aria-label="Filter by category"
                   >
                     <option value="">
                       {i18next.language === "ar" ? "جميع الفئات" : "All Categories"}
                     </option>
                     {categoryDto?.map((cat: any) => (
                       <option key={cat.id} value={cat.id}>
                         {i18next.language === "ar" ? cat.name : cat.name}
                       </option>
                    
                     ))}
                        </FormSelect>
                        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
  <FormLabel className="btn btn-outline-secondary btn d-inline-flex align-items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>

    {image
      ? image.name
      : i18next.language === "ar"
      ? "اختر صورة"
      : "Choose Image"}

   <Form.Control
  type="file"
  accept="image/*"
  hidden
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    if (file) setImage(file);

           if (formErrors.image) {
      setFormErrors(prev => ({
        ...prev,
        image: undefined
      }))}
  }}
  isInvalid={!!formErrors.image}
  disabled={loading}
/>

<Form.Control.Feedback type="invalid">
  {formErrors.image}
</Form.Control.Feedback>

</FormLabel>
</FormGroup>
</Col>
     </Row>
     
      <Col>
        <Button
          className="btn btn-primary" 
          type="submit" 
          disabled={loading}
        >
          {loading
            ? (i18next.language === "ar" ? "جارٍ الإضافة..." : "Adding...")
            : (i18next.language === "ar" ? "إضافة المنتج" : "Add Product")
          }
      </Button> 

        </Col>
        </div>
       
      </Form>

   
{/* FILTERS */}
<div className="mt-4 mb-3">
  <Row className="g-3 align-items-center">
    {/* Label */}
    <Col xs={12} md="auto">
      <h5 className="mb-0 fw-semibold">{t("Filters")}</h5>
    </Col>

    {/* Search Input */}
    <Col xs={12} sm={6} md={3}>
      <input
        className="form-control"
        type="text"
        placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </Col>

    {/* Category Filter */}
    <Col xs={12} sm={6} md={3}>
      <select 
        className="form-select"
        value={currentCategory}
        onChange={(e) => updateParams({ category: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="">
          {i18next.language === "ar" ? "جميع الفئات" : "All Categories"}
        </option>
        {categoryDto?.map((cat: any) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
    </Col>

    {/* Sort Dropdown */}
    <Col xs={12} sm={6} md={3}>
      <select
        className="form-select"
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
      </select>
    </Col>
  </Row>
</div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">
              {i18next.language === "ar" 
                ? "جارٍ تحميل المنتجات..." 
                : "Loading products..."}
            </span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{i18next.language === "ar" ? "الاسم" : "Name"}</th>
                <th>{i18next.language === "ar" ? "السعر" : "Price"}</th>
                
                <th>{i18next.language === "ar" ? "المخزون" : "Stock"}</th>
                <th>{i18next.language === "ar" ? "الصورة" : "Image"}</th>
                <th>{i18next.language === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  <td colSpan={4} style={{ justifyContent:"center",textAlign: "center", padding: "2rem" }}>
                    {i18next.language === "ar" 
                      ? "لا توجد منتجات" 
                      : "No products found"}
                  </td>
                </div>
              ) : (
                products.map((p) => {
                  const isEditing = p.id === editingId;
                  return (
                    <tr key={p.id}>
                      {isEditing ? (
                        <>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editname}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              type="number"
                              min="0"
                              step="0.01"
                              value={editprice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          </td>
                           <td>
                            <input
                              className="form-control form-control-sm"
                              type="number"
                              min="0"
                              //step="0.01"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                            />
                          </td>
                          <td>
                            <label style={{ cursor: "pointer", fontSize: "0.9rem" }}>
                              📎 {editimage ? editimage.name : (i18next.language === "ar" ? "اختر صورة" : "Choose")}
                              <input
                                ref={editFileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    setEditImage(files[0]);
                                  }
                                }}
                              />
                            </label>
                            {p.imageUrl && (
                              <img
                                src={p.imageUrl}
                                className="img-thumbnail mt-1"
                                style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                                alt="current"
                              />
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-1"
                              onClick={() => handleUpdate(p.id)}
                            >
                              💾 {i18next.language === "ar" ? "حفظ" : "Save"}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setEditingId(null);
                                setEditName("");
                                setEditPrice("");
                                setEditImage(null);
                              }}
                            >
                              ✖ {i18next.language === "ar" ? "إلغاء" : "Cancel"}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{p.name}</td>
                          <td>{p.price}</td>
                          <td>{p.stock}</td>
                          <td>
                            {p.imageUrl && (
                              <img
                                src={p.imageUrl}
                                className="img-thumbnail"
                                style={{ 
                                  width: "5rem", 
                                  height: "5rem", 
                                  objectFit: "cover" 
                                }}
                                alt={p.name}
                              />
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-1"
                              onClick={() => handleEditStart(p)}
                            >
                              ✏️ {i18next.language === "ar" ? "تعديل" : "Edit"}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(p.id)}
                            >
                              🗑 {i18next.language === "ar" ? "حذف" : "Delete"}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {/* {totalPages > 1 && (
        <div className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                className={`btn ${page === num ? "btn-primary" : "btn-outline-primary"} mx-1`}
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
      )} */}
        <Paginationbootstrap
              page={currentPage}
              totalPages={totalPages}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
    </Container>
 
          <Container fluid="md" className="mt-2 d-flex justify-content-center">
          
          </Container>
      </>
      
  );
};

export default ProductManagement;