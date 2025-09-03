import { BadgeCheck } from 'lucide-react'
import React from 'react'
import { BiLike } from 'react-icons/bi'
import { MdOutlineManageSearch } from 'react-icons/md'

const Result = () => {
  return (
    <main className='flex flex-col md:flex-row gap-5 md:gap-0 justify-between items-center'>
        <div className='flex flex-col items-center text-center w-full md:w-[320px] rounded-lg p-4 shadow'>
            <BadgeCheck width={60} height={60} className='text-[#00B140]' />
            <h1 className='text-5xl text-[#00B140] font-bold mt-4 mb-2'>12 609</h1>
            <p className='text-gray-600 font-semibold max-w-2xl'>Анкет с контактами мастеров</p>
        </div>
        <div className='flex flex-col items-center w-full text-center md:w-[320px] rounded-lg p-4 shadow'>
            <BiLike  width={60} height={60} className='text-[#00B140] text-6xl' />
            <h1 className='text-5xl text-[#00B140] font-bold mt-4 mb-2'>95%</h1>
            <p className='text-gray-600 font-semibold max-w-2xl'>Специалистов с отличными отзывами</p>
        </div>
        <div className='flex flex-col items-center w-full text-center md:w-[320px] rounded-lg p-4 shadow'>
            <MdOutlineManageSearch width={60} height={60} className='text-[#00B140] text-6xl' />
            <h1 className='text-5xl text-[#00B140] font-bold mt-4 mb-2'>216</h1>
            <p className='text-gray-600 font-semibold max-w-2xl'>Заявок мы принимаем ежедневно</p>
        </div>
        
    </main>
  )
}

export default Result