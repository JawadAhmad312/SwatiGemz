const ProductPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                page === currentPage
                  ? "bg-gradient-to-r from-[#092805] to-[#224225] text-white scale-110 shadow"
                  : "bg-white hover:bg-gradient-to-r from-[#092805] hover:to-[#224225] hover:text-white"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          →
        </button>
    </div>
  );
};

export default ProductPagination;
