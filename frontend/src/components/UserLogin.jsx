import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #6a114b, #5a56fc)",
  padding: "20px",
});

const LoginCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "400px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  padding: theme.spacing(1.5, 4),
  textTransform: "uppercase",
  fontWeight: 600,
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  color: "#fff",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
}));
const StyledBox = styled(Box)(({ theme }) => ({
  background: "#ffffff", // Neutral white background for the form
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
}));

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { role, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
        role: "user",
      });
      console.log("-----------------------------");
      console.log(res.data);
      console.log("-----------------------------");
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: res.data.token,
          role: res.data.user.role,
          name: res.data.user.name,
          username: res.data.user.username,
          phone: res.data.user.phone,
          email: res.data.user.email,
          profile_pic: res.data.user.profile_pic,
          subscription: res.data.user?.subscription,
          request_available: res.data.user?.request_available,
        },
      });
      // navigate(`/${res.data.user.role}`);
      navigate(`/`);
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error during login";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <GradientBackground>
      <StyledBox
        maxWidth={400}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.9" }} // Slight transparency for the form background
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="600"
          gutterBottom
          color="navy"
        >
          USER LOGIN
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="textSecondary"
          gutterBottom
        >
          Please login to continue
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ borderRadius: "8px" }}
          />
          <TextField
            margin="normal"
            type="password"
            variant="outlined"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ borderRadius: "8px" }}
          />
          <StyledButton
            startIcon={<LoginIcon />}
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </StyledButton>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button
              endIcon={<PersonAddIcon />}
              fullWidth
              sx={{
                marginTop: 3,
                borderRadius: "25px",
                color: "#6a11cb",
                backgroundColor: "transparent",
                fontWeight: 600,
                "&:hover": { backgroundColor: "rgba(106, 17, 203, 0.1)" },
              }}
            >
              Don’t have an account? Register
            </Button>
          </Link>
        </form>
      </StyledBox>
    </GradientBackground>
  );
};

export default UserLogin;
