import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profiles() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const Tabs = ["Profile", "Edit"];
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    skills: "",
    interests: "",
  });

  const [form, setForm] = useState({
    username: "",
    bio: "",
    skills: "",
    interests: "",
    role: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setForm({
          username: res.data.user.username || "",
          bio: res.data.profile.bio || "",
          skills: res.data.profile.skills || "",
          interests: res.data.profile.interests || "",
          role: res.data.user.role || "",
        });
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    fetchData();
  }, []);

  console.log(data);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    navigate(0);
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }
    try {
      const res = await axios.put(
        "http://localhost:3000/profile-update",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {}
  };

  const filterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getUsers = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/get-users", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setUsers(res.data.users);
    } catch (error) {}
  };

  const handleprofileclick = (index) => {
    const user = users[index];
    navigate("/profile-details", { state: { userid: user.user_id, user } });
  };

  const handletabchange = (index) => {
    setActiveTab(index);
    setIsEditingProfile(index !== 0);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  const handleDeleteProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:3000/delete-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="profile">
      <Navbar
        data={data}
        filters={filters}
        filterChange={filterChange}
        getUsers={getUsers}
      />
      <div className="profile-layout">
        <div id="search-details">
          <ul>
            {users.map((user, index) => (
              <li
                onClick={() => handleprofileclick(index)}
                id="result-tab"
                key={user.id}
              >
                <div id="user-img-div">
                  <div id="user-img"></div>
                </div>
                <div id="user-details">
                  <p id="username">{user.username}</p>
                  <p>Bio: {user?.bio?.substr(0, 100)} ...</p>
                  <div id="skill-interest-tab">
                    <div id="user-det-head">
                      <p style={{ fontWeight: "800" }}>Skills:&nbsp;</p>
                      <p>{user?.skills?.substr(0, 35)} ...</p>
                    </div>
                    <div id="user-det-head">
                      <p style={{ fontWeight: "800" }}> Interests:&nbsp;</p>
                      <p>{user?.interests?.substr(0, 35)} ...</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="profile-inputs">
          <div>
            <ul className="tabs">
              {Tabs.map((tab, index) => (
                <li
                  key={index}
                  onClick={() => handletabchange(index)}
                  className={`tab ${activeTab !== index ? "activeTab" : ""}`}
                >
                  <div>{tab}</div>
                </li>
              ))}
            </ul>
          </div>
          {isEditingProfile ? (
            <div>
              <div id="profile-input-details">
                <div id="username-role-edit">
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                  <select name="role" onChange={handleChange} value={form.role}>
                    <option value="">Select Role</option>
                    <option value="mentor">Mentor</option>
                    <option value="mentee">Mentee</option>
                  </select>
                </div>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Short Bio"
                ></textarea>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Skills"
                ></textarea>
                <textarea
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Interests"
                ></textarea>
              </div>
              <div id="profile-btns">
                <div>
                  <button onClick={handleLogout} id="logout-profile-button">
                    Logout
                  </button>
                  <button id="update-profile-button" onClick={handleSubmit}>
                    Update
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete your profile? This action cannot be undone."
                        )
                      ) {
                        handleDeleteProfile();
                      }
                    }}
                    id="delete-profile-button"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div id="profile-input-details">
                <div id="profile-details">
                  <h1 style={{ fontFamily: "Anaheim" }}>
                    Welcome, {data?.user?.username}!
                  </h1>
                  <div id="profile-detail-info">
                    <p id="detail-head" style={{ fontWeight: "800" }}>
                      Bio{" "}
                    </p>
                    <p>{data?.profile.bio}</p>
                    <p id="detail-head" style={{ fontWeight: "800" }}>
                      Skills{" "}
                    </p>
                    <p>{data?.profile.skills}</p>
                    <p id="detail-head" style={{ fontWeight: "800" }}>
                      Interests
                    </p>
                    <p>{data?.profile.interests}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar({ data, filters, filterChange, getUsers }) {
  const navigate = useNavigate();

  const handleconnectiondisplay = (e) => {
    navigate("/connection-request");
  };
  return (
    <div className="navbar">
      <Search
        filters={filters}
        filterChange={filterChange}
        getUsers={getUsers}
      />
      <div id="btn-profile-head">
        <button id="conn-display-home" onClick={handleconnectiondisplay}>
          Connections
        </button>
        <div id="profile-head">
          <h3>{data?.user?.username[0]}</h3>
        </div>
      </div>
    </div>
  );
}

function Search({ filters, filterChange, getUsers }) {
  return (
    <div id="search">
      <form id="search">
        <input
          className="searchbar"
          name="skills"
          value={filters.skills}
          onChange={filterChange}
          placeholder="Filter by Skills"
        />
        <input
          className="searchbar"
          name="interests"
          value={filters.interests}
          onChange={filterChange}
          placeholder="Filter by Interests"
        />
        <select
          name="role"
          className="searchbar"
          value={filters.role}
          onChange={filterChange}
        >
          <option value="">Filter by Role</option>
          <option value="mentor">Mentor</option>
          <option value="mentee">Mentee</option>
        </select>
      </form>
      <img
        id="search-button"
        src="https://uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.svg"
        alt=""
        onClick={getUsers}
      />
    </div>
  );
}
