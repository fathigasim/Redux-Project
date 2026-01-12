import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import {type URLSearchParamsInit } from "react-router-dom";

interface PaginationbootstrapProps {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
  setSearchParams: (nextInit: URLSearchParamsInit) => void;
}

const Paginationbootstrap: React.FC<PaginationbootstrapProps> = ({
  page,
  totalPages,
  searchParams,
  setSearchParams,
}) => {
  const handlePageChange = (num: number) => {
    const params = {
      ...Object.fromEntries(searchParams),
      page: num.toString(),
    };
    setSearchParams(params);
  };

  return (
    <Container className="d-flex justify-content-center mt-4">
      {totalPages > 1 && (
        <Pagination>
          {/* Previous */}
          <Pagination.Prev
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          />

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1;
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
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          />
        </Pagination>
      )}
    </Container>
  );
};

export default Paginationbootstrap;
