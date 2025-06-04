import { Route, Routes } from 'react-router-dom';

//Pages
import SignInPage from './pages/Signin';
import NeoWealthLanding from './pages/landingpage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/" element={<NeoWealthLanding/>}/>
      </Routes>
    </div>
  );
}

export default App;
