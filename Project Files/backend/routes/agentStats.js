const express = require('express');
const router = express.Router();
const { UserSchema, ComplaintSchema } = require('../Schema');

// ✅ Route to increment 'assigned' and 'inProgress' stats when a complaint is assigned to an agent
router.put('/assign', async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;

    // Optional: Set complaint status (usually handled elsewhere)
    await ComplaintSchema.findByIdAndUpdate(complaintId, {
      status: 'in progress'
    });

    // ✅ Increment agent stats
    const updatedAgent = await UserSchema.findByIdAndUpdate(
      agentId,
      {
        $inc: {
          'stats.assigned': 1,
          'stats.inProgress': 1
        }
      },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json({ message: 'Stats updated: complaint assigned', stats: updatedAgent.stats });
  } catch (error) {
    console.error("Assign stats update failed:", error);
    res.status(500).json({ error: 'Failed to assign complaint and update stats' });
  }
});

// ✅ Route to increment 'completed' and decrement 'inProgress' when a complaint is marked completed
router.put('/complete', async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;

    // Optional: Set complaint status (already updated in AgentHome)
    await ComplaintSchema.findByIdAndUpdate(complaintId, {
      status: 'completed'
    });

    // ✅ Update agent stats
    const updatedAgent = await UserSchema.findByIdAndUpdate(
      agentId,
      {
        $inc: {
          'stats.inProgress': -1,
          'stats.completed': 1
        }
      },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.status(200).json({ message: 'Stats updated: complaint completed', stats: updatedAgent.stats });
  } catch (error) {
    console.error("Complete stats update failed:", error);
    res.status(500).json({ error: 'Failed to complete complaint and update stats' });
  }
});

// ✅ Route to get all agents and their stats (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const agents = await UserSchema.find(
      { userType: 'Agent' },
      'name email stats'
    );

    res.status(200).json(agents);
  } catch (error) {
    console.error("Fetching agent stats failed:", error);
    res.status(500).json({ error: 'Failed to fetch agent stats' });
  }
});

module.exports = router;
