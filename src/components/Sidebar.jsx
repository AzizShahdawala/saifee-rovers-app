import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2>Scout Attendance</h2>

      <hr />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
        }}
      >
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/members">Members</Link>
        </li>

        <li>
          <Link to="/events">Events</Link>
        </li>

        <li>
          <Link to="/attendance">Attendance</Link>
        </li>

        <li>
          <Link to="/reports">Reports</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
