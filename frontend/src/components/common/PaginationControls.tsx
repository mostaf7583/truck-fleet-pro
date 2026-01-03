
import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFirst: boolean;
    isLast: boolean;
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    isFirst,
    isLast,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    // Simple strategy: show current, prev, next, first, last, ellipsis
    // For now, let's keep it simple: First, Prev, Current surroundings, Next, Last

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(0);

            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages - 2, currentPage + 1);

            // Adjust if near start
            if (currentPage < 3) {
                start = 1;
                end = Math.min(totalPages - 2, 3);
            }

            // Adjust if near end
            if (currentPage > totalPages - 4) {
                start = Math.max(1, totalPages - 4);
                end = totalPages - 2;
            }

            if (start > 1) {
                pages.push(-1); // Ellipsis marker
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 2) {
                pages.push(-2); // Ellipsis marker
            }

            // Always include last page
            pages.push(totalPages - 1);
        }
        return pages;
    };

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => !isFirst && onPageChange(currentPage - 1)}
                        className={isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => {
                    if (page < 0) {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => onPageChange(page)}
                                className="cursor-pointer"
                            >
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => !isLast && onPageChange(currentPage + 1)}
                        className={isLast ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
