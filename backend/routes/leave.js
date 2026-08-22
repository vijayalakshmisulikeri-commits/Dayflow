const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const { verifyToken, requireAdmin } = require('../middleware/authCheck');


/**
 * POST /api/leave/apply
 * Employee applies for leave.
 * Body: { leaveType, startDate, endDate, remarks }
 */
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'leaveType, startDate, and endDate are required' });
    }

    const validTypes = ['paid', 'sick', 'unpaid'];
    if (!validTypes.includes(leaveType)) {
      return res.status(400).json({ message: `leaveType must be one of ${validTypes.join(', ')}` });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: 'endDate cannot be before startDate' });
    }

    const leave = new Leave({
      employee: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      remarks: remarks || '',
    });

    await leave.save();
    return res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/leave/me
 * Employee views their own leave requests (optionally filter by status).
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const query = { employee: req.user.id };
    if (req.query.status) query.status = req.query.status;

    const leaves = await Leave.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ leaves });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * DELETE /api/leave/:id
 * Employee cancels their own leave request, only while it's still pending.
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, employee: req.user.id });
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    await leave.deleteOne();
    return res.status(200).json({ message: 'Leave request cancelled' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/leave/all?status=&employeeId=
 * Admin/HR views all leave requests, optionally filtered.
 */
router.get('/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.employeeId) query.employee = req.query.employeeId;

    const leaves = await Leave.find(query)
      .populate('employee', 'name employeeId email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ leaves });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * PATCH /api/leave/:id/review
 * Admin/HR approves or rejects a leave request.
 * Body: { decision: 'approved' | 'rejected', adminComment }
 * On approval, marks matching Attendance days as 'leave'.
 */
router.patch('/:id/review', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { decision, adminComment } = req.body;

    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: "decision must be 'approved' or 'rejected'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been reviewed' });
    }

    leave.status = decision;
    leave.adminComment = adminComment || '';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    // If approved, mark each day in the range as 'leave' in Attendance
    if (decision === 'approved') {
      const dayMs = 24 * 60 * 60 * 1000;
      const cursor = new Date(leave.startDate);
      cursor.setUTCHours(0, 0, 0, 0);
      const end = new Date(leave.endDate);
      end.setUTCHours(0, 0, 0, 0);

      const ops = [];
      while (cursor <= end) {
        ops.push(
          Attendance.findOneAndUpdate(
            { employee: leave.employee, date: new Date(cursor) },
            { employee: leave.employee, date: new Date(cursor), status: 'leave' },
            { upsert: true, new: true }
          )
        );
        cursor.setTime(cursor.getTime() + dayMs);
      }
      await Promise.all(ops);
    }

    return res.status(200).json({ message: `Leave request ${decision}`, leave });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
