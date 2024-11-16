import {React, useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const TrendingJournal=({journals = []})=>{
    const [journalList, setJournalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getJournals = async () => {
          try {
            const response = await axios.get('/journal/entries'); 
            console.log(response.data); // Check the structure of the data
            setJournalList(response.data); 
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        getJournals();
      }, []);
 
      if (loading) return <div>Loading...</div>;
      if (error) return <div>error accured</div>;
    return(
<section class="bg-white dark:bg-gray-900">
<div class="flex justify-center"> <h2 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white font-serif ">Trending Diaries</h2></div>
<div class="container mx-auto ">
           <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
            {journalList.map((journal) => (
                <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col" key={journal.id}> 
                <div class="w-full h-48 mb-2 overflow-hidden"> 
                  {journal.image ? <img class="w-full h-full object-contain object-center" src={journal.image} alt={journal.title} loading="lazy"/> : <img src={`https://placehold.co/800?text=${journal.title}&font=roboto`}class='w-full h-full object-contain object-center' alt={journal.title}/>
   }   </div> 
                <h3 class="text-lg font-semibold mb-2 text-center dark:text-white text-gray-700">{journal.title}</h3> 
                <p class="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">{journal.content}</p> 
            <div className="flex justify-end gap-4"><button> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg></button>
<button><Link to={`/journal/entry/${journal._id}`}>Read More</Link> </button>
</div>
            
            </div>))}
            </div>
          </div>
</section>
    )
}
export default TrendingJournal;