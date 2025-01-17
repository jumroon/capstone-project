import React from "react";
import { setReservationStatus } from "../utils/api";
import { useHistory, Link } from "react-router-dom";

function ReservationsList({ reservations }) {
  const history = useHistory();

  const handleCancel = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      await setReservationStatus(reservation_id, "cancelled");
      history.go(0);
    }
  };

  return (
    <div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0 mt-5">Reservations</h4>
      </div>
      <div>
        {reservations.map((reservation) => {
          return (
            <div className="item-container" key={reservation.reservation_id}>
              <table>
                <tbody>
                  <tr>
                    <th>First Name</th>
                    <td>{reservation.first_name}</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td>{reservation.last_name}</td>
                  </tr>
                  <tr>
                    <th>Mobile Number</th>
                    <td>{reservation.mobile_number}</td>
                  </tr>
                  <tr>
                    <th>Reservation Date</th>
                    <td>{reservation.reservation_date}</td>
                  </tr>
                  <tr>
                    <th>Reservation Time</th>
                    <td>{reservation.reservation_time}</td>
                  </tr>
                  <tr>
                    <th>People</th>
                    <td>{reservation.people}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <div
                        data-reservation-id-status={reservation.reservation_id}>
                        {reservation.status}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                {reservation.status === "booked" && (
                  <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    <button className="btn btn-primary">Seat</button>
                  </Link>
                )}
                <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                  <button className="btn btn-primary">Edit</button>
                </Link>
                {reservation.status !== "cancelled" && (
                  <button
                    className="btn btn-secondary"
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() => handleCancel(reservation.reservation_id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReservationsList;
