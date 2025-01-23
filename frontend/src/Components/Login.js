import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from 'axios'
import Navbar from "./Navbar";
import SignInWithGoogle from "./SignInWithGoogle";

const API_URL=process.env.REACT_APP_API_URL
const Login = () => {
  // to store values from frontend
  const [userEmail, setuserEmail] = useState("")
  const [userPassword, setuserPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  console.log(API_URL);
  
  console.log(userEmail, userPassword);

  const navigate = useNavigate()
  // to send data 
  const submitData = async () => {
    try {

      const data = {
        email: userEmail,
        password: userPassword,
      }
     
      const response = await axios.post(`/user/login`, data)
      console.log(response);

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        console.log("authToken", response.data.token);
        
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
       
        setSuccessMessage(response.data.message)
      }
    }
    catch (error) {
      if (error.response.status === 404) {
        setErrorMessage("User not found. Please sign up.");
      } else if (error.response.status === 400) {
        setErrorMessage("Incorrect password. Please try again.");
      }
      else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // submit data  
    submitData()
    setuserEmail("")
    setuserPassword("")
    setErrorMessage("")
  }

  //   try{ 

  //     if(response.status==200){
  //       alert("login successful")

  //     } else{
  //       alert("failed to login ");

  //     }
  //   }
  //   catch(error){
  //    console.error("getting error : ",error)
  //   }
  // }
  return (
    <div>
      <Navbar />
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          </div>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">

              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in to your account
                  </h1>
                  <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit} >
                      <div>
                          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                          <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="true" value={userEmail} onChange={(event)=> setuserEmail(event.target.value)}/>
                      </div>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" value={userPassword} onChange={(event)=> setuserPassword(event.target.value)}/>
                      </div>
                      <div class="flex items-center justify-between">
                          <div class="flex items-start">
                              <div class="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                              </div>
                              <div class="ml-3 text-sm">
                                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                              </div>
                          </div>
                          <a href="" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                      </div>
                      <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                     <SignInWithGoogle/>
                      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                          Don’t have an account yet? <Link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                      </p>
                  </form>
              </div>


          </div>
        </div>
      </section></div>
  )
}

export default Login;