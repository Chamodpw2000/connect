import { ImagePreview } from "@/types/posts";

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