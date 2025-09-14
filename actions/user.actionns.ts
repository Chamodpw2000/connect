'use server';
import { USERS_ENDPOINTS } from "@/constants/api-endpoints.constants";
import { deleteImageFromSupabase, uploadImageToSupabase } from "@/lib/handleImages";
import createServerApi from "@/lib/interceptors";
import { EditProfileType } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async (email: string) => {
  const axiosInstance = await createServerApi();
  const response = await axiosInstance.get(`${USERS_ENDPOINTS.GET_BY_EMAIL.replace(':email', email)}`);
  return response.data;
};

export const updateCurrentUser = async (id: string, data: EditProfileType) => {
  let finalImageUrl :string | null = data.previousImage || null;
   if (data.imageRemoved && data.previousImage && !data.previousImage.includes('/Images/feed/avatar.png')) {
        try {
          console.log("Deleting old image:", data.previousImage);
          await deleteImageFromSupabase(data.previousImage);
        } catch (error) {
          console.log("Error deleting old image:", error);
        }
        finalImageUrl = '/Images/feed/avatar.png';
      } 
      // If user selected a new image, upload it
      else if (data.image && (data.image)) {
        if (data.previousImage && !data.previousImage.includes('/Images/feed/avatar.png')) {
          try {
            console.log("Deleting old image:", data.previousImage);
            await deleteImageFromSupabase(data.previousImage);
          } catch (error) {
            console.log("Error deleting old image:", error);
          }
        }
        finalImageUrl = await uploadImageToSupabase((data.image));
      }

      const finalData = {
        ...data,
        image: finalImageUrl
      };


      const axiosInstance = await createServerApi();
      const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE.replace(':id', id), finalData);
      revalidatePath('/edit-profile');
      return response.data;
}






