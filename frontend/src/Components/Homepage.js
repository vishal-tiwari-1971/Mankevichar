import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useState, useEffect } from 'react';
import Card from './Card'
import Navbar from './Navbar'
import TrendingJournal from './TrendingJournals';

const HomePage = () => { 
    
  return (
    <div>
        
<Navbar/>


<section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Write, Reflect, and Share: A Simple Way to Keep Your Diary</h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Writing your thoughts has never been easier. Whether you're jotting down daily reflections or sharing longer stories with the world, our platform makes it simple to get started. Explore trending diaries from other users, create your own, and build a diary.</p>
            <Link to="/signup" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Get started
                <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </Link>
            <Link to="/login" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Login
            </Link> 
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img class="bg-black" src="https://th.bing.com/th/id/OIP.V-mRH8CuHEj3V4D6nRDAzgHaHa?w=650&h=650&rs=1&pid=ImgDetMain" alt="mockup"/>
        </div>                
    </div>
</section>

<TrendingJournal/>

<footer class="bg-white dark:bg-gray-900">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-center">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400 ">© 2024 <h4>Man Ke Vichar™</h4>. All Rights Reserved.
    </span>
   
    </div>
</footer>
     </div> 
  )
}

export default HomePage;
