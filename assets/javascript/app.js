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
});