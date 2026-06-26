import { Link } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome to Binder Project</h1>
      <br />
      <div className={styles.navLinks}>
        <Link className={styles.navLink} to="/BinderView">Go to BinderView</Link>
        <Link className={styles.navLink} to="/BinderCreate">Go to BinderCreate</Link>
      </div>
    </div>
  );
}

export default Home;
