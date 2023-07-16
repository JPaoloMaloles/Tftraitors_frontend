// import "bootstrap";
// import "bootstrap/dist/css/bootstrap.css";

export function Header() {
  var userDisplay;
  if (localStorage.getItem("jwt") != null) {
    userDisplay = "Currently logged in";
  } else {
    userDisplay = "Not logged in";
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/signup">
                Signup
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/logout">
                Logout
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">
                {userDisplay}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
