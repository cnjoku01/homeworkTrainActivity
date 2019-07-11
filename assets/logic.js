var firebaseConfig = {
    apiKey: "AIzaSyDleF2PUS5DXsYImqTztB6oCsIJH8OVP6s",
    authDomain: "traintracker-2e11c.firebaseapp.com",
    databaseURL: "https://traintracker-2e11c.firebaseio.com",
    projectId: "traintracker-2e11c",
    storageBucket: "",
    messagingSenderId: "1014084276407",
    appId: "1:1014084276407:web:696b69a3a8ec552f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0

function currentTime() {
  var current = moment().format('LT');
  $("#currentTime").html(current);
  setTimeout(currentTime, 1000);
};


// 2. Button for adding Employees
$("#run-search").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var  destination = $("#destination").val().trim();
  var  startTime = $("#first-train").val().trim();
  var frequency = $("#frequency").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    startTime: startTime,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref("/peeps").push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.startTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref("/peeps").on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  console.log(startTimeConverted)
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  nextTrain = moment().format("hh:mm");

  trainName = childSnapshot.val().trainName;
  destination = childSnapshot.val().destination;
  startTime = childSnapshot.val().startTime;
  frequency = childSnapshot.val().frequency;

  var key = childSnapshot.key;

  // Employee Info
  console.log(trainName);
  console.log(destination);
  console.log(startTime);
  console.log(frequency);


  //Create the new row
  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));



  // // Append the new row to the table
  $("#train-table > tbody").append(newrow);

  // $("#train-table").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextTrain +  "</td><td>" + minToArrival + "</td></tr>");
});
