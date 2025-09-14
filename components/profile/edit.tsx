'use client'
import getCroppedImg from '@/lib/utils/cropImage';
import { editProfileSchema, EditProfileType } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { Camera, Loader2, UserRound } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { FormProvider, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';


import { UserApiResponseType } from '@/types/user';
import { updateCurrentUser } from '@/actions/user.actionns';

const EditProfile = ({ 
  setIsEdit, 
  user
}: { 
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UserApiResponseType;
}) => {
  

  


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>({ x: 0, y: 0, width: 150, height: 150 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      miniDescription: '',
      country: '',
      bio: '',
 
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        miniDescription: user.miniDescription || '',
        country: user.country || '',
        bio: user.bio || '',
        previousImage: user.image || '',

       
      });
      setImagePreview(user.image || '/Images/feed/avatar.png');
    form.setValue("imageRemoved", false);
    }
  }, [user]);



  // Handle image file selection and preview
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      form.setValue('image', file); // <-- Add file to form.image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };
  // Cropper callbacks
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Ensure croppedAreaPixels is set on cropper mount
  useEffect(() => {
    if (showCropper && imagePreview) {
      setCroppedAreaPixels({ x: 0, y: 0, width: 150, height: 150 });
    }
  }, [showCropper, imagePreview]);

  const handleCropSave = async () => {
    if (!imagePreview || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels);
      setImageFile(new File([croppedBlob], imageFile?.name || 'cropped.png', { type: croppedBlob.type }));
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setImagePreview(croppedUrl);
      setShowCropper(false);
    } catch (err) {
      alert('Failed to crop image');
    }
  };


  const onSubmit = async (data: EditProfileType) => {
    console.log("Form submitted with data:", data);
    setIsUploading(true);
    try {
      await updateCurrentUser(user?._id || '', data);
      setIsEdit(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Profile</h2>
        <p className="text-gray-600">Update your profile information</p>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit, errors => {
            console.error('Form validation errors:', errors);
          })();
        }}>
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="relative">
                <Image
                  src={imagePreview || '/Images/feed/avatar.png'}
                  alt="Profile Picture"
                  width={150}
                  height={150}
                  className="rounded-full w-[150px] h-[150px] object-cover border-4 border-gray-200 shadow-lg"
                />
                {/* Upload overlay */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Camera className="text-white h-8 w-8" />
                </div>
              </div>
              {/* Removed upload button */}
              {/* Red dustbin (trash) icon for remove profile image - right side */}
              <button
                type="button"
                onClick={() => {
                  setImagePreview('/Images/feed/avatar.png');
                  setImageFile(null);
                  form.setValue("imageRemoved", true);
                }}
                className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
                aria-label="Remove profile image"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>
            {/* Cropping/Resizing UI */}
            {showCropper && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[500px] flex flex-col">
                  <h3 className="text-lg font-semibold text-center mb-4">Crop Your Image</h3>
                  <div className="relative flex-1 min-h-[300px]">
                    <Cropper
                      image={imagePreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="flex gap-4 mt-4 justify-center">
                    <Button 
                      type="button" 
                      onClick={handleCropSave} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Save Crop
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setShowCropper(false)} 
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              Click to change profile picture (max 5MB)
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...field}
                        className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        {...field}
                        className="pl-11 h-12 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    placeholder="Enter your country"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="miniDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Mini Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full p-3 bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    placeholder="Short description about yourself..."
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Bio</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1 flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {(form.formState.isSubmitting || isUploading) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setImagePreview(user?.image || '/Images/feed/avatar.png');
                setImageFile(null);
             form.setValue("imageRemoved", false);
                setIsEdit(false);
              }}
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProfile;
