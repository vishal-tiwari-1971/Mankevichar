import Navbar from './Components/Navbar'
import Card from './Components/Card'
import Signup from './Components/Signup'
import Login from './Components/Login'
import './index.css'

function App() {
  return (<>
    <Navbar/>
    <div class="mt-6 grid grid-cols-3 gap-4 ">
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    <Card/>
    </div>
    <Signup/>
    <Login/>
    </>
    );
}

export default App;
