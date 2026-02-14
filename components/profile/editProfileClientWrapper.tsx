'use client'
import CustomButton from '@/components/common/button'
import DisplayProfile from '@/components/profile/display'
import EditProfile from '@/components/profile/edit'
import { UserApiResponseType } from '@/types/user'
import React from 'react'

interface EditProfileClientWrapperProps {
  user?: UserApiResponseType;
}

const EditProfileClientWrapper = ({ user }: EditProfileClientWrapperProps) => {

    const [isEdit, setIsEdit] = React.useState(false);

    

    return (
        <div>

            <div className="flex w-full min-h-screen">
                <div className="lg:flex flex-1 bg-accent w-full hidden">

                    <div className="text-gray-700 text-xl font-bold w-full p-5">


 



                    </div>

                </div>
    <div className="flex flex-3 p-5 w-full flex-col items-center justify-start">
       {isEdit ? <EditProfile setIsEdit={setIsEdit} user={user} /> : <DisplayProfile user={user} />}

        {!isEdit && <CustomButton label="Edit Profile" onClick={() => setIsEdit(true)} className='mt-[20px]' />}
       

</div>
               
                <div className="lg:flex flex-1 bg-accent hidden ">

                </div>

            </div>


        </div>
    )
}

export default EditProfileClientWrapper