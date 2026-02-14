import { imagePreviewSchema } from "@/types/common";
import z from "zod";
export const postFormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }).max(50, { message: 'Title must be at most 50 characters' }),
    description: z.string().min(6, { message: 'Description must be at least 6 characters' }).max(500, { message: 'Description must be at most 500 characters' }),
    visibility: z.enum(['private', 'friends', 'public']),
    images: z.array(imagePreviewSchema).optional(),
    author: z.string(),
});
export type postFormType = z.infer<typeof postFormSchema>;

