
import { ImagePreview } from "@/types/common";
import mediaUpload from "./superbaseClient";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

 export const handleImageChange = ({e, setImagesPreviews}: {e: React.ChangeEvent<HTMLInputElement>, setImagesPreviews: React.Dispatch<React.SetStateAction<ImagePreview[]>>}   ) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ImagePreview[] = [];

        Array.from(files).forEach((file) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                return;
            }

            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is too large. Maximum size is 5MB`);
                return;
            }

            const imagePreview: ImagePreview = {
                file,
                url: URL.createObjectURL(file),
                id: Math.random().toString(36).substr(2, 9)
            };

            newImages.push(imagePreview);
        });

        setImagesPreviews(prev => [...prev, ...newImages]);

        // Reset the input value so the same file can be selected again if needed
        e.target.value = '';
    };

    export const removeImage = ({id, setImagesPreviews}: {id: string, setImagesPreviews: React.Dispatch<React.SetStateAction<ImagePreview[]>>}) => {
        setImagesPreviews(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            if (imageToRemove) {
                // Clean up the object URL to prevent memory leaks
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prev.filter(img => img.id !== id);
        });
    };

// Upload single image to Supabase for profile
export const uploadImageToSupabase = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file selected");
            return;
        }

        const timestamp = new Date().getTime();
        const fileName = `profile_${timestamp}_${file.name}`;
        
        supabase.storage
            .from("images")
            .upload(fileName, file, { cacheControl: '3600', upsert: false })
            .then(() => {
                const publicUrl = supabase.storage
                    .from("images")
                    .getPublicUrl(fileName).data.publicUrl;
                resolve(publicUrl);
            })
            .catch((error) => {
                console.log(error);
                reject("Upload failed");
            });
    });
};

// Delete image from Supabase
export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Extract filename from URL
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            supabase.storage
                .from("images")
                .remove([fileName])
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
                    reject("Delete failed");
                });
        } catch (error) {
            reject("Invalid image URL");
        }
    });
};