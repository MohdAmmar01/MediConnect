import axios from 'axios';
axios.defaults.withCredentials = true;

import { BrowserRouter,Routes,Route } from 'react-router-dom';


import Home from './screens/Home';
import Error from './screens/Error';
import LoginPage from './screens/Login';
import ResetPasswordPage from './screens/ResetPassword';
import ForgetPasswordPage from './screens/ForgetPassword';
import RegisterPage from './screens/Register';
import Navbar from './components/Navbar';
import MyAppointments from './screens/MyAppointments';
import Chats from './screens/Chats';
import Message from './screens/Message';
import Profile from './screens/Profile';

import Providers from '../redux/Providers';
import { Toaster } from 'react-hot-toast';
// import ExpireUser from '/components/ExpireUser'

axios.defaults.withCredentials = true;
function App() {
  return (
  <>

  <BrowserRouter>
  <Providers>

    <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/my-appointments" element={<MyAppointments />} />
          <Route exact path="/chats" element={<Chats />} />
          <Route exact path="/chat/:id" element={<Message />} />
          <Route exact path="/profile" element={<Profile />} />

          <Route exact  path="/login" element={<LoginPage />} />
          <Route exact  path="/register" element={<RegisterPage />} />
          <Route exact  path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route exact  path="/reset-password" element={<ResetPasswordPage />} />
          
             
          <Route exact path="*" element={<Error/>} />
        </Routes>
        </Providers>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
        </BrowserRouter>
  </>
  );
}

export default App;
