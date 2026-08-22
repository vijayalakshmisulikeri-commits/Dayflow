const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    basicSalary: { type: Number, required: true, default: 0 },
    hra: { type: Number, default: 0 }, // House Rent Allowance
    conveyanceAllowance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    deductions: {
      pf: { type: Number, default: 0 }, // Provident Fund
      professionalTax: { type: Number, default: 0 },
      incomeTax: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    payDate: { type: Date },
  },
  { timestamps: true }
);

// Virtual: gross salary (sum of earnings)
payrollSchema.virtual("grossSalary").get(function () {
  return (
    this.basicSalary +
    this.hra +
    this.conveyanceAllowance +
    this.medicalAllowance +
    this.specialAllowance
  );
});

// Virtual: total deductions
payrollSchema.virtual("totalDeductions").get(function () {
  const d = this.deductions || {};
  return (d.pf || 0) + (d.professionalTax || 0) + (d.incomeTax || 0) + (d.other || 0);
});

// Virtual: net salary (take-home)
payrollSchema.virtual("netSalary").get(function () {
  return this.grossSalary - this.totalDeductions;
});

payrollSchema.set("toJSON", { virtuals: true });
payrollSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Payroll", payrollSchema);
