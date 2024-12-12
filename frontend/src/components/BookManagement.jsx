import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Grid,
  InputAdornment,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const BookManagement = () => {
  const { token } = useContext(AppContext);
  const [ebooks, setEbooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [newEbook, setNewEbook] = useState({
    book_id: "",
    name: "",
    content: "",
    authors: "",
    section: "",
    image: null,
  });
  const [editEbook, setEditEbook] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    bookName: "",
    authorName: "",
    sectionName: "",
    bookID: "",
  });

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEbooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/sections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSections(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEbooks();
    fetchSections();
  }, [token]);

  useEffect(() => {
    const { bookName, authorName, sectionName, bookID } = searchCriteria;
    const filtered = ebooks.filter((book) => {
      return (
        (bookName === "" ||
          book.name.toLowerCase().includes(bookName.toLowerCase())) &&
        (authorName === "" ||
          book.authors.some((author) =>
            author.toLowerCase().includes(authorName.toLowerCase())
          )) &&
        (bookID === "" ||
          (book.book_id &&
            String(book.book_id)
              .toLowerCase()
              .includes(String(bookID).toLowerCase()))) &&
        (sectionName === "" ||
          book.section?.name.toLowerCase().includes(sectionName.toLowerCase()))
      );
    });
    setFilteredBooks(filtered);
  }, [ebooks, searchCriteria]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };

  const [file, setFile] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpdateFileChange = (e) => {
    setUpdateFile(e.target.files[0]);
  };

  const addEbook = async () => {
    try {
      if (
        !newEbook.book_id ||
        !newEbook.name ||
        !newEbook.content ||
        !newEbook.authors ||
        !newEbook.section
      ) {
        toast.error("Please fill all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("book_id", newEbook.book_id);
      formData.append("name", newEbook.name);
      formData.append("content", newEbook.content);
      formData.append("authors", newEbook.authors);
      formData.append("section", newEbook.section);

      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/librarian/ebooks",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Book added successfully");
        const res = await axios.get("http://localhost:5000/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEbooks(res.data);
        setFilteredBooks(res.data);
        setFile(null);
        setNewEbook({
          book_id: "",
          name: "",
          content: "",
          authors: "",
          section: "",
          image: "",
        });
      } else {
        toast.error("Error adding Book");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || err.response?.data || "Error adding Book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (ebook) => {
    setSelectedEbook(ebook);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/ebooks/${selectedEbook._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEbooks(ebooks.filter((ebook) => ebook._id !== selectedEbook._id));
      setFilteredBooks(
        filteredBooks.filter((ebook) => ebook._id !== selectedEbook._id)
      );
      toast.success("Book deleted successfully");
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting Book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEbook(null);
  };

  const updateEbook = async () => {
    try {
      const formData = new FormData();
      formData.append("book_id", editEbook.book_id);
      formData.append("name", editEbook.name);
      formData.append("content", editEbook.content);
      formData.append("authors", editEbook.authors);
      formData.append("section", editEbook.section);

      if (updateFile) {
        formData.append("image", updateFile);
      }

      const res = await axios.put(
        `http://localhost:5000/api/librarian/ebooks/${editEbook._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedEbook = res.data;

      const updatedEbookWithSection = {
        ...updatedEbook,
        section:
          sections.find((section) => section._id === updatedEbook.section) ||
          editEbook.section,
      };

      setUpdateFile(null);
      setEbooks(
        ebooks.map((ebook) =>
          ebook._id === editEbook._id ? updatedEbookWithSection : ebook
        )
      );
      setFilteredBooks(
        filteredBooks.map((ebook) =>
          ebook._id === editEbook._id ? updatedEbookWithSection : ebook
        )
      );
      setEditEbook(null);
      setOpen(false);
      toast.success("Book updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error updating Book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewEbook({ ...newEbook, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEbook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditOpen = (ebook) => {
    setEditEbook({
      ...ebook,
      section: ebook.section?._id || "",
    });
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditEbook(null);
    setOpen(false);
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    
    <Container sx={{ paddingTop: 5 }}>
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
        ADD BOOK
      </Typography>

      <TextField
        label="Book ID"
        name="book_id"
        value={newEbook.book_id}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Book Name"
        name="name"
        value={newEbook.name}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Content"
        name="content"
        value={newEbook.content}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Authors (comma separated)"
        name="authors"
        value={newEbook.authors}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        select
        label="Category"
        name="section"
        value={newEbook.section}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      >
        {sections.map((section) => (
          <MenuItem key={section._id} value={section._id}>
            {section.name}
          </MenuItem>
        ))}
      </TextField>
      <Grid container gap={2} sx={{ alignItems: "center" }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ marginBottom: 5 }}
        >
          Upload Cover Photo
          <VisuallyHiddenInput
            type="file"
            name="image"
            onChange={handleFileChange}
            multiple
          />
        </Button>
        <Grid item>{file?.name}</Grid>
      </Grid>
      <Grid container>
        <Button
          onClick={addEbook}
          variant="contained"
          color="primary"
          sx={{ marginBottom: 5 }}
        >
          Add Book
        </Button>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Book ID"
            name="bookID"
            value={searchCriteria.bookID}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.bookName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("bookID")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Book Name"
            name="bookName"
            value={searchCriteria.bookName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.bookName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("bookName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Author Name"
            name="authorName"
            value={searchCriteria.authorName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.authorName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("authorName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Typography
        variant="h6"
      
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#333",
          padding: "17px",
          
        }}
      >
        Book List
      </Typography>
        {/* <Grid item xs={12} sm={4}>
          <TextField
            label="Search Category Name"
            name="sectionName"
            value={searchCriteria.sectionName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.sectionName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("sectionName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid> */}
        
      </Grid>
      {filteredBooks.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #ccc", marginTop: 0, marginBottom: 10 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>SNo.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Book Cover</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Book ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Book Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Authors</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book, index) => (
                <TableRow key={book._id}>
                  <TableCell>{index+1}</TableCell>
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
                  <TableCell>{book.book_id}</TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.authors.join(", ")}</TableCell>
                  <TableCell>{book.section?.name}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOpen(book)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(book)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No Books found.
        </Typography>
      )}
      <Modal open={open} onClose={handleEditClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ marginBottom: 2 }} variant="h6" component="h2">
            Edit Book
          </Typography>
          <TextField
            label="Book ID"
            name="book_id"
            value={editEbook?.book_id || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Book Name"
            name="name"
            value={editEbook?.name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Content"
            name="content"
            value={editEbook?.content || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Authors (comma separated)"
            name="authors"
            value={editEbook?.authors || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            select
            label="Category"
            name="section"
            value={editEbook?.section || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          >
            {sections.map((section) => (
              <MenuItem key={section._id} value={section._id}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>
          <Grid container sx={{ alignItems: "center" }}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ marginBottom: 5 }}
            >
              Upload Cover Photo
              <VisuallyHiddenInput
                type="file"
                name="image"
                onChange={handleUpdateFileChange}
                multiple
              />
            </Button>
            <Grid item>{updateFile?.name}</Grid>
          </Grid>
          <Grid container>
            <Button
              onClick={updateEbook}
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
            >
              Save
            </Button>
            <Button
              onClick={handleEditClose}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this ebook ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookManagement;
