import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Check as CheckIcon, Clear as ClearIcon } from "@mui/icons-material";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/reservations/" + id
        );

        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch reservations.");
        }
      } catch (err) {
        setError(err.message || "Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleConfirm = async (resv_id) => {
    const response = await fetch(
      "http://localhost:8080/reservations/" + resv_id + "/confirm",
      {
        method: "PUT",
      }
    );

    if (response.ok) {
      const updatedReservations = reservations.map((reservation) => {
        if (reservation.resv_id === resv_id) {
          return { ...reservation, status: "active" };
        }
        return reservation;
      });
      setReservations(updatedReservations);
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to confirm reservation");
    }
  };

  const handleCancel = async (resv_id) => {
    const response = await fetch(
      "http://localhost:8080/reservations/" + resv_id + "/cancel",
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const updatedReservations = reservations.filter(
        (reservation) => reservation.resv_id !== resv_id
      );
      setReservations(updatedReservations);
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to cancel reservation.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loading Reservations...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reservations
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Spot</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.resv_id}>
                  <TableCell>#{reservation.resv_id}</TableCell>
                  <TableCell>{reservation.spot_id}</TableCell>
                  <TableCell>{reservation.start_time}</TableCell>
                  <TableCell>{reservation.end_time}</TableCell>
                  <TableCell>
                    <Chip
                      label={reservation.status}
                      color={
                        reservation.status === "active"
                          ? "success"
                          : reservation.status === "upcoming"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleConfirm(reservation.resv_id)}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleCancel(reservation.resv_id)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
