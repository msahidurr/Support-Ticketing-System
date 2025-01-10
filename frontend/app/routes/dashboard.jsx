import { useEffect, useState } from "react";
import {
  Page,
  Card,
  Button,
  Banner,
  TextField,
  Select,
  Modal,
  FormLayout,
  TextContainer,
} from "@shopify/polaris";
import axios from "axios";
import "@shopify/polaris/build/esm/styles.css";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [editModalActive, setEditModalActive] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch tickets
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    setUser(user);
    setToken(token);

    if(!token) {
      // Redirect to login page
      window.location.href = "/login";
    }
    const fetchTickets = async () => {
      try {
        let getTicket = `${apiUrl}/tickets`
        if(user?.role == 'Admin') {
          getTicket = `${apiUrl}/tickets/admin`
        }

        const { data } = await axios.get(getTicket, {
          headers: { Authorization: token },
        });
        setTickets(Array.isArray(data) ? data : data.tickets || []);
      } catch (error) {
        setAlertMessage("Failed to fetch tickets:", error.message)
        setAlertType("error")
      }
    };

    fetchTickets();
  }, []);

  // Handle Ticket Creation
  const handleCreateTicket = async () => {
    if (!subject || !description) {
      setAlertMessage("Subject and Description are required!")
      setAlertType("error")
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/tickets/create`,
        { subject, description },
        {
          headers: { Authorization: token },
        }
      );
      setTickets((prevTickets) => [...prevTickets, data]); // Add new ticket to state
      setIsModalOpen(false); // Close modal
      setSubject(""); // Reset form fields
      setDescription("");
      setAlertMessage("Ticket created successfully!")
      setAlertType("success")
      await fetchTickets();
    } catch (error) {
      setAlertMessage("Failed to create ticket:")
      setAlertType("error")
    }
  };

  const handleOpenEditModal = (ticket) => {
    setSelectedTicket(ticket);
    setEditSubject(ticket.subject);
    setEditDescription(ticket.description);
    setAdminReply(ticket.description);
    setEditModalActive(true);
  };

  const handleCloseEditModal = () => {
    setEditModalActive(false);
    setSelectedTicket(null);
  };

  const handleSaveChanges = async () => {
    try {
      const { id } = selectedTicket;
      const updatedTicket = { 
        subject: editSubject,
        description: editDescription,
        status,
        adminReply
      };

      await axios.put(
        `${apiUrl}/tickets/update/${id}`,
        updatedTicket,
        {
          headers: { Authorization: token },
        }
      );

      // Update tickets state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
        )
      );

      handleCloseEditModal();
      setAlertMessage("Ticket updated successfully!")
      setAlertType("success")
    } catch (error) {
      setAlertMessage("Failed to update ticket!")
      setAlertType("error")
    }
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/login";
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertType("");
  };

  return (
    <Page title={user?.role + ' Dashboard'}>
      <Button onClick={handleLogout} primary style={{ marginBottom: "20px" }}>
        Logout
      </Button>

      {user?.role === "Customer" && (
        <Button onClick={() => setIsModalOpen(true)} primary>
        Create Ticket
      </Button>
      )}

      {/* Display Banner */}
      {alertMessage && (
        <Banner
          title={alertMessage}
          status={alertType} // "success" or "critical"
          onDismiss={closeAlert} // Close the banner
        />
      )}

      {/* Modal for Ticket Creation */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Ticket"
        primaryAction={{
          content: "Submit",
          onAction: handleCreateTicket,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Subject"
              value={subject}
              onChange={(value) => setSubject(value)}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(value) => setDescription(value)}
              multiline
            />
          </FormLayout>
        </Modal.Section>
      </Modal>

      {Array.isArray(tickets) && tickets.length > 0 ? (
        tickets.map((ticket) => (
          <Card key={ticket.id} title={ticket.subject}>
              <p>Subject: {ticket.subject}</p>
              <p>Description: {ticket.description}</p>
              <p>Status: {ticket.status}</p>
              {ticket.admin_reply && (
                <p>Admin Reply: {ticket.admin_reply}</p>
              )}
              <Button primary onClick={() => handleOpenEditModal(ticket)}>
                Edit
              </Button>
          </Card>
        ))
      ) : (
        <TextContainer>
          <p>No tickets available.</p>
        </TextContainer>
      )}

      {selectedTicket && (
        <Modal
          open={editModalActive}
          onClose={handleCloseEditModal}
          title={`Edit Ticket: ${selectedTicket.subject}`}
          primaryAction={{
            content: "Save",
            onAction: handleSaveChanges,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleCloseEditModal,
            },
          ]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Subject"
                value={editSubject}
                onChange={(value) => setEditSubject(value)}
              />
              <TextField
                label="Description"
                value={editDescription}
                onChange={(value) => setEditDescription(value)}
                multiline
              />

              {user?.role === "Admin" && (
                <>
                <Select
                  label="Status"
                  options={[
                    { label: "Open", value: "open" },
                    { label: "Resolved", value: "resolved" },
                    { label: "Closed", value: "closed" },
                  ]}
                  value={status}
                  onChange={(value) => setStatus(value)}
                />

                <TextField
                  label="Reply"
                  value={adminReply}
                  onChange={(value) => setAdminReply(value)}
                  multiline
                />
                </>
              )}
            </FormLayout>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
