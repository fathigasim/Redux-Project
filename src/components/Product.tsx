import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
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



// interface Props {
//   language: "en" | "ar";
// }

const Products= () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, success, totalCount, sort, searchQuery, page, pageSize } =
    useSelector((state: RootState) => state.products);
  const products = useSelector(selectFilteredProducts);

  // --- Local state
  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState("");
  const [formErrors, setFormErrors] = useState<{ name?: string; price?: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editname, setEditName] = useState("");
  const [editprice, setEditPrice] = useState("");
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
  // useEffect(() => {
  //   const params: Record<string, string> = {};
  //   if (debouncedSearch) params.search = String(debouncedSearch);
  //   if (sort) params.sort = sort;
  //   if (page) params.page = page.toString();
  //   setSearchParams(params);
  // }, [setSearchParams,debouncedSearch, sort, page]);
  // }, [debouncedSearch, sort, page]);

  // useEffect(() => {
  //   dispatch(fetchProducts({ searchQuery: String(debouncedSearch), sort, page }));
  // }, [dispatch, page, sort, debouncedSearch, i18next.language]);

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

  // --- Add Product
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!thename)
      errors.name = i18next.language === "ar" ? "الاسم مطلوب" : "Name is required";
    if (!theprice)
      errors.price = i18next.language === "ar" ? "السعر مطلوب" : "Price is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await dispatch(
        addProduct({ name: thename, price: Number(theprice) })
      ).unwrap();

      toast.success(result.message);
      setTheName("");
        setThePrice("");
        dispatch(fetchProducts({ page: 1 }));
    } catch (err: any) {
      console.error("Add product error:", err);
      // Backend validation shape: { Name: ["error1"], Price: ["error2"] }
      if (err?.Name || err?.price) {
        setFormErrors({
          name: Array.isArray(err.name) ? err.name[0] : undefined,
          price: Array.isArray(err.price) ? err.price[0] : undefined,
        });
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error(i18next.language === "ar" ? "خطأ غير متوقع" : "Unexpected error");
      }
    }
  };

  // --- Edit, Update, Delete
  const handleEditStart = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
  };

  const handleUpdate = (id: string) => {
    if (!editname || !editprice) return;
    dispatch(updateProduct({ id, name: editname, price: Number(editprice) }));
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm(i18next.language === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }));
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <Container style={{marginTop:100}}>
      <h2 className="title">{i18next.language === "ar" ? "إدارة المنتجات" : "Product Management"} 🛒</h2>

      {/* ADD PRODUCT FORM */}
       
      {/* --- Add Form --- */}
      <form onSubmit={handleAdd}>
        <input
          placeholder={i18next.language === "ar" ? "الاسم" : "Name"}
          value={thename}
          onChange={(e) => setTheName(e.target.value)}
          className={formErrors.name ? "is-invalid" : ""}
        />
        {formErrors.name && <div className="text-danger">{formErrors.name}</div>}

        <input
          placeholder={i18next.language === "ar" ? "السعر" : "Price"}
          type="number"
          value={theprice}
          onChange={(e) => setThePrice(e.target.value)}
          className={formErrors.price ? "is-invalid" : ""}
        />
        {formErrors.price && <div className="text-danger">{formErrors.price}</div>}

        <button type="submit" disabled={loading}>
          {loading
            ?i18next. language === "ar" ? "جارٍ الإضافة..." : "Adding..."
            :i18next. language === "ar" ? "إضافة المنتج" : "Add Product"}
        </button>
      </form>

      {/* FILTERS */}
      <div >
        <span>{t("Filters")}</span>
        <input
          type="text"
          placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <select value={sort}
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
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <p className="loading">{i18next.language === "ar" ? "جارٍ تحميل المنتجات..." : "Loading products..."}</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>{i18next.language === "ar" ? "الاسم" : "Name"}</th>
              <th>{i18next.language === "ar" ? "السعر" : "Price (₹)"}</th>
              <th>{i18next.language === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  {i18next.language === "ar" ? "لا توجد منتجات" : "No products found"}
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
                          <input value={editname} onChange={(e) => setEditName(e.target.value)} />
                        </td>
                        <td>
                          <input type="number" value={editprice} onChange={(e) => setEditPrice(e.target.value)} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                      </>
                    )}
                    <td>
                      {isEditing ? (
                        <>
                          <button onClick={() => handleUpdate(p.id)}>💾 {i18next.language === "ar" ? "حفظ" : "Save"}</button>
                          <button onClick={() => setEditingId(null)}>✖ {i18next.language === "ar" ? "إلغاء" : "Cancel"}</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditStart(p)}>✏️ {i18next.language === "ar" ? "تعديل" : "Edit"}</button>
                          <button onClick={() => handleDelete(p.id)}>🗑 {i18next.language === "ar" ? "حذف" : "Delete"}</button>
                          <button onClick={() => handleAddToCart(p)}>➕ {i18next.language === "ar" ? "إضافة للسلة" : "Add"}</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
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
  );
};

export default Products;
