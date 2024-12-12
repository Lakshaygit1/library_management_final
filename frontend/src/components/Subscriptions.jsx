import { toast } from "react-toastify";
import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { plans } from "./plans";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Container,
} from "@mui/material";

const Subscription = () => {
  const { token, subscription } = useContext(AppContext);
  console.log(subscription);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [subscriptions, setSubscriptions] = useState(subscription);

  const handleSubscribe = async (plan) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/subscription",
        {
          subscription: plan.name.toLowerCase(),
          request_available: plan.request_available,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(plan);
      setSubscriptions(plan.name.toLowerCase());
      localStorage.setItem("subscription", plan.name.toLowerCase());
      localStorage.setItem("request_available", plan.request_available);
      setMessage(`You have successfully subscribed to the ${plan.name} plan.`);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error requesting book";

      if (err.response.status === 403) {
        navigate("/subscription");
        toast.error(
          "Please upgrade your subscription. You have exceeded your plan limit to request books"
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/subscription",
        {
          subscription: "none",
          request_available: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubscriptions("none");
      localStorage.setItem("subscription", "none");
      localStorage.setItem("request_available", 0);
      setMessage("You have canceled your subscription.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container sx={{ marginTop: 10 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Plans
      </Typography>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {plan.price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Features:
                </Typography>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant="body2">{feature}</Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                {subscriptions == plan.name.toLocaleLowerCase() ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      disabled
                    >
                      Subscribed
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleCancelSubscription}
                    >
                      Cancel Plan
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubscribe(plan)}
                  >
                    Subscribe
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Subscription;
