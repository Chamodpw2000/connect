"use server"
import { POSTS_ENDPOINTS } from "@/constants/api-endpoints.constants";
import api from "@/lib/interceptors";
import mediaUpload from "@/lib/superbaseClient";
import { validateInput } from "@/lib/validations/inputValidator";
import { postFormSchema, postFormType } from "@/lib/validations/post";
import { PaginationInput } from "@/types/common";
import { revalidatePath } from "next/cache";





export const getPosts = async (
  paginationInput?: PaginationInput,
  email?: string
) => {
  const { page = 1, itemsPerPage = 5, sortBy = 'createdAt', sortOrder = 'desc' } = paginationInput ?? {};
  const params: any = {
    page,
    itemsPerPage,
    sortBy,
    sortOrder,
  };
  if (email) params.email = email;
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(POSTS_ENDPOINTS.GET_ALL + `?${queryString}`);
  return response.data;
}




export const addPost = async ({ data }: { data: postFormType }) => {
    const validatedData = validateInput(postFormSchema, data);
    let imageurls: string[] = [];
    // Only upload if there are images
    if (validatedData.images && validatedData.images.length > 0) {
        const promises = validatedData.images.map(imagePreview =>
            mediaUpload(imagePreview.file)
        );
        imageurls = await Promise.all(promises) as string[];
    }
    const response = await api.post('/posts', {
        title: data.title,
        description: data.description,
        images: imageurls,
        userId: data.author,
    });
 
    validatedData.images?.forEach(img => URL.revokeObjectURL(img.url));
    revalidatePath('/feed');
    return response.data;
};





