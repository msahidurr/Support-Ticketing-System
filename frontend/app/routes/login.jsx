import { FormLayout, Page, TextField, Button, Card } from "@shopify/polaris";
import { useEffect, useState } from "react";
import "@shopify/polaris/build/esm/styles.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(token) {
      // Redirect to dashboard page
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSubmit = async () => {
    try {
        const response = await axios.post(`http://localhost:5000/api/auth/login`, {
            username,
            password,
        });
    
        if (response.data.success) {
            // Store token or user information
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
    
            window.location.href = "/dashboard";
        } else {
            alert("Invalid username or password.");
        }
        } catch (err) {
        console.error("Login error:", err);
        alert("username and password required");
    }
  };

  return (
    <Page title="Login">
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
