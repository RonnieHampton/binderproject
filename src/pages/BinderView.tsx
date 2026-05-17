import { Link } from "react-router-dom";

function BinderView() {
  return (
    <div>
      <h1>Welcome to Binder Project</h1>
      <p>
        You can view your binders here. 
        <br />
        <Link to="/">Home</Link>
      </p>
    </div>
  )
}  

export default BinderView