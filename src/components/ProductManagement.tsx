import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
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

const ProductManagement = () => {
  const { t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { 
    loading, 
    error, 
    success, 
    totalCount, 
    sort, 
    searchQuery, 
    page, 
    pageSize, 
    products,
    formErrors 
  } = useSelector((state: RootState) => state.products);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state
  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editname, setEditName] = useState("");
  const [editprice, setEditPrice] = useState("");
  const [editimage, setEditImage] = useState<File | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Initial load - sync URL params with Redux
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const sortParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    dispatch(fetchProducts({ 
      searchQuery: search, 
      sort: sortParam, 
      page: pageParam 
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

  // Toast notifications
  useEffect(() => {
    if (error && typeof error === 'string') {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (success) {
      toast.success(success);
      dispatch(clearMessages());
    }
  }, [dispatch, error, success]);

  // Add Product
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", thename);
      formData.append("price", theprice);
      if (image) {
        formData.append("image", image);
      }

      const result = await dispatch(addProduct({ formData })).unwrap();

      toast.success(result.message);
      
      // Reset form
      setTheName("");
      setThePrice("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh products
      dispatch(fetchProducts({ page: 1 }));
    } catch (err: any) {
      console.error("Add product error:", err);
      // Errors are now handled in Redux and displayed via formErrors from state
    }
  };

  // Edit handlers
  const handleEditStart = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
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
      if (editimage) {
        formData.append("image", editimage);
      }

      await dispatch(updateProduct({ 
        id, 
        formData 
      })).unwrap();

      toast.success(
        i18next.language === "ar" 
          ? "تم التحديث بنجاح" 
          : "Updated successfully"
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Container style={{ marginTop: 30 }}>
      <h2 className="title">
        {i18next.language === "ar" ? "إدارة المنتجات" : "Product Management"} 🛒
      </h2>

      {/* FORM ERRORS */}
      {(formErrors.name || formErrors.price || formErrors.image) && (
        <div className="alert alert-danger">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {formErrors.name && <li>{formErrors.name}</li>}
            {formErrors.price && <li>{formErrors.price}</li>}
            {formErrors.image && <li>{formErrors.image}</li>}
          </ul>
        </div>
      )}

      {/* ADD FORM */}
      <form 
        onSubmit={handleAdd} 
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.2rem",
          margin: "2rem 0",
          alignItems: "center"
        }}
      >
        <input
          style={{ padding: "0.5rem", borderRadius: "0.3rem", flex: "1 1 200px" }}
          placeholder={i18next.language === "ar" ? "الاسم" : "Name"}
          value={thename}
          onChange={(e) => setTheName(e.target.value)}
          className={formErrors.name ? "form-control is-invalid" : "form-control"}
        />

        <input
          style={{ padding: "0.5rem", borderRadius: "0.3rem", flex: "1 1 150px" }}
          placeholder={i18next.language === "ar" ? "السعر" : "Price"}
          min="0"
          step="0.01"
          type="number"
          value={theprice}
          onChange={(e) => setThePrice(e.target.value)}
          className={formErrors.price ? "form-control is-invalid" : "form-control"}
        />

        <label className="file-upload" style={{ cursor: "pointer" }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2" 
            viewBox="0 0 24 24"
            style={{ width: 20, height: 20 }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round"
              d="M12 4v16m8-8H4" 
            />
          </svg>
          {image ? image.name : (i18next.language === "ar" ? "اختر صورة" : "Choose File")}
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                setImage(files[0]);
              }
            }}
          />
        </label>

        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={loading}
        >
          {loading
            ? (i18next.language === "ar" ? "جارٍ الإضافة..." : "Adding...")
            : (i18next.language === "ar" ? "إضافة المنتج" : "Add Product")
          }
        </button>
      </form>

      {/* FILTERS */}
      <div 
        className="form-group" 
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <span className="form-label">{t("Filters")}</span>
        <input
          className="form-control"
          style={{ padding: "0.4rem", flex: "1 1 200px" }}
          type="text"
          placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <select
          value={sort}
          className="form-select"
          style={{ flex: "0 1 200px" }}
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
                <th>{i18next.language === "ar" ? "الصورة" : "Image"}</th>
                <th>{i18next.language === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                    {i18next.language === "ar" 
                      ? "لا توجد منتجات" 
                      : "No products found"}
                  </td>
                </tr>
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
      {totalPages > 1 && (
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
      )}
    </Container>
  );
};

export default ProductManagement;