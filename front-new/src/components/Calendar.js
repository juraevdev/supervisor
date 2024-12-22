import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const CalendarView = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedDayExpenses, setSelectedDayExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchExpenses = () => {
    axios
      .get("/api/v1/expenses/outcome/all/")
      .then((response) => setOutcomes(response.data))
      .catch((error) => console.error("Error fetching expenses:", error));
  };

  useEffect(() => {
    fetchExpenses("month");
  }, []);

  const handleDayClick = (info) => {
    const clickedDate = info.dateStr;
    axios
      .get("/api/v1/expenses/daily/")
      .then((response) => {
        setSelectedDayExpenses(response.data);
        setShowModal(true);
      })
      .catch((error) => console.error("Error fetching daily expenses:", error));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Haftalik/Oylik Xarajatlar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={outcomes.map((outcome) => ({
          title: `Jami: $${outcome.total}`,
          date: outcome.date,
        }))}
        dateClick={handleDayClick}
      />
      {showModal && (
        <div className="modal">
          <h2>Tanlangan Kunda Xarajatlar</h2>
          <ul>
            {selectedDayExpenses.map((outcome) => (
              <li key={outcome.id}>
                {outcome.expense}: ${outcome.amount}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>Yopish</button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
