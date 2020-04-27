const request = require("request");

const geocode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoicmFodWxtcGF0aGFrMSIsImEiOiJjazduaWZiZHIwYzR4M2xxcG95NXhoMGRwIn0.llRTqcUEyygMVm9INU3KKg&limit=1";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location. Try another search!", undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

const geocodeLocation = (latitude, longitude, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    longitude
  )},${encodeURIComponent(
    latitude
  )}.json?access_token=pk.eyJ1IjoiaGF5YTExMSIsImEiOiJjazRoZXgya3YxNW51M25vMmJnOWlrcmo3In0.Fs5cVFjT6TOUwdlhAZyWaA&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.features.length === 0) {
      callback(
        { error: "Unable to find location. Try another search." },
        undefined
      );
    } else {
      callback(undefined, {
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = { geocode, geocodeLocation };
