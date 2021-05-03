require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");
const { request } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("person", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "94984-1566-165",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "424-24-234",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "24-24-234-24",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hellooo World!</h1>");
});

app.get("/info", (request, response) => {
  let date = Date();
  response.send(`
  <p>Phonebook has info for ${persons.length} people.</p>
  <p>${date}</p>
  `);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const genId = () => {
  const id = Math.floor(Math.random() * 1000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  /* let duplicateName = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );
  if (duplicateName) {
    return response.status(400).json({
      error: "Name alrady exist in the phonebook",
    });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;

  Person.findByIdAndUpdate(request.params.id, body)
    .then((result) => {
      response.status(200).end();
    })
    .catch((error) => next(error));
});

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
