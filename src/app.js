const express = require("express");
const path = require("path");
const hbs = require("hbs");
const { geocode, geocodeLocation } = require("./utils/geocode");
const forecast = require("./utils/forecast");
const port = process.env.PORT || 3000;

const app = express();

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
//set up handlebars and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
//set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    helpText: "You really need help with such a simple interface!??",
    name: "Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/weatherFromCurrentLocation", (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  if (!latitude && !longitude) {
    return res.send({
      error: "Something went wrong, refresh the page and try again",
    });
  }

  geocodeLocation(latitude, longitude, (error, { location }) => {
    if (error) {
      return res.send(error);
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send(error);
      }
      res.send({
        forecast: forecastData,
        location: location,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 help",
    name: "Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar",
    errorMessage: "Help article not found!",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar",
    errorMessage: "page not found!",
  });
});

app.listen(port, () => {
  console.log(`server id up and running on port ${port}`);
});
