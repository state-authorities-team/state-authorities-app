
import styles from "../../styles/Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    const boundaryRange = 1;

    pages.push(1);

    if (currentPage - boundaryRange > 2) {
      pages.push("ellipsis-start");
    }

    const startPage = Math.max(2, currentPage - boundaryRange);
    const endPage = Math.min(totalPages - 1, currentPage + boundaryRange);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage + boundaryRange < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageElements = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <button
        className={styles.navButton}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>

      {pageElements.map((item, index) => {
        if (typeof item === "string") {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${item}`}
            className={`${styles.pageButton} ${
              currentPage === item ? styles.active : ""
            }`}
            onClick={() => onPageChange(item)}
            disabled={currentPage === item}
          >
            {item}
          </button>
        );
      })}

      <button
        className={styles.navButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
    </div>
  );
}
