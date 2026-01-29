import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import { type URLSearchParamsInit } from "react-router-dom";

interface PaginationbootstrapProps {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
  setSearchParams: (nextInit: URLSearchParamsInit) => void;
  maxVisible?: number; // Maximum visible page numbers (default: 5)
}

const Paginationbootstrapnew: React.FC<PaginationbootstrapProps> = ({
  page,
  totalPages,
  searchParams,
  setSearchParams,
  maxVisible = 5, // Show 5 page numbers by default
}) => {
  const handlePageChange = (num: number) => {
    if (num < 1 || num > totalPages) return;
    
    const params = {
      ...Object.fromEntries(searchParams),
      page: num.toString(),
    };
    setSearchParams(params);
  };

  // Calculate which page numbers to show
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    // Always show first page
    pages.push(1);

    // Calculate start and end of visible range
    let start = Math.max(2, page - halfVisible);
    let end = Math.min(totalPages - 1, page + halfVisible);

    // Adjust if near the beginning
    if (page <= halfVisible + 1) {
      end = Math.min(maxVisible, totalPages - 1);
      start = 2;
    }

    // Adjust if near the end
    if (page >= totalPages - halfVisible) {
      start = Math.max(2, totalPages - maxVisible);
      end = totalPages - 1;
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("ellipsis-start");
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <Container className="d-flex justify-content-center mt-4">
      <Pagination>
        {/* First */}
        <Pagination.First
          disabled={page === 1}
          onClick={() => handlePageChange(1)}
        />

        {/* Previous */}
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        />

        {/* Page Numbers */}
        {pageNumbers.map((num, index) => {
          if (typeof num === "string") {
            // Render ellipsis
            return <Pagination.Ellipsis key={num} disabled />;
          }

          return (
            <Pagination.Item
              key={num}
              active={num === page}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </Pagination.Item>
          );
        })}

        {/* Next */}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        />

        {/* Last */}
        <Pagination.Last
          disabled={page === totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      </Pagination>
    </Container>
  );
};

export default Paginationbootstrapnew;