import React, { useContext } from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { AppContext } from "../context/AppContext";

const ProfilePage = () => {
  const profile = useContext(AppContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            alt={profile.name}
            src={`http://localhost:5000/public/${profile.profile_pic}`}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {profile.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.role}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Username"
                value={profile.username}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                sx={{ mr: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Phone"
                value={profile.phone}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                sx={{ mr: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Email"
                value={profile.email}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                sx={{ mr: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
