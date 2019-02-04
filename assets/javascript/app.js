/*This is just here so the file commits */
$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAeKZa2lORj7w6nWlrbmgyA9rWZ2hZqwoc",
        authDomain: "train-schedule-dbe3c.firebaseapp.com",
        databaseURL: "https://train-schedule-dbe3c.firebaseio.com",
        projectId: "train-schedule-dbe3c",
        storageBucket: "train-schedule-dbe3c.appspot.com",
        messagingSenderId: "245070737341"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    //button click event
    $("#the-button").on("click", function(event){

        event.preventDefault();

        //grabs input values
        var $trainName = $("#train-name-input").val().trim();
        var $destination = $("#destination-input").val().trim();
        var $firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
        var $frequency = $("#frequency-input").val().trim();

        //verifies all inputs are filled out

        if ($trainName === "" ||
            $destination === "" ||
            $firstTrain === "" ||
            $frequency === "") {

            alert("Please fill in all details to add new train");

        } else {

        //creates local copy of train data
        var newTrain = {
            name: $trainName,
            destination: $destination,
            trainTime: $firstTrain,
            frequency: $frequency
            };

        //pushes new train to firebase database
        database.ref().push(newTrain);

        // clears input boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

        };

    //button event closing bracket
    });

    //creates firebase event when child is added to database.
    database.ref().on("child_added", function(childSnapshot) {

        //collects firebase info in variables
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().trainTime;
        var frequency = childSnapshot.val().frequency;
    
        //convert difference between now and first train to minutes
        var timeUntil = moment().diff(moment.unix(trainTime), "minutes");
        //time apart remainder
        var timeRemain = timeUntil % frequency;
        //calculates minutes until next train
        var untilArrival = frequency - timeRemain;
        //next train
        var nextTrainTime = moment().add(untilArrival, "m").format("hh:mm A");
        // adds the intital train time in readable format
        var firstTrainFormatted = moment(moment.unix(trainTime), "hh:mm A").format("hh:mm A");

        //creates new road. appends to page
        var newTrain = $("<tr>").append (
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTrainFormatted),
            $("<td>").text(frequency),
            $("<td>").text(nextTrainTime),
            $("<td>").text(untilArrival),
            
        );

        $("#train-table > tbody").append(newTrain);

    //firebase event closing bracket
    });





//final closing bracket
});

