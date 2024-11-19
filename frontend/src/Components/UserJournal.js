import axios from "axios";
import { useEffect, useState,  } from "react";
import { useParams , useNavigate } from 'react-router-dom';



const UserJournal= () =>{
    const [userJournal, setUserJournal]=useState([]);
    const [isLoading , setIsLoading]=useState(true);
    const [error, setError] = useState(null);
    

    
    useEffect(()=>{
        const journals = async ()=>{ 
            try { const response = await axios.get(`/journal/dashboard`)
            console.log(response.data);
            setUserJournal(response.data)
        }
        catch(error){
           setError(error.message)
        }
          finally{
              setIsLoading(false)
          } 
          }; journals(); }  ,[]
          )
   
        //   if(isLoading)
        //     return <h1>Loading....</h1>
        // if(error)
        //     return <h2>Error occured</h2>
        // if(!userJournal)
        //     return <h2>You haven't created journal with now</h2>
    return(
        
        //   {/* Uploaded Journals Section */}
          <section class="bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-semibold mb-4">Your Uploaded Journals</h2>
          <div class="container mx-auto ">
           <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
            {userJournal.map((journal) => (
                <div class="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col" key={journal.id}> 
                <div class="w-full h-48 mb-2 overflow-hidden"> 
                <img src={journal.image} alt={journal.title}/>
      </div> 
                <h3 class="text-lg font-semibold mb-2 text-center dark:text-white text-gray-700">{journal.title}</h3> 
                <p class="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">{journal.content}</p> 
      </div> ))}  </div> </div>
          
      
      </section>
        
    )
}

export default UserJournal;
