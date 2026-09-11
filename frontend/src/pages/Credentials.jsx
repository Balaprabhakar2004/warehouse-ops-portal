function Credentials() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Warehouse & Shipment Operations Portal</h1>
        <p style={styles.subtitle}>Demo Credentials</p>

        <div style={styles.roleBlock}>
          <h2 style={styles.roleTitle}>Admin</h2>
          <p style={styles.line}>Email: <span style={styles.value}>admin@test.com</span></p>
          <p style={styles.line}>Password: <span style={styles.value}>password123</span></p>
        </div>

        <div style={styles.roleBlock}>
          <h2 style={styles.roleTitle}>Staff</h2>
          <p style={styles.line}>Email: <span style={styles.value}>staff@test.com</span></p>
          <p style={styles.line}>Password: <span style={styles.value}>password123</span></p>
        </div>

        <p style={styles.note}>
          These accounts are provided for demonstration purposes only and have limited permissions.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f5f7",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: "32px 40px",
    maxWidth: "480px",
    width: "100%",
  },
  title: { fontSize: "20px", marginBottom: "4px", color: "#1a1a1a" },
  subtitle: {
    fontSize: "14px", color: "#666", marginBottom: "24px",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  roleBlock: { marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #eee" },
  roleTitle: { fontSize: "16px", marginBottom: "6px", color: "#111" },
  line: { fontSize: "14px", margin: "2px 0", color: "#333" },
  value: { fontFamily: "monospace", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" },
  note: { fontSize: "12px", color: "#888", marginTop: "20px" },
};

export default Credentials;