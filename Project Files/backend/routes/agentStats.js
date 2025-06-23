const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const Complaint = require('../models/Complaint');

// Update agent stats when complaint is assigned
router.put('/assign', async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;
    
    // Update complaint status
    await Complaint.findByIdAndUpdate(complaintId, {
      status: 'in-progress',
      agent: agentId
    });

    // Update agent stats
    await Agent.findByIdAndUpdate(agentId, {
      $inc: {
        'stats.assigned': 1,
        'stats.inProgress': 1
      }
    });

    res.status(200).json({ message: 'Complaint assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stats when complaint is completed
router.put('/complete', async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;
    
    // Update complaint status
    await Complaint.findByIdAndUpdate(complaintId, {
      status: 'completed'
    });

    // Update agent stats
    await Agent.findByIdAndUpdate(agentId, {
      $inc: {
        'stats.inProgress': -1,
        'stats.completed': 1
      }
    });

    res.status(200).json({ message: 'Complaint marked as completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all agent stats
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find({}, 'name stats');
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;