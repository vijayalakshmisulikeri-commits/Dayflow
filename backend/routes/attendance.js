const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { verifyToken, requireAdmin } = require('../middleware/authCheck');

// Helper: normalize a Date to midnight (UTC) so one record exists per day
function startOfDay(d = new Date()) {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * POST /api/attendance/check-in
 * Employee checks in for today. Creates today's record if it doesn't exist.
 */
router.post('/check-in', verifyToken, async (req, res) => {
  try {
    const today = startOfDay();

    let record = await Attendance.findOne({ employee: req.user.id, date: today });

    if (record && record.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!record) {
      record = new Attendance({
        employee: req.user.id,
        date: today,
        checkIn: new Date(),
        status: 'present',
      });
    } else {
      record.checkIn = new Date();
      record.status = 'present';
    }

    await record.save();
    return res.status(200).json({ message: 'Checked in successfully', record });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/attendance/check-out
 * Employee checks out for today. Computes workedHours and flags half-day
 * if worked hours fall below a threshold.
 */
router.post('/check-out', verifyToken, async (req, res) => {
  try {
    const today = startOfDay();
    const record = await Attendance.findOne({ employee: req.user.id, date: today });

    if (!record || !record.checkIn) {
      return res.status(400).json({ message: 'You must check in before checking out' });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    record.checkOut = new Date();
    const hours = (record.checkOut - record.checkIn) / (1000 * 60 * 60);
    record.workedHours = Math.round(hours * 100) / 100;

    const HALF_DAY_THRESHOLD = 4; // hours
    if (record.workedHours < HALF_DAY_THRESHOLD) {
      record.status = 'half-day';
    }

    await record.save();
    return res.status(200).json({ message: 'Checked out successfully', record });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/attendance/me/daily?date=YYYY-MM-DD
 * Employee views their own attendance for a specific day (defaults to today).
 */
router.get('/me/daily', verifyToken, async (req, res) => {
  try {
    const date = req.query.date ? startOfDay(new Date(req.query.date)) : startOfDay();
    const record = await Attendance.findOne({ employee: req.user.id, date });
    return res.status(200).json({ record: record || null });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/attendance/me/weekly?start=YYYY-MM-DD
 * Employee views their own attendance for the 7-day window starting at `start`
 * (defaults to the most recent Monday).
 */
router.get('/me/weekly', verifyToken, async (req, res) => {
  try {
    let start;
    if (req.query.start) {
      start = startOfDay(new Date(req.query.start));
    } else {
      const now = new Date();
      const day = now.getUTCDay(); // 0 = Sunday
      const diffToMonday = (day + 6) % 7;
      start = startOfDay(now);
      start.setUTCDate(start.getUTCDate() - diffToMonday);
    }

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);

    const records = await Attendance.find({
      employee: req.user.id,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    return res.status(200).json({ startDate: start, endDate: end, records });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/attendance/all?date=YYYY-MM-DD
 * Admin/HR views attendance of all employees for a given day (defaults to today).
 */
router.get('/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const date = req.query.date ? startOfDay(new Date(req.query.date)) : startOfDay();
    const records = await Attendance.find({ date }).populate(
      'employee',
      'name employeeId email'
    );
    return res.status(200).json({ date, records });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/attendance/employee/:employeeId?start=&end=
 * Admin/HR views a specific employee's attendance over a date range.
 */
router.get('/employee/:employeeId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const query = { employee: employeeId };

    if (req.query.start || req.query.end) {
      query.date = {};
      if (req.query.start) query.date.$gte = startOfDay(new Date(req.query.start));
      if (req.query.end) query.date.$lte = startOfDay(new Date(req.query.end));
    }

    const records = await Attendance.find(query).sort({ date: 1 });
    return res.status(200).json({ records });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
