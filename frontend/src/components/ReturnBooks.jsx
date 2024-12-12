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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  MenuList,
  Avatar,
} from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { toast } from "react-toastify";
import { format } from "date-fns"; // Import date-fns for date formatting

const ReturnBooks = () => {
  const { token } = useContext(AppContext);

  const [student, setStudent] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [returnBook, setReturnBook] = useState(null);

  const fetchStudentResults = async (searchQuery) => {
    setStudentLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/librarian/students?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = response.data;
      console.log(data);
      setStudentList(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setStudentLoading(false);
  };

  const handleStudentInputChange = (event) => {
    const value = event.target.value;
    setStudentQuery(value);
    if (value.trim() !== "") {
      fetchStudentResults(value);
    } else {
      setStudentList([]);
    }
  };

  const fetchBorrowedBooks = async (_student) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/librarian/issued-books/student/${_student._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = response.data;
      console.log(data);
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleStudentSelect = (item) => {
    setStudent(item);
    fetchBorrowedBooks(item);
    setStudentQuery("");
    setStudentList([]);
    setBooks([]);
  };

  const handleReturnConfirm = async () => {
    try {
      const returnDate = Date.now();
      const status = "Returned";
      await axios.put(
        `http://localhost:5000/api/librarian/issued-books/${returnBook._id}`,
        { returnDate, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const date = new Date(returnDate);
      setBooks((books) =>
        books.map((book) =>
          book._id === returnBook._id
            ? { ...book, status: "Returned", returnDate: date.toISOString() }
            : book
        )
      );

      toast.success("Book Returned successfully");
      handleClose();
    } catch (err) {
      const errorMessage = err.response || "Error deleting Student";
      console.error(err);
      // toast.error(errorMessage);
    }
  };

  const handleReturn = (book) => {
    setReturnBook(book);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);

  const handleReturnAll = async (studentid) => {
    const returnDate = Date.now();

    let returnBooks = books.filter((book) => book.status === "Issued");

    try {
      await axios.put(
        `http://localhost:5000/api/librarian/students/${studentid}/issued-books`,
        {
          books: returnBooks.map((book) => ({
            _id: book._id,
            status: "Returned",
            returnDate: returnDate,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.status === "Issued"
            ? { ...book, status: "Returned", returnDate: new Date(returnDate) }
            : book
        )
      );

      toast.success("Book Returned successfully");
      handleClose();
    } catch (err) {
      const errorMessage = err.response || "Error deleting Student";
      console.error(err);
      // toast.error(errorMessage);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        sx={{
          justifyContent: "center",
          maxHeight: 5000,
          overflowY: "auto",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={studentQuery}
          onChange={handleStudentInputChange}
          placeholder="Search by Student Name or Roll Number"
          InputProps={{
            endAdornment: studentLoading ? <CircularProgress size={20} /> : null,
          }}
        />
        {studentList.length > 0 && (
          <Paper
            style={{
              position: "absolute",
              width: "550px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 10,
              marginTop: 4,
            }}
          >
            <MenuList>
              {studentList.map((item, index) => (
                <MenuItem key={index} onClick={() => handleStudentSelect(item)}>
                  {item.reg_no} - {item.name}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
        {student && (
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "20px", justifyContent: "space-between" }}
          >
            <Grid item xs={6}>
              <Typography>
                <strong>Student ID:</strong> {student.reg_no}
              </Typography>
              <Typography>
                <strong>Student Name:</strong> {student.name}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleReturnAll(student._id)}
                disabled={books.every((book) => book.status !== "Issued")}
              >
                Return All
              </Button>
            </Grid>
          </Grid>
        )}
  
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            borderRadius: 2,
            overflowX: "auto",
            marginTop: 3,
            marginBottom: 5,
            
            
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow> 
                <TableCell sx={{ fontWeight: "bold" }}>Sno.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Book ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Author</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>Issue Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Return Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      alt="Book Cover"
                      src={`http://localhost:5000/public/${book.book.cover_path}`}
                      variant="square"
                      sx={{
                        width: 80,
                        height: 95,
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{book.student.reg_no}</TableCell>
                  <TableCell>{book.student.name}</TableCell>
                  <TableCell>{book.book.book_id}</TableCell>
                  <TableCell>{book.book.name}</TableCell>
                  {/* <TableCell>{book.book.authors}</TableCell> */}
                  <TableCell>
                    {format(new Date(book.issueDate), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(book.dueDate), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell>
                    {book.returnDate
                      ? format(new Date(book.returnDate), "dd-MM-yyyy")
                      : "Not Returned"}
                  </TableCell>
                  {book.status === "Issued" ? (
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleReturn(book)}
                      >
                        <SettingsBackupRestoreIcon />
                      </IconButton>
                    </TableCell>
                  ) : (
                    <TableCell>{book.status}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Return"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to return this book?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleReturnConfirm} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  
  );
};

export default ReturnBooks;
