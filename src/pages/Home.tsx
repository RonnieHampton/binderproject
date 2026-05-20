import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to Binder Project</h1>
        <br />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/BinderView">Go to BinderView</Link>
        <Link to="/BinderCreate">Go to BinderCreate</Link>
        </div>
    </div>
  )
}  

export default Home