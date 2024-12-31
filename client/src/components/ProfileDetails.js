import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileDetails() {
  const navigate = useNavigate();

  const location = useLocation();
  const { userid, user } = location.state || {};
  const [allRequests, setAllRequests] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/connection-request", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllRequests(res?.data?.allRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  console.log(allRequests);
  console.log(userid);

  const handleConnection = async (e, receiverId) => {
    navigate(0);
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const res = await axios.post(
        "/connection-request",
        { receiverId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {}
  };

  const handleback = (e) => {
    navigate(-1);
  };

  return (
    <div className="Profile_Info">
      <div className="navbar">
        <img
          className="back-request"
          onClick={handleback}
          src="https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/arrow-left-icon.svg"
          alt=""
        />
      </div>
      <div className="Info-details">
        <div id="info-header">
          <div id="info-img"></div>
          <h1>{user.username}</h1>
        </div>
        <p id="detail-head" style={{ fontWeight: "800" }}>
          Bio
        </p>
        <p>{user.bio}</p>
        <p id="detail-head" style={{ fontWeight: "800" }}>
          Skills
        </p>
        <p>{user.skills}</p>
        <p id="detail-head" style={{ fontWeight: "800" }}>
          Interests
        </p>
        <p>{user.interests}</p>
        <div>
          {allRequests?.find(
            (req) => req.receiver_id === userid || req.sender_id === userid
          ) ? (
            allRequests?.map(
              (req) =>
                (req.receiver_id === userid || req.sender_id === userid) && (
                  <button
                    key={req?.id}
                    onClick={(e) => handleConnection(e, userid)}
                    id="connect-button"
                    className={
                      req?.status === "accepted"
                        ? "green"
                        : req?.status === "pending"
                        ? "yellow"
                        : ""
                    }
                  >
                    {req?.status === "accepted"
                      ? "Accepted"
                      : req?.status === "rejected"
                      ? "Rejected"
                      : req?.status === "pending" && req.sender_id === userid
                      ? "Received"
                      : "Sent"}
                  </button>
                )
            )
          ) : (
            <button
              onClick={(e) => handleConnection(e, userid)}
              id="connect-button"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
