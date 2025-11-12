import { createSelector } from "@reduxjs/toolkit";
import {type RootState } from "../app/store";

export const selectFilteredProducts = createSelector(
  (state: RootState) => state.products.products,
  (state: RootState) => state.products.searchQuery,
  (state: RootState) => state.products.sort,
 // (state: RootState) => state.products.byRating,
  (products, searchQuery, sort
    // , byRating
) => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
       String(p.name) .toLowerCase().includes(String(searchQuery).toLowerCase())
      );
    }

    // if (byRating) {
    //   filtered = filtered.filter((p) => (p.rating || 0) >= byRating);
    // }

    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }
);
