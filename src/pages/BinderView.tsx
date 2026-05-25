import { Link } from "react-router-dom";
import styles from "./BinderView.module.css";

function BinderView() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome to Binder Project</h1>
      <p className={styles.copy}>
        You can view your binders here. 
        <br />
        <Link to="/">Home</Link>
      </p>
    </div>
  )
}  

export default BinderView
