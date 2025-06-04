<<<<<<< HEAD
import logo from './logo.svg';
=======
import { Route, Routes } from 'react-router-dom';

//Pages
import SignInPage from './pages/Signin';

>>>>>>> d28268f4e48775b60cc92b5feffb328478518a2c
import './App.css';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
      <Routes>
        <Route path="/signin" element={<SignInPage/>}/>
      </Routes>
      <h1>This is the front end</h1>
>>>>>>> d28268f4e48775b60cc92b5feffb328478518a2c
    </div>
  );
}

export default App;
