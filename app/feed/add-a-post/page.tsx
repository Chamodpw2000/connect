'use client'
import mediaUpload from '@/lib/superbaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus, Upload, X } from 'lucide-react'; // You can install lucide-react or use any icon library
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';

const formSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }).max(50, { message: 'Title must be at most 50 characters' }),
    description: z.string().min(6, { message: 'Description must be at least 6 characters' }).max(500, { message: 'Description must be at most 500 characters' }),
});

interface ImagePreview {
    file: File;
    url: string;
    id: string;
}

const Page = () => {
    const [imagesPreviews, setImagesPreviews] = useState<ImagePreview[]>([]);
    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const removeImage = (id: string) => {
        setImagesPreviews(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            if (imageToRemove) {
                // Clean up the object URL to prevent memory leaks
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prev.filter(img => img.id !== id);
        });
    };

    const onSubmit = async (formValues: z.infer<typeof formSchema>) => {
        if (!session?.user?.email) {
            alert('You must be logged in to create a post');
            return;
        }

        setIsSubmitting(true);
        try {
            let imageurls: string[] = [];
            
            // Only upload if there are images
            if (imagesPreviews.length > 0) {
                const promises = imagesPreviews.map(imagePreview => 
                    mediaUpload(imagePreview.file)
                );
                imageurls = await Promise.all(promises) as string[];
            }

            const response = await axios.post('/api/posts', {
                title: formValues.title,
                description: formValues.description,
                images: imageurls,
                userEmail: session.user.email,
            });

            if (response.status === 200) {
                const result = response.data;
toast.success('Post created successfully!');                
                // Clean up object URLs
                imagesPreviews.forEach(img => URL.revokeObjectURL(img.url));
                setImagesPreviews([]); // Clear previews after successful submission
                form.reset(); // Reset the form fields
                
                router.push('/feed');
            } else {
                throw new Error('Failed to create post');
                toast.error('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clean up object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            imagesPreviews.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, []);

    if (!session) {
        return (
            <div className="text-center">
                <p>You must be logged in to create a post.</p>
            </div>
        );
    }

    return (
        <div className='mx-auto p-6 w-full'>
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        {...form.register('title')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your post title"
                    />
                    {form.formState.errors.title && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...form.register('description')}
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="What's on your mind?"
                    />
                    {form.formState.errors.description && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.description.message}
                        </p>
                    )}
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Photos ({imagesPreviews.length})
                    </label>
                    
                    {/* Image Previews Grid */}
                    {imagesPreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {imagesPreviews.map((imagePreview) => (
                                <div key={imagePreview.id} className="relative group">
                                    <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200">
                                        <Image
                                            src={imagePreview.url}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(imagePreview.id)}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {imagePreview.file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                            </div>
                            <input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Add More Photos Button (Alternative) */}
                    {imagesPreviews.length > 0 && (
                        <div className="flex justify-center">
                            <label htmlFor="more-images" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                <Plus size={16} className="mr-2" />
                                Add More Photos
                            </label>
                            <input
                                id="more-images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
