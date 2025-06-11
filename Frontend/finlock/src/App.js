import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute';
//Pages
import NeoWealthLanding from './pages/landingpage';
import AccountsPage from './pages/account.jsx';
import RegisterPage from './pages/Register';
const Dashboard = lazy(() => import("./pages/dashboard.jsx"));
const SignInPage = lazy(() => import("./pages/Signin.jsx"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className="text-center mt-20">Loading page...</div>}>
      <Routes>
        <Route path="/" element={<NeoWealthLanding/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/account/:accountId" element={<AccountsPage/>}/>

      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
