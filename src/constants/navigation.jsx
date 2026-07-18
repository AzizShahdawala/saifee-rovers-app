import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const navigation = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
  },
  {
    title: "Members",
    icon: PeopleAltIcon,
    path: "/members",
  },
  {
    title: "Events",
    icon: EventIcon,
    path: "/events",
  },
  {
    title: "Attendance Scanner",
    icon: FingerprintIcon,
    path: "/attendance",
  },
  {
    title: "Reports",
    icon: AssessmentIcon,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    path: "/settings",
  },
];

export const getNavigationTitle = (pathname) => {
  const exactMatch = navigation.find(
    (item) => item.path === pathname
  );

  if (exactMatch) {
    return exactMatch.title;
  }

  const nestedMatch = [...navigation]
    .filter((item) => item.path !== "/")
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      pathname.startsWith(`${item.path}/`)
    );

  return nestedMatch?.title || "Scout Attendance";
};

export default navigation;
