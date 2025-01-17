const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function checkTableDataParameters(request, response, next) {
  const { table_name, capacity } = request.body.data;

  if (capacity < 1 || table_name.length < 2 || typeof capacity === "string") {
    next({
      status: 400,
      message: `capacity needs to be at least 1 and the length of table_name needs to be at least 2`,
    });
  }
  next();
}

async function post(request, response, next) {
  const tableInfo = request.body.data;
  const postedTable = await service.post(tableInfo);
  response.status(201).json({ data: postedTable });
}

async function getAllTables(request, response, next) {
  const data = await service.getAll();
  const copy = data.slice();
  const sortedTable = copy.sort(function (a, b) {
    if (a.table_name < b.table_name) {
      return -1;
    }
    if (a.table_name > b.table_name) {
      return 1;
    }
    return 0;
  });
  response.json({ data: sortedTable });
}

function checkIfDataExists(request, response, next) {
  const data = request.body.data;
  if (data) {
    next();
  } else {
    next({ status: 400, message: "Data is missing" });
  }
}

async function updateTableById(request, response, next) {
  const { table_id } = request.params;
  const { reservation_id } = request.body.data;
  const updatedTable = await service.put(table_id, reservation_id);
  const updatedReservation = await service.seatTable(reservation_id);
  response.status(200).json({ data: updatedTable });
}

async function checkCurrentStatus(request, response, next) {
  const { reservation_id } = request.body.data;
  const reservation = await service.getReservationById(reservation_id);
  if (reservation.status === "seated") {
    next({
      status: 400,
      message: `reservation is already seated`,
    });
  } else {
    next();
  }
}

async function checkIfReservationIdExists(request, response, next) {
  const { reservation_id } = request.body.data;

  const reservation = await service.getReservationById(reservation_id);

  if (reservation) {
    next();
  } else {
    next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }
}

async function checkIfTableIdExists(request, response, next) {
  const { table_id } = request.params;

  const table = await service.get(table_id);

  if (table) {
    next();
  } else {
    next({
      status: 404,
      message: `table_id ${table_id} does not exist`,
    });
  }
}

async function checkTableCapacity(request, response, next) {
  const { table_id } = request.params;
  const { reservation_id } = request.body.data;

  const table = await service.get(table_id);
  const reservation = await service.getReservationById(reservation_id);
  if (table.capacity < reservation.people) {
    next({
      status: 400,
      message: `table capacity is too small for reservation`,
    });
  } else {
    next();
  }
}

async function checkIfTableIsOccupied(request, response, next) {
  const { table_id } = request.params;
  const table = await service.get(table_id);
  if (table.reservation_id) {
    next({
      status: 400,
      message: `table is occupied`,
    });
  } else {
    next();
  }
}

async function checkIfTableIsNotOccupied(request, response, next) {
  const { table_id } = request.params;
  const table = await service.get(table_id);
  response.locals.table = table;
  if (!table.reservation_id) {
    next({
      status: 400,
      message: `table is not occupied`,
    });
  } else {
    next();
  }
}

async function deleteReservationId(request, response, next) {
  const { table_id } = request.params;

  const deletedTable = await service.delete(table_id);
  await service.finishTable(response.locals.table.reservation_id);
  response.status(200).json({ data: deletedTable });
}

module.exports = {
  post: [
    hasProperties("table_name", "capacity"),
    checkTableDataParameters,
    asyncErrorBoundary(post),
  ],
  get: [asyncErrorBoundary(getAllTables)],
  put: [
    checkIfDataExists,
    hasProperties("reservation_id"),
    asyncErrorBoundary(checkIfReservationIdExists),
    asyncErrorBoundary(checkTableCapacity),
    asyncErrorBoundary(checkIfTableIsOccupied),
    asyncErrorBoundary(checkCurrentStatus),
    asyncErrorBoundary(updateTableById),
  ],
  delete: [
    asyncErrorBoundary(checkIfTableIdExists),
    asyncErrorBoundary(checkIfTableIsNotOccupied),
    asyncErrorBoundary(deleteReservationId),
  ],
};
