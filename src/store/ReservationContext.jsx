import { createContext, useContext, useEffect, useState } from "react";

const ReservationContext = createContext();

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("reservations");
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing reservations from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  function addReservation(reservation) {
    // Ensure date is a YYYY-MM-DD string
    const dateKey =
      typeof reservation.date === "string"
        ? reservation.date
        : formatDateKey(reservation.date);

    const newRes = {
      id: Date.now(),
      date: dateKey,
      ...reservation,
    };

    setReservations((prev) => [...prev, newRes]);
    return newRes;
  }

  function removeReservation(id) {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }

  function reservationsForDate(date) {
    const key = typeof date === "string" ? date : formatDateKey(date);
    return reservations.filter((r) => r.date === key);
  }

  function getResourceList() {
    const seen = new Set();
    const list = [];
    reservations.forEach((r) => {
      if (r.aula) {
        const k = `aula|${r.aula}`;
        if (!seen.has(k)) {
          seen.add(k);
          list.push({ type: "aula", name: r.aula });
        }
      }
      if (r.item) {
        const k = `item|${r.item}`;
        if (!seen.has(k)) {
          seen.add(k);
          list.push({ type: "item", name: r.item });
        }
      }
    });
    return list;
  }

  function upcomingReservationsForResource(type, name, days = 30) {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + days);

    return reservations
      .filter((r) => (type === "aula" ? r.aula === name : r.item === name))
      .filter((r) => {
        const d = new Date(r.date + "T00:00:00");
        return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate()) && d <= end;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        removeReservation,
        reservationsForDate,
        getResourceList,
        upcomingReservationsForResource,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservations must be used within ReservationProvider");
  return ctx;
}
