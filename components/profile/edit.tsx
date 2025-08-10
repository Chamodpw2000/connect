
'use client'
import React from 'react';
import { useAuth } from '@/hooks/useUser'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'


const EditProfile = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      bio: '',
      image: '/Images/feed/avatar.png',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        country: user.country || '',
        bio: user.bio || '',
        image: user.image || '/Images/feed/avatar.png',
      });
    }
  }, [user, reset]);

  const imageValue = watch('image');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle image file selection and preview
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        reset({
          ...watch(),
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    // TODO: Add API call or state update logic here
    console.log(data);
  };

  return (
    <form className="flex w-full flex-col items-center justify-start" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <Image
          src={imageValue}
          alt={watch('firstName') || 'User Avatar'}
          width={300}
          height={300}
          className="rounded-full w-[300px] h-[300px] object-cover mb-4 cursor-pointer"
          onClick={handleImageClick}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-2 py-1 rounded text-xs opacity-80 cursor-pointer" onClick={handleImageClick}>
          Change Photo
        </span>
      </div>
      <div>
        <label className="block mb-2">
          First Name:
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message as string}</span>}
        </label>
        <label className="block mb-2">
          Last Name:
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message as string}</span>}
        </label>
        <label className="block mb-2">
          Country:
          <input
            type="text"
            {...register('country')}
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        <label className="block mb-2">
          Bio:
          <textarea
            {...register('bio')}
            className="border rounded px-2 py-1 w-full"
          />
        </label>
        {/* Add image upload logic if needed */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
