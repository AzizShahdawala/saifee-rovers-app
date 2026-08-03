import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { ArrowForward, CampaignOutlined, Diversity3Outlined, FlagOutlined, MusicNoteOutlined, VolunteerActivismOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import scoutsImage from "../assets/landing-scouts.jpg";
import serviceImage from "../assets/landing-service.jpg";
import communityImage from "../assets/landing-community.jpg";

const values = [
  { icon: <VolunteerActivismOutlined />, title: "Khidmat in action", text: "Voluntary service through crowd support, venue management and food distribution during community gatherings." },
  { icon: <Diversity3Outlined />, title: "Community first", text: "Birthday projects, food distribution, orphanage outreach, blood donation drives and meaningful civic initiatives." },
  { icon: <MusicNoteOutlined />, title: "A band with purpose", text: "The Saifee Rovers Band carries a proud musical tradition, supporting community occasions and civic celebrations." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return <Box sx={{ minHeight: "100vh", bgcolor: "#f5f1e8", color: "#102b2a", overflow: "hidden" }}>
    <Box component="header" sx={{ position: "absolute", inset: "0 0 auto", zIndex: 3, py: 2.2 }}>
      <Container maxWidth="xl"><Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1.5}><Box component="img" src={logo} alt="Saifee Rovers emblem" sx={{ width: 54, height: 54, objectFit: "contain", bgcolor: "white", borderRadius: "50%", p: .4 }} /><Box><Typography sx={{ color: "white", fontWeight: 900, letterSpacing: ".04em", lineHeight: 1.1 }}>SAIFEE ROVERS</Typography><Typography sx={{ color: "rgba(255,255,255,.72)", fontSize: 12 }}>20th East Bombay · Since 1947</Typography></Box></Stack>
        <Button variant="contained" onClick={() => navigate("/login")} endIcon={<ArrowForward />} sx={{ bgcolor: "#f3b741", color: "#102b2a", fontWeight: 800, px: { xs: 2, sm: 3 }, "&:hover": { bgcolor: "#ffd06b" } }}>Login</Button>
      </Stack></Container>
    </Box>

    <Box component="section" sx={{ minHeight: { xs: 760, md: 800 }, display: "flex", alignItems: "center", position: "relative", backgroundImage: `linear-gradient(90deg,rgba(6,35,34,.97) 0%,rgba(6,35,34,.83) 48%,rgba(6,35,34,.25) 100%),url(${scoutsImage})`, backgroundSize: "cover", backgroundPosition: "center 42%" }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 12 }}><Box sx={{ maxWidth: 760 }}>
        <Chip icon={<FlagOutlined />} label="Service · Sacrifice · Brotherhood" sx={{ mb: 3, bgcolor: "rgba(243,183,65,.16)", color: "#ffd77d", border: "1px solid rgba(243,183,65,.42)", "& .MuiChip-icon": { color: "#ffd77d" } }} />
        <Typography component="h1" sx={{ color: "white", fontSize: { xs: "3.25rem", sm: "4.8rem", md: "6.4rem" }, fontWeight: 950, letterSpacing: "-.055em", lineHeight: .94, maxWidth: 720 }}>Prepared to serve. Ready to lead.</Typography>
        <Typography sx={{ mt: 3, color: "rgba(255,255,255,.8)", fontSize: { xs: 18, md: 21 }, lineHeight: 1.7, maxWidth: 650 }}>A senior scouting division rooted in Mumbai, carrying forward a living tradition of khidmat, discipline, fellowship and music.</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}><Button size="large" variant="contained" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} sx={{ bgcolor: "#f3b741", color: "#102b2a", fontWeight: 850, px: 3.5 }}>Discover our story</Button><Stack direction="row" spacing={4} sx={{ color: "white", px: { sm: 2 } }}><Box><Typography variant="h5" fontWeight={900}>1947</Typography><Typography variant="caption" sx={{ opacity: .7 }}>Established</Typography></Box><Box><Typography variant="h5" fontWeight={900}>Mumbai</Typography><Typography variant="caption" sx={{ opacity: .7 }}>Our home</Typography></Box></Stack></Stack>
      </Box></Container>
      <Typography sx={{ display: { xs: "none", md: "block" }, position: "absolute", right: 22, bottom: 28, color: "rgba(255,255,255,.65)", fontSize: 11, writingMode: "vertical-rl", letterSpacing: ".15em" }}>BE PREPARED</Typography>
    </Box>

    <Box id="story" component="section" sx={{ py: { xs: 9, md: 14 } }}><Container maxWidth="lg"><Grid container spacing={{ xs: 5, md: 9 }} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}><Typography variant="overline" sx={{ color: "#a36c08", fontWeight: 900, letterSpacing: ".18em" }}>Our heritage</Typography><Typography variant="h2" sx={{ mt: 1, fontWeight: 950, letterSpacing: "-.04em", fontSize: { xs: "2.6rem", md: "4rem" } }}>A legacy built on service.</Typography><Typography sx={{ mt: 3, color: "#4d625f", fontSize: 18, lineHeight: 1.8 }}>Saifee Rovers is the senior scouting division of the Saifee Scout Group, 20th East Bombay. Established in 1947, the group serves within Mumbai’s Dawoodi Bohra community and is associated with the Bharat Scouts and Guides.</Typography><Typography sx={{ mt: 2, color: "#4d625f", fontSize: 18, lineHeight: 1.8 }}>Its guiding spirit brings together the scout promise of <strong>“Be Prepared”</strong> and the enduring call of <strong>“Service & Sacrifice”</strong>—values carried into every gathering, project and performance.</Typography></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Box sx={{ position: "relative", pl: { md: 5 }, pb: 5 }}><Box component="img" src={serviceImage} alt="Volunteers serving the community" sx={{ width: "100%", height: 520, objectFit: "cover", borderRadius: "180px 180px 24px 24px", boxShadow: "0 30px 70px rgba(16,43,42,.18)" }} /><Box sx={{ position: "absolute", left: 0, bottom: 0, bgcolor: "#f3b741", p: 3, maxWidth: 230 }}><Typography variant="h4" fontWeight={950}>Khidmat</Typography><Typography sx={{ mt: .5, lineHeight: 1.5 }}>Service offered with humility, discipline and heart.</Typography></Box></Box></Grid>
    </Grid></Container></Box>

    <Box component="section" sx={{ py: { xs: 9, md: 12 }, bgcolor: "#0b3634", color: "white" }}><Container maxWidth="lg"><Stack alignItems="center" textAlign="center" sx={{ mb: 7 }}><Typography variant="overline" sx={{ color: "#f3b741", fontWeight: 900, letterSpacing: ".18em" }}>How we serve</Typography><Typography variant="h2" sx={{ mt: 1, fontWeight: 950, letterSpacing: "-.04em", fontSize: { xs: "2.5rem", md: "3.8rem" } }}>Purpose beyond the uniform.</Typography></Stack><Grid container spacing={3}>{values.map((item, index) => <Grid key={item.title} size={{ xs: 12, md: 4 }}><Box sx={{ height: "100%", p: 4, border: "1px solid rgba(255,255,255,.13)", bgcolor: index === 1 ? "rgba(243,183,65,.1)" : "rgba(255,255,255,.035)", borderRadius: 3 }}><Box sx={{ width: 54, height: 54, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "#f3b741", color: "#102b2a", mb: 3 }}>{item.icon}</Box><Typography variant="h5" fontWeight={900}>{item.title}</Typography><Typography sx={{ mt: 1.5, color: "rgba(255,255,255,.68)", lineHeight: 1.75 }}>{item.text}</Typography></Box></Grid>)}</Grid></Container></Box>

    <Box component="section" sx={{ py: { xs: 9, md: 14 } }}><Container maxWidth="lg"><Grid container spacing={{ xs: 5, md: 9 }} alignItems="center"><Grid size={{ xs: 12, md: 6 }}><Box component="img" src={communityImage} alt="Community outreach and support" sx={{ width: "100%", height: { xs: 420, md: 580 }, objectFit: "cover", borderRadius: 4 }} /></Grid><Grid size={{ xs: 12, md: 6 }}><CampaignOutlined sx={{ fontSize: 54, color: "#c4830c" }} /><Typography variant="h2" sx={{ mt: 2, fontWeight: 950, letterSpacing: "-.04em", fontSize: { xs: "2.6rem", md: "4rem" } }}>Small acts. Lasting impact.</Typography><Typography sx={{ mt: 3, color: "#4d625f", fontSize: 18, lineHeight: 1.8 }}>Monthly birthday projects turn personal celebrations into shared care—pooling resources for food distribution to underprivileged communities and institutions such as Asha Daan in Byculla.</Typography><Typography sx={{ mt: 2, color: "#4d625f", fontSize: 18, lineHeight: 1.8 }}>From blood donation drives to venue stewardship, the Rovers answer each call with organisation, warmth and an unwavering commitment to community.</Typography></Grid></Grid></Container></Box>

    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: "#e7ac37" }}><Container maxWidth="md"><Stack alignItems="center" textAlign="center"><Typography variant="h2" sx={{ fontWeight: 950, letterSpacing: "-.04em", fontSize: { xs: "2.5rem", md: "4rem" } }}>Part of the Rovers family?</Typography><Typography sx={{ mt: 2, fontSize: 19, color: "rgba(16,43,42,.75)" }}>Sign in to access attendance, events, galleries and member services.</Typography><Button variant="contained" size="large" onClick={() => navigate("/login")} endIcon={<ArrowForward />} sx={{ mt: 4, bgcolor: "#102b2a", px: 4, py: 1.5, fontWeight: 850, "&:hover": { bgcolor: "#071e1d" } }}>Go to member login</Button></Stack></Container></Box>

    <Box component="footer" sx={{ py: 4, bgcolor: "#071e1d", color: "rgba(255,255,255,.62)" }}><Container maxWidth="lg"><Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}><Stack direction="row" alignItems="center" spacing={1.5}><Box component="img" src={logo} alt="" sx={{ width: 38, height: 38 }} /><Typography fontWeight={800} color="white">Saifee Rovers</Typography></Stack><Typography variant="body2">Service & Sacrifice · Be Prepared · Mumbai</Typography></Stack></Container></Box>
  </Box>;
}
