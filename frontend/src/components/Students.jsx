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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const Student = () => {
  const { token } = useContext(AppContext);
  const [newStudent, setNewStudent] = useState({
    reg_no: "",
    name: "",
    phone: "",
    email: "",
    department: "",
    semester: "",
    password: "",
  });

  const [students, setStudents] = useState([]);

  const [editStudent, setEditStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    studentName: "",
    studentRegNo: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/librarian/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [token]);

  const addStudent = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/librarian/students",
        newStudent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Student added successfully");
      const res = await axios.get(
        "http://localhost:5000/api/librarian/students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data);
      setFilteredStudents(res.data);
      setNewStudent({
        reg_no: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        semester: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error adding Student";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const { studentName, studentRegNo } = searchCriteria;
    const filtered = students.filter(
      (student) =>
        student &&
        (studentName === "" ||
          student.name.toLowerCase().includes(studentName.toLowerCase())) &&
        (studentRegNo === "" ||
          student.reg_no.toLowerCase().includes(studentRegNo.toLowerCase()))
    );
    setFilteredStudents(filtered);
  }, [searchCriteria, students]);

  // Handle input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };


  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/librarian/students/${selectedStudent._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedStudents = students.filter(
        (student) => student._id !== selectedStudent._id
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      toast.success("Student deleted successfully");
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting Student";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const updateStudent = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/librarian/students/${editStudent._id}`,
        editStudent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedStudent = res.data;

      const updatedStudents = students.map((student) =>
        student._id === editStudent._id ? updatedStudent : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setEditStudent(null);
      setOpen(false);
      toast.success("Student updated successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Error updating Student Details";
      console.error(err);
      toast.error(errorMessage);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditOpen = (student) => {
    setEditStudent(student);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditStudent(null);
    setOpen(false);
  };

  const semesterItems = [];

  for (let i = 0; i < 8; i++) {
    semesterItems.push(
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    );
  }

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
        ADD STUDENT
      </Typography>
      
      <TextField
        label="Roll no."
        name="reg_no"
        value={newStudent.reg_no}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Student Name"
        name="name"
        value={newStudent.name}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Email"
        name="email"
        value={newStudent.email}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Phone"
        name="phone"
        value={newStudent.phone}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        label="Department"
        name="department"
        value={newStudent.department}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      />
      <TextField
        select
        label="Semester"
        name="semester"
        value={newStudent.semester}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        fullWidth
        required
      >
        {semesterItems}
      </TextField>
      <Button
        onClick={addStudent}
        variant="contained"
        color="primary"
        sx={{ marginBottom: 5 }}
      >
        Add Student
      </Button>

      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search Roll No"
            name="studentRegNo"
            value={searchCriteria.studentRegNo}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.studentRegNo && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("studentRegNo")}
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
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search Student Name"
            name="studentName"
            value={searchCriteria.studentName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.studentName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("studentName")}
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
        Student List
      </Typography>

      {filteredStudents.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #ccc", marginTop: 2, marginBottom: 10 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>SNo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Reg No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Semester</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.reg_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.semester}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOpen(student)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(student)}
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
          No Student found.
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
            Edit Student Details
          </Typography>
          <TextField
            label="Roll No"
            name="reg_no"
            value={editStudent?.reg_no || ""}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
            disabled
          />
          <TextField
            label="Student Name"
            name="name"
            value={editStudent?.name || ""}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
            disabled
          />
          <TextField
            label="Email"
            name="email"
            value={editStudent?.email || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={editStudent?.phone || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Department"
            name="department"
            value={editStudent?.department || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            select
            label="Semester"
            name="semester"
            value={editStudent?.semester || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          >
            {semesterItems}
          </TextField>
          <Button
            onClick={updateStudent}
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
            Are you sure you want to delete this student?
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

export default Student;
