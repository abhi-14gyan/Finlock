import { Route, Routes } from 'react-router-dom';

//Pages
import SignInPage from './pages/Signin';
import NeoWealthLanding from './pages/landingpage';
import RegisterPage from './pages/Register';
import Dashboard from './pages/dashboard';
import { AuthProvider } from "./context/AuthContext";

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NeoWealthLanding/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>
    </div>
  );
}

export default App;
