import React, {FC} from "react";
import {PaginationInfo} from "../../store/interfaces/comment.interface.ts";
import styles from "./pagination.module.sass";

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({pagination, onPageChange}) => {
    const {page, totalPages} = pagination;

    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Показываем все страницы
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Показываем первую страницу
            pages.push(1);

            if (page > 3) {
                pages.push("...");
            }

            // Показываем страницы вокруг текущей
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push("...");
            }

            // Показываем последнюю страницу
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                ←
            </button>

            {pageNumbers.map((pageNum, index) => {
                if (pageNum === "...") {
                    return (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                            ...
                        </span>
                    );
                }

                const pageNumber = pageNum as number;
                return (
                    <button
                        key={pageNumber}
                        className={`${styles.pageButton} ${page === pageNumber ? styles.active : ""}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                className={styles.pageButton}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                →
            </button>
        </div>
    );
};

