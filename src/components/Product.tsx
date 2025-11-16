import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import {
  fetchAdminProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  // filterBySearch,
  // sortByPrice,
  // setPage,
  clearMessages,
  type Product,
} from "../features/productSlice";
import { addToCart} from "../features/cartSlice";
import { selectFilteredProducts } from "../features/memoizedSelector";
import { type RootState, type AppDispatch } from "../app/store";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import i18next from "i18next";
import { FaUpload } from "react-icons/fa";

import "./Products.css";



// interface Props {
//   language: "en" | "ar";
// }

const Products= () => {
  
    const { i18n, t } = useTranslation("product");
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, success, totalCount, sort, searchQuery, page, pageSize,products } =
    useSelector((state: RootState) => state.products);
  //const products = useSelector(selectFilteredProducts);
 const fileInputRef = useRef<HTMLInputElement>(null);
  // --- Local state
  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState("");
  const [image, setImage] = useState<File|null>(null);
  
  const [formErrors, setFormErrors] = useState<{ name?: string; price?: string,image?:string }>({});
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

  // dispatch(filterBySearch(search));
  // dispatch(sortByPrice(sortParam));
  // dispatch(setPage(pageParam));

  dispatch(fetchAdminProducts({ searchQuery: search, sort: sortParam, page: pageParam }));
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

  try {
    const formData = new FormData();
    formData.append("name", thename);
    formData.append("price", theprice);
    if (image) {
      formData.append("image", image);
    }

    // Fixed: Pass FormData directly, not wrapped in object
    const result = await dispatch(addProduct(formData)).unwrap();

    toast.success(result.message);
    setTheName("");
    setThePrice("");
    setImage(null); // Don't forget to clear the image state
     // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    dispatch(fetchProducts({ page: 1 }));
  } catch (err: any) {
    console.error("Add product error:", err);

    // Check if it's field-specific validation errors
    // Backend returns: { Name: ["error1"], Price: ["error2"] }
    // Note: ASP.NET Core uses PascalCase by default
    if (err?.name || err?.price|| err?.image) {
      setFormErrors({
        name: Array.isArray(err.name) ? err.name[0] : undefined,
        price: Array.isArray(err.price) ? err.price[0] : undefined,
        image: Array.isArray(err.image) ? err.image[0] : undefined,
      });
    } 
    // Check for general error message
    else if (err?.general) {
      toast.error(
        typeof err.general === 'string' 
          ? err.general 
          : err.general[0]
      );
    } 
    // Fallback
    else {
      toast.error(
        i18next.language === "ar" 
          ? "خطأ غير متوقع" 
          : "Unexpected error"
      );
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
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => {
        toast.success(i18next.language === "ar" ? "تم الحذف بنجاح" : "Successfully deleted");
        // Optionally refresh the products list
        dispatch(fetchProducts({ page }));
      })
      .catch((error) => {
        toast.error(error.message || "Error deleting product");
      });
  }
};

  // const handleAddToCart = (product: Product) => {
  //   dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 }));
  // };

  const totalPages = Math.ceil(totalCount / pageSize);
  console.log(products);
  return (
    <Container style={{marginTop:30}}>
      <h2 className="title">{i18next.language === "ar" ? "إدارة المنتجات" : "Product Management"} 🛒</h2>

      {/* ADD PRODUCT FORM */}
       {/* Form Error */}
       
       <div style={{flexBasis:"300px",display:"flex", flexDirection:"column",justifyContent:"center",gap:"1.5rem"}}>
        <ul style={{color:"red"}}>
       {formErrors.name&&  <li>{formErrors.name && <div className="text-danger">{formErrors.name}</div>}</li>}
        {formErrors.price&& <li>{formErrors.price && <div className="text-danger">{formErrors.price}</div>}</li>}
        {formErrors.image&& <li>{formErrors.image && <div className="text-danger">{formErrors.image}</div>}</li>}
       </ul>
       </div>

      {/* --- Add Form --- */}
      <form onSubmit={handleAdd} style={{display:"flex",flexWrap:"wrap",flexGrow:"1",gap:"1.2rem",margin:"2rem"}}>
       
        <input style={{padding:"0.5rem",borderRadius:"0.3rem"}}
          placeholder={i18next.language === "ar" ? "الاسم" : "Name"}
          value={thename}
          onChange={(e) => setTheName(e.target.value)}
          // className={formErrors.name ? "is-invalid" : ""}
          className="from-control"
        />
        

        <input style={{padding:"0.5rem",borderRadius:"0.3rem"}}
          placeholder={i18next.language === "ar" ? "السعر" : "Price"}
          min="0"
          type="number"
          value={theprice}
          onChange={(e) => Number(setThePrice(e.target.value))}
          className={formErrors.price ? "is-invalid" : ""}
        />
        
        {/* <input id="myFileUpload"
         // value={image}
         ref={ fileInputRef }
          type="file"
          onChange={(e) => {setImage((e.target.files as FileList)[0]);}}></input>
          */}
          <label className="file-upload">
  
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
    stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M12 4v16m8-8H4" />
  </svg>
  Choose File
  <input ref={ fileInputRef } type="file" id="fileInput"   onChange={(e) => {setImage((e.target.files as FileList)[0]);}}/>
</label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading
            ?i18next. language === "ar" ? "جارٍ الإضافة..." : "Adding..."
            :i18next. language === "ar" ? "إضافة المنتج" : "Add Product"}
        </button>
      </form>

      {/* FILTERS */}
      <div className="form-group" style={{marginBottom:"1rem",display:"flex",flexGrow:"1",gap:"1rem"}}>
        <span className="form-control-sm form-label">{t("Filters")}</span>
        <input className="form-control-sm" style={{padding:"0.2rem"}}
          type="text"
          placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <select value={sort}
        className="form-control-sm"
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
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{i18next.language === "ar" ? "الاسم" : "Name"}</th>
              <th>{i18next.language === "ar" ? "السعر" : "Price (₹)"}</th>
               <th>Image</th>
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
                        <td><img src={p.imageUrl} className="img-fluid rounded" style={{width:"5rem",height:"5rem"}} alt="image"></img></td>
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
                          {/* <button onClick={() => handleAddToCart(p)}>➕ {i18next.language === "ar" ? "إضافة للسلة" : "Add"}</button> */}
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


//const errors: Record<string, string> = {};
    // if (!thename)
    //   errors.name = i18next.language === "ar" ? "الاسم مطلوب" : "Name is required";
    // if (!theprice)
    //   errors.price = i18next.language === "ar" ? "السعر مطلوب" : "Price is required";
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   return;
    // }