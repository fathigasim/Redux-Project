// components/Paginationbootstrap.tsx
import React, { useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";

interface PaginationbootstrapProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number; // Maximum number of page buttons to show
  showFirstLast?: boolean; // Show first/last buttons
  size?: "sm" | "lg"; // Pagination size
}

const Paginationbootstrap: React.FC<PaginationbootstrapProps> = ({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showFirstLast = true,
  size,
}) => {
  // Calculate which page numbers to display
  const pageNumbers = useMemo(() => {
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages, maxVisible]);

  // Show ellipsis indicators
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

  if (totalPages <= 1) return null;

  return (
    <Container className="d-flex justify-content-center mt-4">
      <Pagination size={size}>
        {/* First Page */}
        {showFirstLast && (
          <Pagination.First
            disabled={page === 1}
            onClick={() => onPageChange(1)}
            aria-label="Go to first page"
          />
        )}

        {/* Previous */}
        <Pagination.Prev
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Go to previous page"
        />

        {/* Start Ellipsis */}
        {showStartEllipsis && (
          <>
            <Pagination.Item onClick={() => onPageChange(1)}>
              1
            </Pagination.Item>
            <Pagination.Ellipsis disabled />
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((num) => (
          <Pagination.Item
            key={num}
            active={num === page}
            onClick={() => onPageChange(num)}
            aria-label={`Go to page ${num}`}
            aria-current={num === page ? "page" : undefined}
          >
            {num}
          </Pagination.Item>
        ))}

        {/* End Ellipsis */}
        {showEndEllipsis && (
          <>
            <Pagination.Ellipsis disabled />
            <Pagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Pagination.Item>
          </>
        )}

        {/* Next */}
        <Pagination.Next
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Go to next page"
        />

        {/* Last Page */}
        {showFirstLast && (
          <Pagination.Last
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Go to last page"
          />
        )}
      </Pagination>
    </Container>
  );
};

export default Paginationbootstrap;