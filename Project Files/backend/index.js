const express = require("express");
const cors = require("cors");
require("./config");
const {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} = require("./Schema");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

/* ========================== DEBUG LOGGER ========================== */
app.use((req, res, next) => {
  console.log("Received request:", req.method, req.url);
  next();
});

/* ========================== MESSAGE ROUTES ========================== */
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageSchema({ name, message, complaintId });
    const saved = await messageData.save();
    res.status(200).json(saved);
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:complaintId", async (req, res) => {
  try {
    const messages = await MessageSchema.find({ complaintId: req.params.complaintId }).sort("-createdAt");
    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

/* ========================== USER ROUTES ========================== */
app.post("/SignUp", async (req, res) => {
  try {
    const user = new UserSchema(req.body);
    const saved = await user.save();
    res.json(saved);
  } catch {
    res.status(500).send("Signup error");
  }
});

app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) return res.status(401).json({ message: "User doesn't exist" });
  if (user.password === password) return res.json(user);
  res.status(401).json({ message: "Invalid Credentials" });
});

app.get("/AgentUsers", async (_, res) => {
  try {
    const agents = await UserSchema.find({ userType: "Agent" });
    res.json(agents);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/OrdinaryUsers", async (_, res) => {
  try {
    const users = await UserSchema.find({ userType: "Ordinary" });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/AgentUsers/:agentId", async (req, res) => {
  try {
    const agent = await UserSchema.findById(req.params.agentId);
    if (agent?.userType === "Agent") return res.json(agent);
    res.status(404).json({ error: "Agent not found" });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/user/:_id", async (req, res) => {
  try {
    const updated = await UserSchema.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update the user" });
  }
});

app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await UserSchema.deleteOne({ _id: req.params.id });
    await ComplaintSchema.deleteMany({ userId: req.params.id });
    res.json({ message: "User and complaints deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ========================== COMPLAINT ROUTES ========================== */
app.post("/Complaint/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const complaint = new ComplaintSchema(req.body);
    const saved = await complaint.save();
    res.json(saved);
  } catch {
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

app.get("/status", async (_, res) => {
  try {
    const complaints = await ComplaintSchema.find();
    res.json(complaints);
  } catch {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

app.get("/status/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const complaints = await ComplaintSchema.find({ userId: req.params.id });
    res.json(complaints);
  } catch {
    res.status(500).json({ error: "Failed to get user complaints" });
  }
});

app.put("/complaint/:complaintId", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ComplaintSchema.findByIdAndUpdate(
      req.params.complaintId,
      { status },
      { new: true }
    );
    await AssignedComplaint.findOneAndUpdate({ complaintId: req.params.complaintId }, { status });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

/* ========================== AGENT COMPLAINT ASSIGNMENT ========================== */

app.post("/assignedComplaints", async (req, res) => {
  try {
    const { agentId, complaintId, status, agentName } = req.body;

    // Save assignment
    await AssignedComplaint.create({ agentId, complaintId, status, agentName });

    // Update complaint with agent name
    await ComplaintSchema.findByIdAndUpdate(complaintId, {
      assignedTo: agentName
    });

    res.status(201).json({ message: "Complaint assigned successfully" });
  } catch (error) {
    console.error("Assign error:", error);
    res.status(500).json({ error: "Failed to add assigned complaint" });
  }
});

app.put("/assignComplaint/:id", async (req, res) => {
  const { agentId, agentName } = req.body;
  const { id } = req.params;

  try {
    const updated = await ComplaintSchema.findByIdAndUpdate(
      id,
      { assignedTo: agentName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.status(200).json({ message: "Assigned successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Assignment route failed" });
  }
});

app.get("/allcomplaints/:agentId", async (req, res) => {
  try {
    const assignments = await AssignedComplaint.find({ agentId: req.params.agentId });
    const complaintIds = assignments.map(a => a.complaintId);
    const complaints = await ComplaintSchema.find({ _id: { $in: complaintIds } });
    const result = assignments.map(a => {
      const comp = complaints.find(c => c._id.toString() === a.complaintId.toString());
      return { ...a.toObject(), ...comp?.toObject() };
    });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

/* ========================== SERVER ========================== */
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));