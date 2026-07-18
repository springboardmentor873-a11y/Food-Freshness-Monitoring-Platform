import { FaLeaf } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">
            <div className="container">

                <a className="navbar-brand fw-bold fs-3 d-flex align-items-center" href="/">
                    <FaLeaf
                        className="me-2"
                        color="#2E7D32"
                        size={28}
                    />
                    FreshSense AI
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="#">
                                Home
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="#">
                                About
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="#">
                                Contact
                            </a>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;