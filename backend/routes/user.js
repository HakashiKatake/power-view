const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');


router.put('/settings', auth, async (req, res) => {
    const { budgetLimit, providerName, billDueDate } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (budgetLimit) user.budgetLimit = budgetLimit;
        if (providerName) user.providerName = providerName;
        if (billDueDate) user.billDueDate = billDueDate;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
