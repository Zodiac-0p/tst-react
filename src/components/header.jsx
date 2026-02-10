import { Link } from "react-router-dom";

function Header({ user }) {
  return (
    <header className="header">
      <div className="logo">OTT Platform</div>

      <nav className="nav">
        <Link to="/">Home</Link>

        {user && <Link to="/profile">Profile</Link>}

        {!user && user !== null && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && <Link to="/logout">Logout</Link>}
      </nav>
    </header>
  );
}

export default Header;
