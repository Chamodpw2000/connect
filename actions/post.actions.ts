import { POSTS_ENDPOINTS } from "@/constants/api-endpoints.constants";
import api from "@/lib/interceptors";
import mediaUpload from "@/lib/superbaseClient";
import { ImagePreview } from "@/types/posts";
import { postFormType } from "@/validations/post";

import { toast } from "react-toastify";

 

export const getPosts =  async( page: number) => {

    try {
        const response = await api.get(POSTS_ENDPOINTS.GET_ALL, {
            params: {
                page
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }

}




  export const AddPost = async ({ formValues , imagePreviews, email}: { formValues: postFormType , imagePreviews: ImagePreview[] , email: string }) => {

 
        try {
            let imageurls: string[] = [];

            // Only upload if there are images
            if (imagePreviews.length > 0) {
                const promises = imagePreviews.map(imagePreview =>
                    mediaUpload(imagePreview.file)
                );
                imageurls = await Promise.all(promises) as string[];
            }

            const response = await api.post('/posts', {
                title: formValues.title,
                description: formValues.description,
                images: imageurls,
                userEmail:email,
            });

            if (response.status === 200) {
                const result = response.data;
                toast.success('Post created successfully!');
                // Clean up object URLs
                imagePreviews.forEach(img => URL.revokeObjectURL(img.url));
                
                
        
            } else {
                throw new Error('Failed to create post');
                toast.error('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create post. Please try again.');
        } 
    };

    



