import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useState, useEffect } from 'react';
import Card from './Card'
import Navbar from './Navbar'

const HomePage = () => { 
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getJournals = async () => {
          try {
            const response = await axios.get('/journal/entries'); 
            setJournals(response.data); 
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        getJournals();
      }, []);
 
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
<section class="bg-white dark:bg-gray-900">
<div class="flex justify-center"> <h2 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white font-serif ">Trending Diaries</h2></div>
<div class="container mx-auto ">
           <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
            {journals.map((journal, index) => (
                <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col" key={index}> 
                <div class="w-full h-48 mb-2 overflow-hidden"> 
                  {journal.image ? <img class="w-full h-full object-contain object-center" src={journal.image} alt={journal.title} loading="lazy"/> : <img src={`https://placehold.co/800?text=${journal.title}&font=roboto`}class='w-full h-full object-contain object-center' alt={journal.title}/>
   }   </div> 
                <h3 class="text-lg font-semibold mb-2 text-center dark:text-white text-gray-700">{journal.title}</h3> 
                <p class="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">{journal.content}</p> 
            <div className="flex justify-end gap-4"><button> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg></button>
<button>Read More</button>
</div>
            
            </div>))}
            </div>
          </div>
</section>

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
