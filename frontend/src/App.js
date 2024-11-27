import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/Homepage'; // Import your HomePage
import CreateDiaryPage from './Components/Create'
// import Navbar from './Components/Navbar'
// import Card from './Components/Card'
import Signup from './Components/Signup'
import Login from './Components/Login'
import './index.css'
import './App.css'
import Profile from './Components/Profile';
import Dashboard from './Components/Dashboard';
import Support from './Components/Support';
import Journal from './Components/Journal';
import Update from './Components/Update.Journal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateDiaryPage />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/support" element={<Support/>}/>
        <Route path="/journal/entry/:id" element={<Journal/>}/>
        <Route path="/update/:id" element={<Update/>}/>
       </Routes>       
    </Router>
    );
}

export default App;
