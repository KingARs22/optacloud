import Signuplogin from './Pages/Signuplogin';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Maps from './Pages/Maps';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyAddress from './Pages/MyAddress';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signuplogin/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/maps' element={<Maps/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/myaddress' element={<MyAddress/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
