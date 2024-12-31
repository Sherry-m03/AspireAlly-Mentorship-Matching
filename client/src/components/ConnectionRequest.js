import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConnectionRequest() {
  const [requests, setRequests] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState(null);
  const [sentRequests, setSentRequests] = useState(null);
  const Tabs = ["Received", "Sent", "Connections"];
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(Number(storedActiveTab));
    }
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/connection-request", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res?.data?.requests);
      setAcceptedRequests(res?.data.acceptedRequests);
      setSentRequests(res?.data?.sentRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConnectionChange = async (senderId, status) => {
    navigate(0);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/connection-request/update",
        { senderId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error updating connection request:", error);
    }
  };

  const handletabchange = (index) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index);
  };

  const handleback = (e) => {
    navigate(-1);
  };

  const handleDeleteRequest = async (requestId, status) => {
    navigate(0);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/connection-request/delete/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (status === "sent") {
        setSentRequests(sentRequests.filter((req) => req.id !== requestId));
      } else if (status === "accepted") {
        setAcceptedRequests(
          acceptedRequests.filter((req) => req.id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div className="Connection-requests">
      <div className="conn-nav">
        <div>
          <ul className="conn-tabs">
            <div onClick={handleback} className="tab conn-tab">
              Back
            </div>
            {Tabs.map((tab, index) => (
              <li
                key={index}
                onClick={() => handletabchange(index)}
                className={`tab conn-tab ${
                  activeTab === index ? "activeTab" : ""
                }`}
              >
                <div>{tab}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="requests-recieived">
        {(activeTab === 0
          ? requests
          : activeTab === 2
          ? acceptedRequests
          : sentRequests
        )?.map((req, index) => (
          <>
            <div className="requests-recieived-list" key={req.id}>
              <div id="user-img-div">
                <div id="user-img" className="user-img"></div>
                <div className="requests-list">
                  <p id="conn-header">{req.sender_username}</p>
                  <p style={{ color: "#f4acb7" }}>
                    {activeTab === 1 ? `Status: ${req.status}` : ""}
                  </p>
                  <div id="skill-interest-tab">
                    <div id="user-det-head">
                      <p style={{ fontWeight: "800" }}>Skills:&nbsp;</p>
                      <p>{req.sender_skills?.substr(0, 60)} ...</p>
                    </div>
                    <div id="user-det-head">
                      <p style={{ fontWeight: "800" }}> Interests:&nbsp;</p>
                      <p>{req.sender_interests?.substr(0, 60)} ...</p>
                    </div>
                  </div>
                </div>
                {(activeTab === 1 || activeTab === 2) && (
                  <img
                    className="delete-request"
                    onClick={
                      activeTab === 1
                        ? () => handleDeleteRequest(req.id, "sent")
                        : () => handleDeleteRequest(req.id, "accepted")
                    }
                    src="https://uxwing.com/wp-content/themes/uxwing/download/user-interface/recycle-bin-line-icon.svg"
                    alt=""
                  />
                )}
              </div>
              {activeTab === 0 && (
                <div className="status-buttons">
                  <button
                    onClick={() =>
                      handleConnectionChange(req.sender_id, "rejected")
                    }
                    id="status-btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      handleConnectionChange(req.sender_id, "accepted")
                    }
                    id="status-btn"
                    className="green"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </>
        ))}
      </div>
      <div className="requests-received"></div>
    </div>
  );
}
