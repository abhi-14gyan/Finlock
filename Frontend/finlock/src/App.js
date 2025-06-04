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
      <h1>This is the front end</h1>
    </div>
  );
}

export default App;
