export type PaginationInput = {
    page?: number;
    itemsPerPage?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}