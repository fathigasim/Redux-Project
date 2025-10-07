import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  filterBySearch,
  sortByPrice,
  setPage,
  type Product,
} from "../features/productSlice";
import { addToCart, type CartItem } from "../features/cartSlice";
import { selectFilteredProducts } from "../features/memoizedSelector";
import { type RootState, type AppDispatch } from "../app/store";
import "./Products.css"; // optional: extract styles for cleaner JSX

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { loading, error, totalCount } = useSelector((state: RootState) => state.products);
  const products = useSelector(selectFilteredProducts);
  const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
  const sort = useSelector((state: RootState) => state.products.sort);
  const page = useSelector((state: RootState) => state.products.page);
  const pageSize = useSelector((state: RootState) => state.products.pageSize);

  // Local UI state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debouncedSearch] = useDebounce(localSearch, 500);
  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editname, setEditName] = useState("");
  const [editprice, setEditPrice] = useState("");

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Initial load: read from URL
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const sortParam = searchParams.get("sort") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    if (search) dispatch(filterBySearch(search));
    if (sortParam) dispatch(sortByPrice(sortParam));
    if (pageParam) dispatch(setPage(pageParam));

    dispatch(fetchProducts());
  }, [dispatch]);

  // --- Update Redux search only after debounce
  useEffect(() => {
    dispatch(filterBySearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // --- Sync filters back to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (sort) params.sort = sort;
    if (page) params.page = page.toString();
    setSearchParams(params);
  }, [debouncedSearch, sort, page, setSearchParams]);

  // --- Fetch products when filters or pagination change
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, sort, debouncedSearch]);

  // --- CRUD handlers
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thename || !theprice) return;
    dispatch(addProduct({ name: thename, price: Number(theprice) }));
    setTheName("");
    setThePrice("");
  };

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
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = { id: product.id, name: product.name, price: product.price, quantity: 1 };
    dispatch(addToCart(cartItem));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // --- UI rendering
  return (
    <div className="products-container">
      <h2 className="title">🛒 Product Management</h2>

      {/* ADD PRODUCT */}
      <form onSubmit={handleAdd} className="add-form">
        <input
          placeholder="Product Name"
          value={thename}
          onChange={(e) => setTheName(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={theprice}
          onChange={(e) => setThePrice(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* FILTERS */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <select
          value={sort}
          onChange={(e) => dispatch(sortByPrice(e.target.value))}
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>No products found</td>
              </tr>
            ) : (
              products.map((p) => {
                const isEditing = p.id === editingId;
                return (
                  <tr key={p.id}>
                    {isEditing ? (
                      <>
                        <td><input value={editname} onChange={(e) => setEditName(e.target.value)} /></td>
                        <td><input type="number" value={editprice} onChange={(e) => setEditPrice(e.target.value)} /></td>
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
                          <button onClick={() => handleUpdate(p.id)}>💾 Save</button>
                          <button onClick={() => setEditingId(null)}>✖ Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditStart(p)}>✏️ Edit</button>
                          <button onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                          <button onClick={() => handleAddToCart(p)}>➕ Add</button>
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
                onClick={() => dispatch(setPage(num))}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
