'use client'
import { useEffect } from 'react';
import CustomButton from '../common/button';
import { useRouter, useSearchParams } from 'next/navigation';

type PagenationProps = {
  allPages: number;
}
const Paginantion = ({ allPages }: PagenationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Set page=1 in query on mount if not present
  useEffect(() => {
    if (!pageParam) {
      router.replace(`?page=1`);
    }
  }, [pageParam, router]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className='w-full flex justify-between mt-[20px]'>
      <CustomButton
        label="Previous Page"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      <CustomButton
        label="Next Page "
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === allPages}
      />
    </div>
  )
}

export default Paginantion