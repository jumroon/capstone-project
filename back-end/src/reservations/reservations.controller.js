const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function listReservationByDate(request, response) {
  const date = request.query.date;
  const reservations = await service.getReservationsByDate(date);
  const sortedRservations = reservations.sort((a, b) => {
    const [ah, am, as] = a.reservation_time.split(":");
    const [bh, bm, bs] = b.reservation_time.split(":");
    if (ah !== bh) {
      return ah - bh;
    }
    if (am !== bm) {
      return am - bm;
    }
    return as - bs;
  });

  response.json({
    data: reservations,
  });
}

async function createReservation(request, response) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = request.body;
  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  const makeNewReservation = await service.postReservation(newReservation);
  response.status(201).json({ data: makeNewReservation });
}

function checkIfDataExists(request, response, next) {
  const data = request.body.data;
  if (data) {
    next();
  } else {
    next({ status: 400, message: "Data is missing" });
  }
}

//helper function to check if reservation time is actually a time

function isTime(string) {
  // Define a regular expression that matches a time in the format "hh:mm"
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Test the string against the regular expression
  return timeRegex.test(string);
}

function checkDataParameters(request, response, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = request.body;
  if (
    first_name &&
    last_name &&
    mobile_number &&
    reservation_date &&
    reservation_time &&
    people &&
    !isNaN(Date.parse(reservation_date)) &&
    isTime(reservation_time) &&
    typeof people === "number"
  ) {
    next();
  } else {
    next({
      status: 400,
      message:
        "The following fields are required: first_name, last_name, mobile_number, reservation_date, reservation_time, people",
    });
  }
}

module.exports = {
  list: [listReservationByDate],
  post: [checkIfDataExists, checkDataParameters, createReservation],
};
