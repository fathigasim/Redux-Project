import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";
import { fetchProducts, addProduct,updateProduct,type Product } from "../features/productSlice";

const Products: React.FC = () => {
  const { product, loading, error } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch<AppDispatch>();

  const [thename, setTheName] = useState("");
  const [theprice, setThePrice] = useState(""); // keep as string
// --- State for EDITING functionality ---
  // Tracks the ID of the product currently being edited (null if none)
  const [editingId, setEditingId] = useState<string | null>(null); 
  // State for the inputs inside the edit row
  const [editname, setEditName] = useState("");
  const [editprice, setEditPrice] = useState("");
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!thename || !theprice) return; // prevent empty

    dispatch(addProduct({ 
      name: thename, 
      price: Number(theprice) 
    }));

    setTheName("");
    setThePrice("");
  };
const handleEditStart = (product: Product) => {
    // 1. Set the ID of the product being edited
    setEditingId(product.id);
    // 2. Populate the edit state with the current product data
    setEditName(product.name);
    setEditPrice(String(product.price)); // Convert number back to string for input value
  };
  const handleUpdate = (id: string) => {
    if (!editname || !editprice || isNaN(Number(editprice))) return;

    // Dispatch the thunk with the data from the edit state
    dispatch(updateProduct({ 
      id: id, 
      name: editname, 
      // Ensure price is converted back to a number/string format your thunk expects
      price: Number(editprice) 
    }));
    
    // Reset editing state
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  return (
      <div style={{ padding: "20px" }}>
      <h2>Products CRUD Demo</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ADD PRODUCT FORM (Omitted for brevity, but it's correct) */}
      <form onSubmit={handleAdd}>
        {/* ... form inputs for thename and theprice ... */}
        <input
          placeholder="Name"
          value={thename}
          onChange={(e) => setTheName(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={theprice}
          onChange={(e) => setThePrice(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
      
      <hr />

      {/* PRODUCT LIST TABLE */}
      <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
          {product.map((u) => {
            // Check if the current product is the one being edited
            const isEditing = u.id === editingId;

            return (
              <tr key={u.id}>
                
                {/* 1. NAME and PRICE cells */}
                {isEditing ? (
                  <>
                    <td>
                      <input 
                        type="text" 
                        value={editname} 
                        onChange={(e) => setEditName(e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={editprice} 
                        onChange={(e) => setEditPrice(e.target.value)} 
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.price}</td>
                  </>
                )}

                {/* 2. ACTIONS cell */}
                <td>
                  {isEditing ? (
                    // Save/Cancel buttons when editing
                    <>
                      <button onClick={() => handleUpdate(u.id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    // Edit button when not editing
                    <button onClick={() => handleEditStart(u)}>Edit</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
