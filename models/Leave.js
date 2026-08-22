const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['paid', 'sick', 'unpaid'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminComment: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

leaveSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    return next(new Error('endDate cannot be before startDate'));
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
