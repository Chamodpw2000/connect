import z from "zod";

export type PaginationInput = {
    page?: number;
    itemsPerPage?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const imagePreviewSchema = z.object({
  file: z.any(), // or z.instanceof(File) if you want to be strict
  url: z.string(),
  id: z.string(),
});

export type ImagePreview = z.infer<typeof imagePreviewSchema>;
