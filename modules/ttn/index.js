const { data, application } = require("ttn");
const config = require("../../config");

const ttn = config.ttn;

/*
const appID = "lab-tsti2d-projet-bornecovid-1";
const accessKey = "ttn-account-v2.24RUwmUmxFUbNrD4p2T_nP7g6W-b8Mpah0BPGzICTnY";
*/
// discover handler and open mqtt connection
data(ttn.appID, ttn.accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID);
      console.log(payload.payload_raw.toString("ascii"));
    });
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });

// discover handler and open application manager client
application(ttn.appID, ttn.accessKey)
  .then(function (client) {
    return client.get();
  })
  .then(function (app) {
    console.log("Got app", app);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
