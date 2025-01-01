import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import ProfileDetails from "./components/ProfileDetails.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import ConnectionRequest from "./components/ConnectionRequest.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register/*" element={<Register />} />
          <Route path="profile/*" element={<Profile />} />
          <Route path="profile-details/*" element={<ProfileDetails />} />
          <Route path="connection-request/*" element={<ConnectionRequest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
