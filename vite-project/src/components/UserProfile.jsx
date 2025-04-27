import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../utils/api";

const ProfileDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profile Details</h2>
        <div style={styles.infoRow}>
          <span style={styles.label}>First Name</span>
          <span style={styles.value}>{userData?.first_name || "Not Available"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Last Name</span>
          <span style={styles.value}>{userData?.last_name || "Not Available"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{userData?.email || "Not Available"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Phone</span>
          <span style={styles.value}>{userData?.phone_number || "Not Available"}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      width: "400px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #e9ecef",
    },
    label: {
      fontSize: "14px",
      color: "#6c757d",
    },
    value: {
      fontSize: "14px",
      fontWeight: "500",
    },
    editButton: {
      marginTop: "20px",
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

export default ProfileDetails;