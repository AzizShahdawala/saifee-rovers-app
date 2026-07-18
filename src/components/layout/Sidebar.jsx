import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { Link } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <List>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/members/add">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>

          <ListItemText primary="Register Member" />
        </ListItemButton>

        <ListItemButton component={Link} to="/events">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>

          <ListItemText primary="Events" />
        </ListItemButton>

        <ListItemButton component={Link} to="/attendance">
          <ListItemIcon>
            <FactCheckIcon />
          </ListItemIcon>

          <ListItemText primary="Attendance" />
        </ListItemButton>

        <ListItemButton component={Link} to="/reports">
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>

          <ListItemText primary="Reports" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
