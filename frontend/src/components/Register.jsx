import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  styled,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";
import backgroundImage from "../images/background.jpg";

const StyledBox = styled(Box)(({ theme }) => ({
  background: "#ffffff", // Neutral white background for the form
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  color: "#fff",
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  textTransform: "uppercase",
  fontWeight: 600,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicName, setProfilePicName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("userType", userType);
    formData.append("role", userType);

    if (profilePic) {
      formData.append("image", profilePic);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
        },
      });
      if (res.data.user.role === "user") {
        navigate(`/`);
      } else if (res.data.user.role === "librarian") {
        navigate(`/librarian`);
      } else {
        localStorage.clear();
        navigate("/");
      }
      toast.success("Registration successful!");
    } catch (err) {
      console.error(err);
      toast.error("Error during registration");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicName(file.name);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <StyledBox
        maxWidth={400}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.9)" }} // Slight transparency for the form background
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
          />
          <RadioGroup
            row
            name="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{ margin: "10px 0" }}
          >
            <FormControlLabel
              value="librarian"
              label="Admin"
              control={<Radio color="primary" />}
            />
            <FormControlLabel
              value="user"
              label="User"
              control={<Radio color="primary" />}
            />
          </RadioGroup>
          <TextField
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Upload Profile Pic
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Button>
          {profilePicName && (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              gutterBottom
            >
              {profilePicName}
            </Typography>
          )}
          <StyledButton
            startIcon={<PersonAddIcon />}
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </StyledButton>
          <Grid container sx={{ mt: 2 }}>
            <Grid item>Already have an account?</Grid>

            <Grid item>
              <Link to="/admin-login" style={{ textDecoration: "none" }}>
                <Button
                  endIcon={<LoginIcon />}
                  fullWidth
                  sx={{ marginTop: 2 }}
                  color="secondary"
                >
                  Admin Login
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/user-login" style={{ textDecoration: "none" }}>
                <Button
                  endIcon={<LoginIcon />}
                  fullWidth
                  sx={{ marginTop: 2 }}
                  color="secondary"
                >
                  User Login
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </StyledBox>
    </Box>
  );
};

export default Register;
