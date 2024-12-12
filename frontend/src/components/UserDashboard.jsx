import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const UserDashboard = () => {
  const { token } = useContext(AppContext);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/issued-books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIssuedBooks(res.data);
        console.log("ebooks: ", res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIssuedBooks();
  }, [token]);

  const [open, setOpen] = useState(false);

  const handleOpen = (pdf_path) => {
    if (pdf_path) {
      const url = `http://localhost:5000/public/${pdf_path}`;
      setPdfUrl(url);
      setOpen(true);
    }
  };
  const handleClose = () => {
    setPdfUrl("");
    setOpen(false);
  };

  const handleDownload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <Container sx={{ padding: 5 }}>
      {issuedBooks.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No books issued to view
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {issuedBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 1.5,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ marginBottom: 1 }}
                  >
                    {book.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: 1 }}
                  >
                    Author: {book.authors.join(", ")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: 1 }}
                  >
                    Section: {book.section}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleOpen(book?.pdf_path);
                    }}
                    disabled={book.pdf_path ? false : true}
                  >
                    View Pdf
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="pdf-modal"
        aria-describedby="pdf-viewer"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            overflow: "hidden",
            maxHeight: "90%",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">PDF Viewer</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              height: "70vh",
              border: "1px solid #ccc",
              overflow: "hidden",
            }}
          >
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          </Box>

          <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
