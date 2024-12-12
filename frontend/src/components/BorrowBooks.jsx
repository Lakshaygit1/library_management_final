import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  TextField,
  CircularProgress,
  Button,
  MenuItem,
  Paper,
  MenuList,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import { format } from "date-fns"; 

const BorrowBook = () => {
  const { token } = useContext(AppContext);

  const [student, setStudent] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const [book, setBook] = useState("");
  const [bookList, setBookList] = useState([]);
  const [bookQuery, setBookQuery] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [issuedBooks, setIssuedBooks] = useState([]);

  const fetchStudentResults = async (searchQuery) => {
    setStudentLoading(true);
    try {
      if (searchQuery) {
        const response = await axios.get(
          `http://localhost:5000/api/librarian/students?query=${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let data = await response.data;
        setStudentList(data || []);
      } else {
        setStudentList([]);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setStudentLoading(false);
  };

  const fetchIssuedBooks = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/librarian/issued-books`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data;
    console.log(data);
    setIssuedBooks(data || []);
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleStudentInputChange = (event) => {
    const value = event.target.value;
    setStudentQuery(value);
    if (value.trim() !== "") {
      fetchStudentResults(value);
    } else {
      setStudentList([]);
    }
  };

  const handleStudentSelect = (item) => {
    setStudent(item);
    setStudentQuery("");
    setStudentList([]);
  };

  const fetchBookResults = async (searchQuery) => {
    setBookLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/ebooks?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let data = response.data;
      setBookList(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setBookLoading(false);
  };

  const handleBookInputChange = (event) => {
    const value = event.target.value;
    setBookQuery(value);
    if (value.trim() !== "") {
      fetchBookResults(value);
    } else {
      setBookList([]);
    }
  };

  const handleBookSelect = (item) => {
    setBook(item);
    setBookQuery("");
    setBookList([]);
  };

  const handleBorrowBook = async (e) => {
    e.preventDefault();

    try {
      if (!student || !book) {
        toast.error("Please select both student and book");
        return;
      }

      const currentDate = new Date();
      const dueDate = new Date(currentDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const formattedDueDate = format(dueDate, "dd-MM-yyyy");

      const payload = {
        student,
        book,
        dueDate,
      };

      const response = await axios.post(
        `http://localhost:5000/api/librarian/issued-books`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        const data = response.data;
        setStudent(null);
        setBook(null);
        setIssuedBooks((prevState) => [...prevState, data]);
        toast.success("Book issued successfully");
      } else {
        toast.error(`Failed to issue book. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error issuing book:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Grid
        container
        spacing={3}
        sx={{ marginBottom: 5, justifyContent: "center" }}
      >
        <Grid item xs={12} sm={6} md={6} sx={{ justifyContent: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={studentQuery}
            onChange={handleStudentInputChange}
            placeholder="Student Reg No. / Student Name / Email"
            InputProps={{
              endAdornment: studentLoading ? (
                <CircularProgress size={20} />
              ) : null,
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
                  <MenuItem
                    key={index}
                    onClick={() => handleStudentSelect(item)}
                  >
                    {item.reg_no} - {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          )}
          {student && (
            // <div style={{ marginTop: "20px" }}>
            //   <strong>Selected:</strong> {student}
            // </div>
            <Grid container spacing={5} sx={{ marginTop: 1 }}>
              <Grid item sx={{ width: "100%" }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {student.reg_no} - {student.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {student.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {student.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Department: {student.department}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Semester: {student.semester}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={6} sx={{ justifyContent: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={bookQuery}
            onChange={handleBookInputChange}
            placeholder="Book Name"
            InputProps={{
              endAdornment: bookLoading ? <CircularProgress size={20} /> : null,
            }}
          />
          {bookList.length > 0 && (
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
                {bookList.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleBookSelect(item)}>
                    {item?.book_id} - {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          )}
          {book && (
            <Grid container spacing={5} sx={{ marginTop: 1 }}>
              <Grid item sx={{ width: "100%" }}>
                <Card>
                  <CardContent>
                  <TableCell>
  <Avatar
    alt="Book Cover"
    src={`http://localhost:5000/public/${book.cover_path}`}
    variant="square" // Makes it a square/rectangle
    sx={{
      width: 80,
      height: 95,
      
      objectFit: "cover", // Ensures the image fills the rectangle without distortion
    }}
  />
</TableCell>
                    <Typography variant="h6" component="div">
                      {book?.book_id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Book Name: {book.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Category: {book.section.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Author: {book.authors}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Button
        onClick={handleBorrowBook}
        variant="contained"
        color="primary"
        sx={{ marginBottom: 5 }}
        disabled={!student || !book}
      >
        Borrow book
      </Button>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Borrowed Books
      </Typography>

      {issuedBooks.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            borderRadius: 2,
            overflowX: "auto",
          }}
        >
          
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Sno.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Issue ID</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>Book ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                {/*<TableCell sx={{ fontWeight: "bold" }}>Author</TableCell>*/}
                <TableCell sx={{ fontWeight: "bold" }}>Issue Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuedBooks.map((book, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>
  <Avatar
    alt="Book Cover"
    src={`http://localhost:5000/public/${book.book.cover_path}`}
    variant="square" // Makes it a square/rectangle
    sx={{
      width: 80,
      height: 95,
      
      objectFit: "cover", // Ensures the image fills the rectangle without distortion
    }}
  />
</TableCell>

                  {/* <TableCell>{book.book._id}</TableCell> */}
                  <TableCell>{book.book.book_id}</TableCell>
                  <TableCell>{book.student.reg_no}</TableCell>
                  <TableCell>{book.student.name}</TableCell>
                  <TableCell>{book.book.name}</TableCell>
                  {/* <TableCell>{book.book.authors}</TableCell> */}
                  <TableCell>{format(new Date(book.issueDate), "dd-MM-yyyy")}</TableCell>
                  <TableCell>{format(new Date(book.dueDate), "dd-MM-yyyy")}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        book.status === "Overdue"
                          ? "#d32f2f"
                          : book.status === "Returned"
                          ? "#388e3c"
                          : "#f57c00",
                    }}
                  >
                    {book.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#888", marginTop: "20px" }}
        >
          No books issued yet.
        </Typography>
      )}
    </div>
  );
};

export default BorrowBook;

// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   MenuItem,
//   Grid,
//   InputAdornment,
//   Modal,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import CloseIcon from "@mui/icons-material/Close";

// const BorrowBooks = () => {
//   const { token } = useContext(AppContext);
//   const [ebooks, setEbooks] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [newEbook, setNewEbook] = useState({
//     name: "",
//     content: "",
//     authors: "",
//     section: "",
//   });
//   const [editEbook, setEditEbook] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedEbook, setSelectedEbook] = useState(null);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [searchCriteria, setSearchCriteria] = useState({
//     bookName: "",
//     authorName: "",
//     sectionName: "",
//   });

//   useEffect(() => {
//     const fetchEbooks = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/user/ebooks", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEbooks(res.data);
//         setFilteredBooks(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const fetchSections = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/user/sections", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSections(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchEbooks();
//     fetchSections();
//   }, [token]);

//   useEffect(() => {
//     const { bookName, authorName, sectionName } = searchCriteria;
//     const filtered = ebooks.filter(
//       (book) =>
//         (bookName === "" ||
//           book.name.toLowerCase().includes(bookName.toLowerCase())) &&
//         (authorName === "" ||
//           book.authors.some((author) =>
//             author.toLowerCase().includes(authorName.toLowerCase())
//           )) &&
//         (sectionName === "" ||
//           book.section?.name.toLowerCase().includes(sectionName.toLowerCase()))
//     );
//     setFilteredBooks(filtered);
//   }, [searchCriteria, ebooks]);

//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleClearSearch = (field) => {
//     setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
//   };

//   const addEbook = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/librarian/ebooks", newEbook, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("E-book added successfully");
//       const res = await axios.get("http://localhost:5000/api/user/ebooks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEbooks(res.data);
//       setFilteredBooks(res.data);
//       setNewEbook({
//         name: "",
//         content: "",
//         authors: "",
//         section: "",
//       });
//     } catch (err) {
//       const errorMessage = err.response?.data?.msg || "Error adding E-book";
//       console.error(err);
//       toast.error(errorMessage);
//     }
//   };

//   const handleDeleteClick = (ebook) => {
//     setSelectedEbook(ebook);
//     setOpenDialog(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/librarian/ebooks/${selectedEbook._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEbooks(ebooks.filter((ebook) => ebook._id !== selectedEbook._id));
//       setFilteredBooks(
//         filteredBooks.filter((ebook) => ebook._id !== selectedEbook._id)
//       );
//       toast.success("E-book deleted successfully");
//       handleCloseDialog();
//     } catch (err) {
//       const errorMessage = err.response?.data?.msg || "Error deleting E-book";
//       console.error(err);
//       toast.error(errorMessage);
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedEbook(null);
//   };

//   const updateEbook = async () => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/librarian/ebooks/${editEbook._id}`,
//         editEbook,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const updatedEbook = res.data;

//       const updatedEbookWithSection = {
//         ...updatedEbook,
//         section:
//           sections.find((section) => section._id === updatedEbook.section) ||
//           editEbook.section,
//       };

//       setEbooks(
//         ebooks.map((ebook) =>
//           ebook._id === editEbook._id ? updatedEbookWithSection : ebook
//         )
//       );
//       setFilteredBooks(
//         filteredBooks.map((ebook) =>
//           ebook._id === editEbook._id ? updatedEbookWithSection : ebook
//         )
//       );
//       setEditEbook(null);
//       setOpen(false);
//       toast.success("E-book updated successfully");
//     } catch (err) {
//       const errorMessage = err.response?.data?.msg || "Error updating E-book";
//       console.error(err);
//       toast.error(errorMessage);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewEbook({ ...newEbook, [name]: value });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditEbook((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleEditOpen = (ebook) => {
//     setEditEbook({
//       ...ebook,
//       section: ebook.section?._id || "",
//     });
//     setOpen(true);
//   };

//   const handleEditClose = () => {
//     setEditEbook(null);
//     setOpen(false);
//   };

//   return (
//     <>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             label="Search Book Name"
//             name="bookName"
//             value={searchCriteria.bookName}
//             onChange={handleSearchChange}
//             fullWidth
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//               endAdornment: searchCriteria.bookName && (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => handleClearSearch("bookName")}
//                     edge="end"
//                   >
//                     <ClearIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//               sx: { borderRadius: "20px" },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             label="Search Book Name"
//             name="bookName"
//             value={searchCriteria.bookName}
//             onChange={handleSearchChange}
//             fullWidth
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//               endAdornment: searchCriteria.bookName && (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => handleClearSearch("bookName")}
//                     edge="end"
//                   >
//                     <ClearIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//               sx: { borderRadius: "20px" },
//             }}
//           />
//         </Grid>
// <Button
//   onClick={addEbook}
//   variant="contained"
//   color="primary"
//   sx={{ marginBottom: 5 }}
// >
//   Borrow book
// </Button>
//     </>
//   );
// };

// export default BorrowBooks;

// {
//   /* <TableContainer
//         component={Paper}
//         sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     color="error"
//                     onClick={() => handleDeleteClick(user)}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete this user?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="error" autoFocus>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog> */
// }
