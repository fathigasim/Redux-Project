import Pagination from "react-bootstrap/Pagination";
interface MyComponentProps {
      totalPages: number;
      page: number;
       setSearchParams: (params: Record<string, string>) => void;
      searchParams: URLSearchParams;
    }

function MyPagination({ totalPages, page, setSearchParams, searchParams }: MyComponentProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (num) => {
    const params = {
      ...Object.fromEntries(searchParams),
      page: num.toString(),
    };
    setSearchParams(params);
  };

  const paginationItems = [];
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
      <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
      <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
      {paginationItems}
      <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
    </Pagination>
  );
}

export default MyPagination;
