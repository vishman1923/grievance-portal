import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("landing");
  const [loginTab, setLoginTab] = useState("student");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", username: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", roll_number: "", department: "", email: "", password: "" });
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState({ student_name: "", roll_number: "", department: "", grievance_type: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const handleStudentLogin = async () => {
  setLoginError("");
  try {
    const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
    });
    const data = await res.json();
    if (data.success) {
      setLoggedIn(true);
      setUserType("student");
      setCurrentStudent(data.student);
      setForm({ ...form, student_name: data.student.name, roll_number: data.student.roll_number, department: data.student.department });
      setPage("submit");
      setLoginError("");
    } else {
      setLoginError(data.message);
    }
  } catch (error) {
    setLoginError("Server is waking up... Please wait 30 seconds and try again!");
  }
};

  const handleAdminLogin = async () => {
    const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/admin/loginhttps://grievance-portal-production-aff9.up.railway.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginForm.username, password: loginForm.password })
    });
    const data = await res.json();
    if (data.success) {
      setLoggedIn(true);
      setUserType("admin");
      fetchGrievances();
      setLoginError("");
    } else {
      setLoginError(data.message);
    }
  };

  const handleRegister = async () => {
    const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm)
    });
    const data = await res.json();
    if (data.success) {
      alert("Registration successful! Please login.");
      setLoginError("");
      setShowRegister(false);
    } else {
      setLoginError(data.message);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserType("");
    setCurrentStudent(null);
    setPage("landing");
    setLoginForm({ email: "", password: "", username: "" });
    setSubmitted(false);
  };

  const handleSubmit = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/grievances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSubmitted(true);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    alert("Server is waking up! Please wait 30 seconds and try again!");
  }
};

  const fetchGrievances = async () => {
    const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/grievances");
    const data = await res.json();
    setGrievances(data);
    setPage("admin");
  };
  const fetchMyGrievances = async () => {
  const res = await fetch("https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/grievances");
  const data = await res.json();
  const myGrievances = data.filter(g => g.roll_number === currentStudent.roll_number);
  setGrievances(myGrievances);
  setPage("mygrievances");
};
  const resolveGrievance = async (id) => {
    await fetch(`https://grievance-portal-backend-gaqy.https://grievance-portal-production-aff9.up.railway.app/api/grievances/${id}/resolve`, { method: "PUT" });
    fetchGrievances();
    setSelectedGrievance(null);
  };

  // LANDING PAGE
  if (page === "landing") {
    return (
      <div style={s.landingWrap}>
        {/* NAVBAR */}
        <nav style={s.landingNav}>
          <h2 style={s.logo}>🎓 Grievance Portal</h2>
          <button style={s.goldBtn2} onClick={() => setPage("login")}>Login →</button>
        </nav>

        {/* HERO SECTION */}
        <div style={s.hero}>
          <div style={s.heroBadge}>🏆 Smart AI-Powered System</div>
          <h1 style={s.heroTitle}>Smart Students'<br /><span style={s.heroGold}>Grievance Portal</span></h1>
          <p style={s.heroSub}>A digital platform to raise, track and resolve student grievances easily, transparently and intelligently using AI.</p>
          <div style={s.heroBtns}>
            <button style={s.goldBtnLarge} onClick={() => { setPage("login"); setShowRegister(true); }}>Get Started 🚀</button>
<button style={s.outlineBtn} onClick={() => { setPage("login"); setShowRegister(false); }}>Login →</button>
          </div>
        </div>

        {/* STATS */}
        <div style={s.statsSection}>
          <div style={s.statItem}>
            <p style={s.statBigNum}>100%</p>
            <p style={s.statBigLabel}>Digital</p>
          </div>
          <div style={s.statDivider}></div>
          <div style={s.statItem}>
            <p style={s.statBigNum}>3x</p>
            <p style={s.statBigLabel}>Faster Resolution</p>
          </div>
          <div style={s.statDivider}></div>
          <div style={s.statItem}>
            <p style={s.statBigNum}>AI</p>
            <p style={s.statBigLabel}>Powered</p>
          </div>
          <div style={s.statDivider}></div>
          <div style={s.statItem}>
            <p style={s.statBigNum}>24/7</p>
            <p style={s.statBigLabel}>Available</p>
          </div>
        </div>

        {/* FEATURES */}
        <div style={s.featuresSection}>
          <h2 style={s.sectionTitle}>Why Choose Our Portal?</h2>
          <div style={s.featuresGrid}>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>🤖</div>
              <h3 style={s.featureTitle}>AI Categorization</h3>
              <p style={s.featureDesc}>Claude AI automatically classifies complaints as Urgent, Moderate, or Normal for faster resolution.</p>
            </div>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>📊</div>
              <h3 style={s.featureTitle}>Admin Dashboard</h3>
              <p style={s.featureDesc}>Complete admin panel to view, manage and resolve all student grievances in one place.</p>
            </div>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>🔐</div>
              <h3 style={s.featureTitle}>Secure Login</h3>
              <p style={s.featureDesc}>Separate login for students and admin. Your data is safe and private at all times.</p>
            </div>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>⚡</div>
              <h3 style={s.featureTitle}>Real-time Status</h3>
              <p style={s.featureDesc}>Track your grievance status in real-time. Know when your complaint is resolved instantly.</p>
            </div>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>📱</div>
              <h3 style={s.featureTitle}>Easy to Use</h3>
              <p style={s.featureDesc}>Simple and intuitive interface. Submit complaints in just 30 seconds from any device.</p>
            </div>
            <div style={s.featureCard}>
              <div style={s.featureIcon}>🏫</div>
              <h3 style={s.featureTitle}>Multi Department</h3>
              <p style={s.featureDesc}>Supports Academic, Hostel, Transport, Fee and other grievance categories.</p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={s.howSection}>
          <h2 style={s.sectionTitle}>How It Works</h2>
          <div style={s.stepsRow}>
            <div style={s.stepCard}>
              <div style={s.stepNum}>01</div>
              <h3 style={s.stepTitle}>Register & Login</h3>
              <p style={s.stepDesc}>Create your account with roll number and email. Login securely.</p>
            </div>
            <div style={s.stepArrow}>→</div>
            <div style={s.stepCard}>
              <div style={s.stepNum}>02</div>
              <h3 style={s.stepTitle}>Submit Grievance</h3>
              <p style={s.stepDesc}>Fill the simple form and describe your complaint clearly.</p>
            </div>
            <div style={s.stepArrow}>→</div>
            <div style={s.stepCard}>
              <div style={s.stepNum}>03</div>
              <h3 style={s.stepTitle}>AI Analyzes</h3>
              <p style={s.stepDesc}>Claude AI reads your complaint and assigns priority automatically.</p>
            </div>
            <div style={s.stepArrow}>→</div>
            <div style={s.stepCard}>
              <div style={s.stepNum}>04</div>
              <h3 style={s.stepTitle}>Admin Resolves</h3>
              <p style={s.stepDesc}>Admin views and resolves your complaint quickly and efficiently.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={s.ctaSection}>
          <h2 style={s.ctaTitle}>Ready to Submit Your Grievance?</h2>
          <p style={s.ctaSub}>Join hundreds of students already using our portal!</p>
          <button style={s.goldBtnLarge} onClick={() => setPage("login")}>Get Started Now 🚀</button>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <p style={s.footerText}>© 2026 Smart Students' Grievance Portal | Built with ❤️ using React & Flask</p>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.topLine}></div>
          <div style={s.logoWrap}>
            <div style={s.logoRing}>🎓</div>
            <p style={s.portalName}>Grievance Portal</p>
          </div>

          {!showRegister ? (
            <>
              <div style={s.roleToggle}>
                <button style={{ ...s.roleBtn, ...(loginTab === "student" ? s.roleBtnActive : {}) }}
                  onClick={() => { setLoginTab("student"); setLoginError(""); }}>
                  👨‍🎓 Student
                </button>
                <button style={{ ...s.roleBtn, ...(loginTab === "admin" ? s.roleBtnActive : {}) }}
                  onClick={() => { setLoginTab("admin"); setLoginError(""); }}>
                  🔐 Admin
                </button>
              </div>

              {loginError && <p style={s.errorMsg}>{loginError}</p>}

              {loginTab === "student" ? (
                <>
                  <label style={s.label}>Email Address</label>
                  <input style={s.inp} type="email" placeholder="Enter your email"
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
                  <label style={s.label}>Password</label>
                  <input style={s.inp} type="password" placeholder="Enter your password"
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button style={s.goldBtn} onClick={handleStudentLogin}>Login as Student</button>
                  <p style={s.subText}>Don't have account?
                    <span style={s.goldLink} onClick={() => setShowRegister(true)}> Register here</span>
                  </p>
                </>
              ) : (
                <>
                  <label style={s.label}>Username</label>
                  <input style={s.inp} type="text" placeholder="Enter admin username"
                    onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} />
                  <label style={s.label}>Password</label>
                  <input style={s.inp} type="password" placeholder="Enter admin password"
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button style={s.goldBtn} onClick={handleAdminLogin}>Login as Admin</button>
                </>
              )}

              <div style={s.infoStrip}>
                <span style={s.infoItem}>🔒 Secure</span>
                <span style={s.infoItem}>🛡️ Private</span>
                <span style={s.infoItem}>⏰ 24/7</span>
              </div>
            </>
          ) : (
            <>
              <p style={{ ...s.portalName, marginBottom: "16px" }}>📝 Register</p>
              {loginError && <p style={s.errorMsg}>{loginError}</p>}
              <label style={s.label}>Full Name</label>
              <input style={s.inp} placeholder="Enter your name" onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} />
              <label style={s.label}>Roll Number</label>
              <input style={s.inp} placeholder="e.g. 25BEECE188" onChange={e => setRegisterForm({ ...registerForm, roll_number: e.target.value })} />
              <label style={s.label}>Department</label>
              <input style={s.inp} placeholder="e.g. ECE" onChange={e => setRegisterForm({ ...registerForm, department: e.target.value })} />
              <label style={s.label}>Email</label>
              <input style={s.inp} type="email" placeholder="Enter your email" onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <label style={s.label}>Password</label>
              <input style={s.inp} type="password" placeholder="Create password" onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
              <label style={s.label}>Phone Number</label>
<input style={s.inp} type="tel" placeholder="Enter your phone number (e.g. 9876543210)" onChange={e => setRegisterForm({...registerForm, phone: e.target.value})} />
              <button style={s.goldBtn} onClick={handleRegister}>Register</button>
              <p style={s.subText}>Already have account?
                <span style={s.goldLink} onClick={() => setShowRegister(false)}> Login here</span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <h2 style={s.logo}>🎓 Grievance Portal</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userType === "student" && <span style={s.welcomeText}>Welcome, {currentStudent?.name}!</span>}
          {userType === "admin" && <span style={s.welcomeText}>Welcome, Admin!</span>}
          {userType === "student" && <button style={s.navBtn} onClick={() => { setPage("submit"); setSubmitted(false); }}>Submit</button>}
{userType === "student" && <button style={s.navBtn} onClick={fetchMyGrievances}>My Grievances</button>}
          {userType === "admin" && <button style={s.navBtn} onClick={fetchGrievances}>Dashboard</button>}
{userType === "admin" && <button style={s.navBtn} onClick={() => setPage("analytics")}>📊 Analytics</button>}
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {page === "mygrievances" && userType === "student" && (
  <div style={s.adminWrap}>
    <h2 style={s.adminTitle}>📋 My Grievances</h2>
    {grievances.length === 0 ? (
      <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
        <p style={{ fontSize: "48px" }}>📭</p>
        <p style={{ fontSize: "18px", color: GOLD }}>No grievances submitted yet!</p>
        <button style={{ ...s.goldBtn, width: "auto", padding: "12px 30px", marginTop: "20px" }}
          onClick={() => { setPage("submit"); setSubmitted(false); }}>
          Submit First Grievance
        </button>
      </div>
    ) : (
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.tableHead}>
              <th style={s.th}>Type</th>
              <th style={s.th}>Description</th>
              <th style={s.th}>Priority</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map(g => (
              <tr key={g.id} style={s.tableRow}>
                <td style={s.td}>{g.grievance_type}</td>
                <td style={{ ...s.td, maxWidth: "200px" }}>
                  {g.description.length > 50 ? g.description.substring(0, 50) + "..." : g.description}
                </td>
                <td style={{ ...s.td, color: g.priority === "Urgent" ? "#ff4444" : g.priority === "Moderate" ? GOLD : "#4caf50", fontWeight: "bold" }}>
                  {g.priority}
                </td>
                <td style={s.td}>
                  <span style={{
                    background: g.status === "Pending" ? "rgba(201,168,76,0.1)" : "rgba(76,175,80,0.1)",
                    color: g.status === "Pending" ? GOLD : "#4caf50",
                    border: `1px solid ${g.status === "Pending" ? GOLD : "#4caf50"}`,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}>
                    {g.status === "Pending" ? "⏳ Pending" : "✅ Resolved"}
                  </span>
                </td>
                <td style={s.td}>{new Date(g.date_submitted).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
      {page === "submit" && userType === "student" && (
        <div style={s.pageWrap}>
          <div style={s.formCard}>
            <div style={s.formTopLine}></div>
            <h2 style={s.formTitle}>📝 Submit Grievance</h2>
            {submitted ? (
              <div style={s.successBox}>
                <div style={s.successIcon}>✅</div>
                <p style={s.successText}>Grievance Submitted Successfully!</p>
                <button style={s.goldBtn} onClick={() => setSubmitted(false)}>Submit Another</button>
              </div>
            ) : (
              <>
                <label style={s.label}>Student Name</label>
                <input style={s.inp} value={form.student_name} placeholder="Student Name" onChange={e => setForm({ ...form, student_name: e.target.value })} />
                <label style={s.label}>Roll Number</label>
                <input style={s.inp} value={form.roll_number} placeholder="Roll Number" onChange={e => setForm({ ...form, roll_number: e.target.value })} />
                <label style={s.label}>Department</label>
                <input style={s.inp} value={form.department} placeholder="Department" onChange={e => setForm({ ...form, department: e.target.value })} />
                <label style={s.label}>Grievance Type</label>
                <select style={s.inp} onChange={e => setForm({ ...form, grievance_type: e.target.value })}>
                  <option value="">Select Grievance Type</option>
                  <option>Academic</option>
                  <option>Hostel</option>
                  <option>Transport</option>
                  <option>Fee Related</option>
                  <option>Other</option>
                </select>
                <label style={s.label}>Description</label>
                <textarea style={{ ...s.inp, height: "100px", resize: "none" }} placeholder="Describe your grievance..." onChange={e => setForm({ ...form, description: e.target.value })} />
                <button style={s.goldBtn} onClick={handleSubmit}>
  {loading ? "Please wait... Server waking up! ⏳" : "Submit Grievance"}
</button>
              </>
            )}
          </div>
        </div>
      )}

      {page === "admin" && userType === "admin" && (
        <div style={s.adminWrap}>
          <h2 style={s.adminTitle}>🔐 Admin Dashboard</h2>
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <p style={s.statNum}>{grievances.length}</p>
              <p style={s.statLabel}>Total</p>
            </div>
            <div style={s.statCard}>
              <p style={{ ...s.statNum, color: "#ff4444" }}>{grievances.filter(g => g.priority === "Urgent").length}</p>
              <p style={s.statLabel}>Urgent</p>
            </div>
            <div style={s.statCard}>
              <p style={{ ...s.statNum, color: GOLD }}>{grievances.filter(g => g.status === "Pending").length}</p>
              <p style={s.statLabel}>Pending</p>
            </div>
            <div style={s.statCard}>
              <p style={{ ...s.statNum, color: "#4caf50" }}>{grievances.filter(g => g.status === "Resolved").length}</p>
              <p style={s.statLabel}>Resolved</p>
            </div>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.tableHead}>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Roll No</th>
                  <th style={s.th}>Dept</th>
                  <th style={s.th}>Type</th>
                  <th style={s.th}>Priority</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map(g => (
                  <tr key={g.id} style={s.tableRow}>
                    <td style={s.td}>{g.student_name}</td>
                    <td style={s.td}>{g.roll_number}</td>
                    <td style={s.td}>{g.department}</td>
                    <td style={s.td}>{g.grievance_type}</td>
                    <td style={{ ...s.td, color: g.priority === "Urgent" ? "#ff4444" : g.priority === "Moderate" ? GOLD : "#4caf50", fontWeight: "bold" }}>{g.priority}</td>
                    <td style={{ ...s.td, color: g.status === "Pending" ? GOLD : "#4caf50" }}>{g.status}</td>
                    <td style={s.td}>{new Date(g.date_submitted).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}</td>
                    <td style={s.td}>
                      <button onClick={() => setSelectedGrievance(g)} style={s.viewBtn}>View</button>
                      {g.status === "Pending" && <button onClick={() => resolveGrievance(g.id)} style={s.resolveBtn}>Resolve</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {page === "analytics" && userType === "admin" && (
  <div style={s.adminWrap}>
    <h2 style={s.adminTitle}>📊 Analytics Dashboard</h2>

    {/* STATS ROW */}
    <div style={s.statsRow}>
      <div style={s.statCard}>
        <p style={s.statNum}>{grievances.length}</p>
        <p style={s.statLabel}>Total</p>
      </div>
      <div style={s.statCard}>
        <p style={{ ...s.statNum, color: "#ff4444" }}>{grievances.filter(g => g.priority === "Urgent").length}</p>
        <p style={s.statLabel}>Urgent</p>
      </div>
      <div style={s.statCard}>
        <p style={{ ...s.statNum, color: GOLD }}>{grievances.filter(g => g.status === "Pending").length}</p>
        <p style={s.statLabel}>Pending</p>
      </div>
      <div style={s.statCard}>
        <p style={{ ...s.statNum, color: "#4caf50" }}>{grievances.filter(g => g.status === "Resolved").length}</p>
        <p style={s.statLabel}>Resolved</p>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

      {/* BAR CHART - By Department */}
      <div style={s.chartCard}>
        <h3 style={s.chartTitle}>📊 Grievances by Department</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={(() => {
            const depts = {};
            grievances.forEach(g => {
              depts[g.department] = (depts[g.department] || 0) + 1;
            });
            return Object.keys(depts).map(k => ({ dept: k, count: depts[k] }));
          })()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="dept" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${GOLD}`, color: "#fff" }} />
            <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART - Priority */}
      <div style={s.chartCard}>
        <h3 style={s.chartTitle}>🥧 Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Urgent", value: grievances.filter(g => g.priority === "Urgent").length },
                { name: "Moderate", value: grievances.filter(g => g.priority === "Moderate").length },
                { name: "Normal", value: grievances.filter(g => g.priority === "Normal").length },
              ]}
              cx="50%" cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill="#ff4444" />
              <Cell fill={GOLD} />
              <Cell fill="#4caf50" />
            </Pie>
            <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${GOLD}`, color: "#fff" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART - By Type */}
      <div style={s.chartCard}>
        <h3 style={s.chartTitle}>📋 Grievances by Type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={(() => {
            const types = {};
            grievances.forEach(g => {
              types[g.grievance_type] = (types[g.grievance_type] || 0) + 1;
            });
            return Object.keys(types).map(k => ({ type: k, count: types[k] }));
          })()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="type" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${GOLD}`, color: "#fff" }} />
            <Bar dataKey="count" fill="#4caf50" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART - Status */}
      <div style={s.chartCard}>
        <h3 style={s.chartTitle}>✅ Status Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Pending", value: grievances.filter(g => g.status === "Pending").length },
                { name: "Resolved", value: grievances.filter(g => g.status === "Resolved").length },
              ]}
              cx="50%" cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill={GOLD} />
              <Cell fill="#4caf50" />
            </Pie>
            <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${GOLD}`, color: "#fff" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
)}
      {selectedGrievance && (
        <div style={s.overlay}>
          <div style={s.popup}>
            <div style={s.topLine}></div>
            <h2 style={s.popupTitle}>📋 Grievance Details</h2>
            <div style={s.popupRow}><span style={s.popupLabel}>Student Name:</span><span style={s.popupVal}>{selectedGrievance.student_name}</span></div>
            <div style={s.popupRow}><span style={s.popupLabel}>Roll Number:</span><span style={s.popupVal}>{selectedGrievance.roll_number}</span></div>
            <div style={s.popupRow}><span style={s.popupLabel}>Department:</span><span style={s.popupVal}>{selectedGrievance.department}</span></div>
            <div style={s.popupRow}><span style={s.popupLabel}>Type:</span><span style={s.popupVal}>{selectedGrievance.grievance_type}</span></div>
            <div style={s.popupRow}>
              <span style={s.popupLabel}>Priority:</span>
              <span style={{ fontWeight: "bold", color: selectedGrievance.priority === "Urgent" ? "#ff4444" : selectedGrievance.priority === "Moderate" ? GOLD : "#4caf50" }}>
                {selectedGrievance.priority}
              </span>
            </div>
            <div style={s.popupRow}>
              <span style={s.popupLabel}>Status:</span>
              <span style={{ color: selectedGrievance.status === "Pending" ? GOLD : "#4caf50" }}>{selectedGrievance.status}</span>
            </div>
            <div style={s.popupRow}><span style={s.popupLabel}>Date:</span><span style={s.popupVal}>{selectedGrievance.date_submitted}</span></div>
            <div style={{ marginBottom: "20px" }}>
              <span style={s.popupLabel}>Description:</span>
              <p style={s.descBox}>{selectedGrievance.description}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              {selectedGrievance.status === "Pending" && (
                <button style={s.goldBtn} onClick={() => resolveGrievance(selectedGrievance.id)}>✅ Resolve</button>
              )}
              <button style={s.closeBtn} onClick={() => setSelectedGrievance(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const GOLD = "#c9a84c";
const GOLD2 = "#e0c060";
const BG = "#0a0a0a";
const CARD = "#1a1a1a";
const BORDER = "rgba(201,168,76,0.3)";

const s = {
  // LANDING
  landingWrap: { minHeight: "100vh", background: BG, fontFamily: "Arial, sans-serif" },
  landingNav: { background: "rgba(26,26,26,0.95)", borderBottom: `1px solid ${BORDER}`, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
  hero: { textAlign: "center", padding: "100px 20px 80px", background: `linear-gradient(180deg, #111 0%, ${BG} 100%)` },
  heroBadge: { display: "inline-block", background: "rgba(201,168,76,0.1)", border: `1px solid ${BORDER}`, color: GOLD, padding: "6px 16px", borderRadius: "20px", fontSize: "13px", marginBottom: "24px" },
  heroTitle: { fontSize: "3.5rem", fontWeight: "700", color: "white", lineHeight: "1.2", marginBottom: "20px" },
  heroGold: { color: GOLD },
  heroSub: { fontSize: "1.1rem", color: "#888", maxWidth: "600px", margin: "0 auto 36px", lineHeight: "1.8" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
  goldBtnLarge: { padding: "14px 36px", background: `linear-gradient(135deg,${GOLD},${GOLD2})`, color: "#111", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
  outlineBtn: { padding: "14px 36px", background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: "10px", fontSize: "16px", cursor: "pointer" },
  goldBtn2: { padding: "10px 24px", background: `linear-gradient(135deg,${GOLD},${GOLD2})`, color: "#111", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },

  statsSection: { display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", padding: "40px 20px", background: CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" },
  statItem: { textAlign: "center" },
  statBigNum: { fontSize: "2.5rem", fontWeight: "700", color: GOLD, margin: "0 0 4px 0" },
  statBigLabel: { fontSize: "13px", color: "#666", margin: 0 },
  statDivider: { width: "1px", height: "50px", background: BORDER },

  featuresSection: { padding: "80px 40px", textAlign: "center" },
  sectionTitle: { fontSize: "2rem", color: "white", marginBottom: "48px", fontWeight: "600" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", maxWidth: "1000px", margin: "0 auto" },
  featureCard: { background: CARD, border: `0.5px solid ${BORDER}`, borderRadius: "16px", padding: "28px", textAlign: "left" },
  featureIcon: { fontSize: "32px", marginBottom: "14px" },
  featureTitle: { color: GOLD, fontSize: "16px", fontWeight: "600", marginBottom: "10px" },
  featureDesc: { color: "#777", fontSize: "13px", lineHeight: "1.7" },

  howSection: { padding: "80px 40px", background: CARD, textAlign: "center" },
  stepsRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", maxWidth: "1000px", margin: "0 auto" },
  stepCard: { background: BG, border: `0.5px solid ${BORDER}`, borderRadius: "16px", padding: "28px 20px", textAlign: "center", flex: 1, minWidth: "160px" },
  stepNum: { fontSize: "2rem", fontWeight: "700", color: GOLD, marginBottom: "12px" },
  stepTitle: { color: "white", fontSize: "15px", fontWeight: "600", marginBottom: "8px" },
  stepDesc: { color: "#666", fontSize: "12px", lineHeight: "1.6" },
  stepArrow: { color: GOLD, fontSize: "24px", fontWeight: "bold" },

  ctaSection: { padding: "80px 20px", textAlign: "center" },
  ctaTitle: { fontSize: "2rem", color: "white", marginBottom: "12px" },
  ctaSub: { color: "#666", fontSize: "15px", marginBottom: "32px" },

  footer: { background: CARD, borderTop: `1px solid ${BORDER}`, padding: "24px", textAlign: "center" },
  footerText: { color: "#444", fontSize: "13px" },

  // LOGIN
  wrap: { minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { background: `linear-gradient(145deg,#1c1c1c,#141414)`, border: `0.5px solid ${BORDER}`, borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "420px", position: "relative" },
  topLine: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "2px", background: `linear-gradient(90deg,transparent,${GOLD},transparent)` },
  logoWrap: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" },
  logoRing: { width: "72px", height: "72px", borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", marginBottom: "12px" },
  portalName: { fontSize: "20px", fontWeight: "500", color: GOLD, textAlign: "center" },
  roleToggle: { display: "flex", background: "#0f0f0f", borderRadius: "10px", padding: "4px", marginBottom: "20px", border: "0.5px solid #2a2a2a" },
  roleBtn: { flex: 1, padding: "9px", border: "none", background: "transparent", color: "#666", fontSize: "13px", borderRadius: "8px", cursor: "pointer" },
  roleBtnActive: { background: `linear-gradient(135deg,${GOLD},${GOLD2})`, color: "#111", fontWeight: "500" },
  label: { fontSize: "11px", color: "#888", marginBottom: "6px", display: "block", letterSpacing: "0.5px", textTransform: "uppercase" },
  inp: { width: "100%", padding: "11px 12px", background: "#0f0f0f", border: "0.5px solid #2a2a2a", borderRadius: "10px", color: "#e0e0e0", fontSize: "14px", marginBottom: "14px", outline: "none", boxSizing: "border-box" },
  goldBtn: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${GOLD},${GOLD2})`, color: "#111", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "500", cursor: "pointer", marginTop: "4px" },
  errorMsg: { color: "#ff4444", fontSize: "13px", textAlign: "center", marginBottom: "12px", background: "rgba(255,0,0,0.1)", padding: "8px", borderRadius: "8px" },
  subText: { textAlign: "center", fontSize: "12px", color: "#555", marginTop: "14px" },
  goldLink: { color: GOLD, cursor: "pointer", fontWeight: "500" },
  infoStrip: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px", paddingTop: "16px", borderTop: "0.5px solid #1e1e1e" },
  infoItem: { fontSize: "11px", color: "#555" },

  // APP
  app: { fontFamily: "Arial, sans-serif", minHeight: "100vh", background: BG },
  nav: { background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { color: GOLD, margin: 0, fontSize: "18px" },
  welcomeText: { color: GOLD, fontSize: "14px", fontWeight: "500" },
  navBtn: { background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  logoutBtn: { background: "rgba(255,0,0,0.15)", color: "#ff6666", border: "1px solid rgba(255,0,0,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },

  pageWrap: { minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 20px" },
  formCard: { background: CARD, border: `0.5px solid ${BORDER}`, borderRadius: "20px", padding: "36px", width: "100%", maxWidth: "480px", position: "relative" },
  formTopLine: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "2px", background: `linear-gradient(90deg,transparent,${GOLD},transparent)` },
  formTitle: { color: GOLD, marginBottom: "20px", fontSize: "18px" },
  successBox: { textAlign: "center", padding: "20px 0" },
  successIcon: { fontSize: "48px", marginBottom: "12px" },
  successText: { color: GOLD, fontSize: "18px", fontWeight: "500", marginBottom: "20px" },

  adminWrap: { padding: "30px" },
  adminTitle: { color: GOLD, fontSize: "22px", marginBottom: "20px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: CARD, border: `0.5px solid ${BORDER}`, borderRadius: "12px", padding: "16px", textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "500", color: GOLD, margin: "0 0 4px 0" },
  statLabel: { fontSize: "12px", color: "#666", margin: 0 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { background: `linear-gradient(135deg,${GOLD},${GOLD2})` },
  th: { padding: "12px 10px", textAlign: "left", color: "#111", fontWeight: "500", fontSize: "13px" },
  tableRow: { borderBottom: `0.5px solid ${BORDER}` },
  td: { padding: "12px 10px", color: "#ccc", fontSize: "13px" },
  viewBtn: { background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, padding: "5px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
  resolveBtn: { background: "rgba(76,175,80,0.15)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.3)", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },

  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  popup: { background: CARD, border: `0.5px solid ${BORDER}`, borderRadius: "16px", padding: "30px", width: "90%", maxWidth: "500px", position: "relative" },
  popupTitle: { color: GOLD, marginBottom: "20px", fontSize: "18px", borderBottom: `0.5px solid ${BORDER}`, paddingBottom: "12px" },
  popupRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" },
  popupLabel: { fontWeight: "bold", color: GOLD },
  popupVal: { color: "#ccc" },
  descBox: { background: "#111", padding: "12px", borderRadius: "8px", marginTop: "8px", color: "#ccc", lineHeight: "1.6", border: `0.5px solid ${BORDER}` },
  closeBtn: { background: "rgba(255,255,255,0.05)", color: "#888", border: "0.5px solid #333", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  chartCard: { background: CARD, border: `0.5px solid ${BORDER}`, borderRadius: "16px", padding: "24px" },
chartTitle: { color: GOLD, fontSize: "15px", marginBottom: "16px", fontWeight: "500" },
};

export default App;