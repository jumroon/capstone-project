const knex = require("../db/connection");

//all endpoints in this file are for /reservations and require arguments
// (at the minimum a date parameter, according to the readme for the project)

function getAllReservationsByMobileNumber(mobileNumber) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobileNumber.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function postReservation(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function updateReservation(reservationId, reservation) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update(reservation, "*");
}

function getReservationsByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservations.reservation_date");
}

function getReservationById(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function updateReservationStatus(reservationId, statusUpdate) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: statusUpdate }, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  postReservation,
  getReservationsByDate,
  getReservationById,
  updateReservationStatus,
  getAllReservationsByMobileNumber,
  updateReservation,
};
