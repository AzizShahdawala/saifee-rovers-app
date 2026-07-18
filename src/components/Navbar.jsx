import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  return (
    <div
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h3>Scout Attendance System</h3>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Navbar;