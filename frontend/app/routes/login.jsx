import { FormLayout, Page, TextField, Button, Card, Banner } from "@shopify/polaris";
import { useEffect, useState } from "react";
import "@shopify/polaris/build/esm/styles.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Redirect to dashboard page
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        // Store token or user information
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.href = "/dashboard";
      } else {
        setAlertMessage("Invalid username or password.")
        setAlertType("error")
      }
    } catch (err) {
      setAlertMessage("Invalid username or password.")
      setAlertType("error")
    }
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertType("");
  };

  return (
    <Page title="Login">
      {/* Display Banner */}
      {alertMessage && (
        <Banner
          title={alertMessage}
          status={alertType} // "success" or "critical"
          onDismiss={closeAlert} // Close the banner
        />
      )}

      <FormLayout>
        <Card>
          <TextField
            label="Username"
            value={username}
            onChange={(value) => setUsername(value)}
            autoComplete="off"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
          />
          <Button onClick={handleSubmit} primary>
            Login
          </Button>
        </Card>
      </FormLayout>

      <Card>
        <h3>Admin</h3>
        <p>Username: admin</p>
        <p>Username: 123456</p>

        <h3>Customer</h3>
        <p>Username: john_doe</p>
        <p>Username: securepassword</p>
      </Card>
    </Page>
  );
}
