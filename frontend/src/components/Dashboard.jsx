import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { toast } from "react-toastify";
import BorrowBooks from "./BorrowBooks";
import ReturnBooks from "./ReturnBooks";

const Dashboard = () => {
  const { token } = useContext(AppContext);
  const [data, setData] = useState({
    usersCount: 0,
    sections: 0,
    ebooks: 0,
    totalBooksIssued: 0,
    users: [],
  });
  const [borrow, setBorrow] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/user/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prevState) => ({
        ...prevState,
        users: prevState.users.filter((user) => user._id !== selectedUser._id),
      }));
      toast.success("User deleted successfully");
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting User";
      console.error("Error deleting user", err);
      toast.error(errorMessage);
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      {/* Title Section */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          marginBottom: 5,
          color: "#333",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Library Dashboard
      </Typography>

      {/* Card Section */}
      <Grid
        container
        spacing={4}
        sx={{
          marginBottom: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Borrow Books Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ff6a88, #eb348f)",
              color: "#fff",
              height: 180,
              borderRadius: 4,
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              },
            }}
            onClick={() => setBorrow(true)}
          >
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Borrow Books
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Return Books Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #64b5f6, #1e88e5)",
              color: "#fff",
              height: 180,
              borderRadius: 4,
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              },
            }}
            onClick={() => setBorrow(false)}
          >
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Return Books
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subtitle */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          paddingTop: 5,
          fontWeight: "bold",
          color: "#555",
          textTransform: "capitalize",
          letterSpacing: 1,
        }}
      >
        {borrow ? "Borrow Books" : "Return Books"}
      </Typography>

      {/* Content Section */}
      <Container
        sx={{
          marginTop: 5,
          padding: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 4,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {borrow ? <BorrowBooks /> : <ReturnBooks />}
      </Container>
    </Container>
  );
};

export default Dashboard;

