export default function AdminEmployeeListPanel({ employees, onSelectEmployee }) {
  return (
    <div className="card">
      <h3>Employees ({(employees || []).length})</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(employees || []).map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <button className="btn btn-save" onClick={() => onSelectEmployee(emp._id)}>
                  View Payroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
