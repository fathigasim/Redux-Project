import React from "react";
import Pagination from "react-bootstrap/Pagination";

interface MyPaginationProps {
  totalPages: number;
  page: number;
  setSearchParams: (params: Record<string, string>) => void;
  searchParams: URLSearchParams;
}

const CustomPagination: React.FC<MyPaginationProps> = ({
  totalPages,
  page,
  setSearchParams,
  searchParams,
}) => {
  if (totalPages <= 1) return null;

 const handlePageChange = (num: number) => {
    if (num < 1 || num > totalPages || num === page) return; // prevent invalid navigation

    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      page: num.toString(),
    };
    setSearchParams(params);
  };

  const paginationItems: React.ReactElement[] = [];
  for (let num = 1; num <= totalPages; num++) {
    paginationItems.push(
      <Pagination.Item
        key={num}
        active={num === page}
        onClick={() => handlePageChange(num)}
      >
        {num}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
      />
      {/* <Pagination.Prev
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      /> */}
      {paginationItems}
      {/* <Pagination.Next
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      /> */}
      <Pagination.Last
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
      />
    </Pagination>
  );
};

export default CustomPagination;
