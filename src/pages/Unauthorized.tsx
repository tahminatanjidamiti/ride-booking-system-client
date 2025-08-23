import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div>
      <h1> You are Unauthorized in this route, Please try with right credentials...</h1>
      <Link to="/">Home</Link>
    </div>
  );
}