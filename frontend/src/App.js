import React, { useState } from "react";
import { signin, signup } from "./api/authApi";
import EmployeeDashboardPage from "./components/employee/EmployeeDashboardPage";
import AttendanceLeavePage from "./components/attendence/AttendanceLeavePage";

// ---- Minimal auth screen (signup + signin in one place) ----
function AuthScreen({ onLoggedIn }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup({ email, password, role, name });
        setMode("signin");
        setError("Signup successful — now sign in.");
      } else {
        const res = await signin({ email, password });
        localStorage.setItem("dayflow_token", res.token);
        localStorage.setItem("dayflow_role", res.role);
        localStorage.setItem("dayflow_id", res.id);
        onLoggedIn({ role: res.role, id: res.id });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "system-ui" }}>
      <h2>{mode === "signin" ? "Sign in" : "Sign up"} — DayFlow</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        {mode === "signup" && (
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "signup" && (
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button
        style={{ marginTop: 12, background: "none", border: "none", color: "blue", cursor: "pointer" }}
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

// ---- Main app: gates on login, then shows the right dashboard ----
export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("dayflow_token");
    const role = localStorage.getItem("dayflow_role");
    const id = localStorage.getItem("dayflow_id");
    return token ? { role, id } : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("dayflow_token");
    localStorage.removeItem("dayflow_role");
    localStorage.removeItem("dayflow_id");
    setUser(null);
  };

  if (!user) {
    return <AuthScreen onLoggedIn={setUser} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {user.role === "Employee" ? (
        <>
          <EmployeeDashboardPage employeeId={user.id} />
          <AttendanceLeavePage role="Employee" />
        </>
      ) : (
        <AttendanceLeavePage role="Admin" />
      )}
    </div>
  );
}
