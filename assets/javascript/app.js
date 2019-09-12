// The web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDMegyB5Wu9ZFv_puKsTK4w9ey4cL7T21I",
    authDomain: "train-scheduler-8778c.firebaseapp.com",
    databaseURL: "https://train-scheduler-8778c.firebaseio.com",
    projectId: "train-scheduler-8778c",
    storageBucket: "",
    messagingSenderId: "1095289439089",
    appId: "1:1095289439089:web:eda2bc89a85e15dd1decd0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Train information
var trainInfo = {
    name: "",
    destination: "",
    firstArrival: "",
    frequency: 0,
    nextArrival: "",
    minutesAway: 0
}

// Alows user to enter train information to store in firebase and add to table
$("#submit-button").on("click", function(event) {
    event.preventDefault();

    // Assign user inputs to train information
    trainInfo.name = $("#name-input").val().trim();
    trainInfo.destination = $("#destination-input").val().trim();
    trainInfo.firstArrival = $("#first-arrival-input").val().trim();
    trainInfo.frequency = $("#frequency-input").val().trim();

    // Calculate minutes away and next arrival
    var convertedTime = moment(trainInfo.firstArrival, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    console.log("The current time is " + moment(currentTime).format("hh:mm"));
    var timeDifference = moment().diff(moment(convertedTime), "minutes");
    var remainder = timeDifference % trainInfo.frequency;

    // Assign found values to train information
    trainInfo.minutesAway = trainInfo.frequency - remainder;
    trainInfo.nextArrival = moment().add(trainInfo.minutesAway, "minutes").format("hh:mm A");

    // Add information to firebase
    database.ref().push({
        trainInfo : trainInfo,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Retrieve firebase data to display on the page
database.ref().on("child_added", function(snapshot) {
    var firebaseData = snapshot.val();

    // Create a table row to display the train information
    var tableRow = $("<tr>");

    // Create table data to hold the train information
    var trainName = $("<td>");
    var trainDestination = $("<td>");
    var trainFrequency = $("<td>");
    var trainNextArrival = $("<td>");
    var trainMinutesAway = $("<td>");

    // Assign the train information to the respective table data
    trainName.text(firebaseData.trainInfo.name);
    trainDestination.text(firebaseData.trainInfo.destination);
    trainFrequency.text(firebaseData.trainInfo.frequency);
    trainNextArrival.text(firebaseData.trainInfo.nextArrival);
    trainMinutesAway.text(firebaseData.trainInfo.minutesAway);

    // Add the table data to the table row
    tableRow.append(trainName, trainDestination, trainFrequency, trainNextArrival, trainMinutesAway);

    // Add the row to the main table
    $("tbody").append(tableRow);

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});