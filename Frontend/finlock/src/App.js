import { Route, Routes } from 'react-router-dom';

//Pages
import SignInPage from './pages/Signin';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignInPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
