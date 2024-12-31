import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

await db.connect();

app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await db.query(
      "SELECT * FROM regusers WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      console.log("User exists");
      return res.status(404).json({ error: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userResult = await db.query(
        "INSERT INTO regusers (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
        [username, email, hashedPassword, role]
      );

      if (!userResult.rows[0]?.id) {
        console.error("Error: No ID returned after user registration");
        return res
          .status(500)
          .json({ error: "Registration failed, please try again" });
      }

      const userId = userResult.rows[0].id;
      await db.query(
        "INSERT INTO profiles (user_id, username, role) VALUES ($1, $2, $3)",
        [userId, username, role]
      );
      console.log("User registered successfully");
      return res.status(200).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log("Error in Register:", err);
    return res.status(404).json({ error: "Error in Register" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userResult = await db.query("SELECT * FROM regusers WHERE email = $1", [
    email,
  ]);
  if (userResult.rows.length === 0) {
    console.log("No User Found. Click on Register to create a new account");
    return res.status(404).json({
      error: "No User Found. Click on Register to create a new account",
    });
  } else {
    const user = userResult.rows[0];
    const passwordToMatch = user.password;
    const isMatch = await bcrypt.compare(password, passwordToMatch);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ token });
    } else {
      console.log("Password does not match");
      return res.status(404).json({
        error: "Password does not match",
      });
    }
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

app.get("/user-profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const userResult = await db.query("SELECT * FROM regusers WHERE id = $1", [
      userId,
    ]);
    const user = userResult.rows[0];
    const profileResult = await db.query(
      "SELECT * FROM profiles WHERE user_id = $1",
      [userId]
    );
    const profile = profileResult.rows[0];

    if (!user && !profile) {
      console.log("Error getting profile");
    } else {
      return res.status(200).json({ user, profile });
    }
  } catch (err) {
    console.error("Error fetching user and profile data:", err);
    return res.status(500).json({ error: "Error fetching data" });
  }
});

app.put("/profile-update", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { username, bio, skills, interests, role } = req.body;
  try {
    await db.query(
      "UPDATE profiles SET bio = $1, skills = $2, interests = $3, role = $4, username = $5 WHERE user_id = $6",
      [bio, skills, interests, role, username, userId]
    );
    await db.query(
      "UPDATE regusers SET username = $1, role = $2 WHERE id = $3",
      [username, role, userId]
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Error updating profile" });
  }
});

app.get("/get-users", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { role, skills, interests } = req.query;

  try {
    const skillList = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];
    const interestList = interests
      ? interests.split(",").map((interest) => interest.trim())
      : [];

    let query = `SELECT p.user_id, p.username, p.skills, p.interests, p.bio FROM profiles p WHERE p.user_id != $1`;
    const values = [userId];

    if (role) {
      query += ` AND p.role = $${values.length + 1}`;
      values.push(role);
    } else {
      query += ` AND (p.role = $${values.length + 1} OR p.role = $${
        values.length + 2
      })`;
      values.push("mentor", "mentee");
    }

    if (skillList.length > 0) {
      query += ` AND (`;
      skillList.forEach((skill, index) => {
        query += `p.skills ILIKE $${values.length + 1}`;
        values.push(`%${skill}%`);
        if (index < skillList.length - 1) {
          query += " OR ";
        }
      });
      query += `)`;
    }

    if (interestList.length > 0) {
      if (skillList.length > 0) {
        query += ` OR (`;
      } else {
        query += ` AND (`;
      }
      interestList.forEach((interest, index) => {
        query += `p.interests ILIKE $${values.length + 1}`;
        values.push(`%${interest}%`);
        if (index < interestList.length - 1) {
          query += " OR ";
        }
      });
      query += `)`;
    }
    const userList = await db.query(query, values);
    res.status(200).json({ users: userList.rows });
  } catch (err) {
    console.error("Error getting users:", err);
    return res.status(500).json({ error: "Error getting users" });
  }
});

app.post("/connection-request", authenticateToken, async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;
  try {
    const existingRequest = await db.query(
      `SELECT * FROM connection_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [senderId, receiverId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ message: "Request already sent." });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cant send request to yourself" });
    }

    await db.query(
      `INSERT INTO connection_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [senderId, receiverId]
    );

    res.status(200).json({ message: "Connection request sent." });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Failed to send request." });
  }
});

app.get("/connection-request", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const allRequests = await db.query(
      `SELECT id, status, sender_id, receiver_id FROM connection_requests WHERE (receiver_id = $1 OR sender_id = $1)`,
      [userId]
    );
    const pendingRequests = await db.query(
      `SELECT cr.id, cr.sender_id, cr.status, p.username AS sender_username, p.bio as sender_bio, p.skills as sender_skills, p.interests as sender_interests FROM connection_requests cr JOIN profiles p ON cr.sender_id = p.user_id WHERE cr.receiver_id = $1 AND cr.status = $2`,
      [userId, "pending"]
    );
    const acceptedRequests = await db.query(
      `SELECT cr.id, cr.sender_id, cr.status, 
    CASE 
        WHEN cr.receiver_id = $1 THEN p_sender.username
        ELSE p_receiver.username
    END AS sender_username,
    CASE 
        WHEN cr.receiver_id = $1 THEN p_sender.bio
        ELSE p_receiver.bio
    END AS sender_bio,
    CASE 
        WHEN cr.receiver_id = $1 THEN p_sender.skills
        ELSE p_receiver.skills
    END AS sender_skills,
    CASE 
        WHEN cr.receiver_id = $1 THEN p_sender.interests
        ELSE p_receiver.interests
    END AS sender_interests
    FROM connection_requests cr LEFT JOIN profiles p_sender ON cr.sender_id = p_sender.user_id LEFT JOIN profiles p_receiver ON cr.receiver_id = p_receiver.user_id WHERE (cr.receiver_id = $1 OR cr.sender_id = $1) AND cr.status = $2`,
      [userId, "accepted"]
    );

    const sentRequests = await db.query(
      `SELECT cr.id, cr.receiver_id, cr.status, p.username AS sender_username, p.bio as sender_bio, p.skills as sender_skills, p.interests as sender_interests FROM connection_requests cr JOIN profiles p ON cr.receiver_id = p.user_id WHERE cr.sender_id = $1 AND cr.status != $2`,
      [userId, "accepted"]
    );

    res.status(200).json({
      requests: pendingRequests.rows,
      acceptedRequests: acceptedRequests.rows,
      sentRequests: sentRequests.rows,
      allRequests: allRequests.rows,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
});

app.post("/connection-request/update", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { senderId, status } = req.body;
  try {
    await db.query(
      "UPDATE connection_requests SET status = $1 WHERE sender_id = $2 AND receiver_id = $3",
      [status, senderId, userId]
    );
    console.log("Connection Updated");
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
  res.redirect("/connection-request");
});

app.delete(
  "/connection-request/delete/:id",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params.id;

    try {
      const q = await db.query(
        "DELETE FROM connection_requests WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)",
        [requestId, userId]
      );
      console.log(q);
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ error: "Failed to delete request" });
    }
  }
);

app.delete("/delete-profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query(
      "DELETE FROM connection_requests WHERE sender_id = $1 OR receiver_id = $1",
      [userId]
    );
    await db.query("DELETE FROM regusers WHERE id = $1", [userId]);
    await db.query("DELETE FROM profiles WHERE user_id = $1", [userId]);

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});

app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT);
