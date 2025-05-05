"use client"
import React from 'react'; 
import Image from 'next/image';

const Custom404 = () => {
  return ( 
    <div className='flex flex-col items-center justify-center bg-white gap-4 h-screen'>
         <div >
            <Image 
              src="/static/esimaintKC.png" 
              alt="Image" 
              width={250} 
              height={250} 
              className='rounded-full'
            />
          </div>
          <div className='text-center'>
            <h1 className="text-9xl sm:text-11xl font-bold text-[darkBlue] mb-6">404</h1>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[darkBlue] mb-6">Oops! Can't Find That Page</h2>
            <p className="max-w-lg mx-auto text-xl font-semibold text-gray-500 mb-12 md:mb-20">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <a className="relative group inline-block py-3 px-5 text-center text-sm font-semibold text-orange-50 bg-orange-900 rounded-full overflow-hidden" href="#" style={{backgroundColor:'#F97316', marginTop:'-30px'}}>
                <div className="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500" style={{backgroundColor:'darkblue'}}></div>
                <span className="relative">Take me home</span>
            </a>
          </div>
    </div>
  );
};

export default Custom404;
