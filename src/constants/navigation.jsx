import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

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
    title: "Patrol Scoreboard",
    icon: LeaderboardOutlinedIcon,
    path: "/patrol-scoreboard",
  },
  {
    title: "Birthdays",
    icon: CakeOutlinedIcon,
    path: "/birthdays",
  },
  {
    title: "Anniversaries",
    icon: FavoriteOutlinedIcon,
    path: "/anniversaries",
  },
  {
    title: "Gallery",
    icon: CollectionsOutlinedIcon,
    path: "/gallery",
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

  return nestedMatch?.title || "Saifee Rovers";
};

export default navigation;
