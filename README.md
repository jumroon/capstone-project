# Restaurant Reservation System

---

<img width="1265" alt="Screenshot 2023-01-04 at 07 57 49" src="https://user-images.githubusercontent.com/4723539/210570808-5d179787-2974-47ae-916f-adb6d6d5f841.png"><img width="1102" alt="Screenshot 2023-01-04 at 07 58 11" src="https://user-images.githubusercontent.com/4723539/210570883-245980a4-7310-4da0-8da0-15e79b6c64e9.png">

Live site: https://capstone-project-frontend.onrender.com/dashboard

## Brief Explanation of the API

For the API, the user can create new reservations and tables. Table status is updated by adding and deleting reservationIds attached to a table, and reservation information can be updated and deleted. The tables data and reservations data for each day can be retrieved from the database by date. The API checks to see if the information that is entered is valid.

### Organization

The organization of this backend consists of service, controller, and router for tables and reservations. There are two routes: for tables and for reservations. Reservations includes making new reservations for restaurant guests, cancelling reservations, updating their information, and retrieving a list of reservations by date. The Tables API allows the user to create new tables, modify their information (i.e. name and capacity), and delete reservationIds from the table to free them up. The next section will go into greater detail about the API endpoints.

## API Endpoints

**RESERVATIONS**

-`GET /dashboard`: retrieve all reservations (and their info) by date, date defaults to "today", expects date as query parameter, `date=YYYY-MM-DD`

-`POST /reservations/new`: create a new reservation, expects data in the format
`data: {first_name: "<first-name>", last_name: "<last-name>", mobile_number: "<mobile-number>", reservation_date: "<YYYY-MM-DD>", reservation_time: "<HH:MM>"}`

-`GET /reservations/:reservation_id/seat` : display a selection the tables

-`PUT /reservations/:reservation_id/status`: update the status of the reservation. accepts data in the format:
`{data: {status: "<new-status>"}}` where `<new-status>` is one of booked, seated, or finished

-`GET /reservations?mobile_number=<mobile-number>`: will retrieve a reservation where the mobile number matches the parameters given, query string parameter, `mobile_number="<mobile-number>"`

-`PUT /reservations/:reservation_id/edit`: send a put request to the database so that the user can update details of the reservation, payload is the same as POST `data: {first_name: "<first-name>", last_name: "<last-name>", mobile_number: "<mobile-number>", reservation_date: "<YYYY-MM-DD>", reservation_time: "<HH:MM>"}`

**TABLES**

-`GET /dashboard`: retrieve all the tables and their statuses

-`POST /tables/new`: create a new table (inputs are table name and capacity of the table),
`"data": {"table_name": "<table-name>", "capacity": <table-capacity>}`

-`PUT /tables/:table_id/seat/`: update reservation Id for the table so that the table will be occupied,
`"data": {"reservation_id": "<reservation-id>"}`

-`DELETE /tables/:table_id/seat`: delete the reservation Id that is associated with a particular table, freeing up this table for new guests, `"table_id": "<table-id>"`

** NOTE **

-all APIS have features that check for required, non nullable fields and correct data type

---

## Summary

For the project, the user is able to create new reservations and tables as well as retrieve this information from the database. The application handles some errors and allows the user to be able to manage and see reservations at the restaurant in an efficient and error-resistant manner. This helps to ensure the organization of reservations and tables at a busy restaurant. The user is assumed to be restaurant staff who enter this information rather than customers themselves.

## Technologies & Tools

- React
- React hooks
- React router
- Node
- Postgres
- Express
- CSS
- Bootstrap4
- HTML
- JavaScript
- RESTful APIs

## Run Locally

- [ ] Fork & Clone the repostory
- [ ] Run `npm install`
- [ ] Run `npm run start:dev` to start in development, `npm run start ` to start
