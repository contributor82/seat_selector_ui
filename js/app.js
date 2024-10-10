const movieContainer = document.querySelector(".movie-container");
const $seatContainer = $("#seatContainer");
const div = document.querySelector("div");
const $selectMovie = $("#selectMovie");
const selectedSeats = div.getElementsByClassName("seat selected");
const divClasses = ["seat", "seat booked"];
var selectedSeatsCount = 0;

document.getElementById("seatCount").innerHTML = selectedSeatsCount;

// loading movies list from movies csv file.
// loading seats
loadMoviesAndSeats = () => {

    $.ajax({
        url: API_URL.GET_MOVIES,
        type: API_METHOD.GET,
        dataType: API_RESPONSE_DATA_TYPE.TEXT,
        success: (response) => {
            var movies_rows = response.split('\n');
            for (var i = 1; i < movies_rows.length - 1; i++) {
                var cols = movies_rows[i].split(',');
                $selectMovie.append("<option value = '" + cols[0] + "' >" + cols[1] + "</option>");
            }

            loadSeats();
        },
        error: (error) => {
            alert(ERROR_MESSAGES.LOADING_MOVIES_ERROR + error);
        }
    });
}

// loading movie seats
loadSeats = () => {

    if ($selectMovie.val() != "") {
        for (var counter = 0; counter < 3; counter++) {
            $seatContainer.append("<div class='seats-row' id='seatRow" + counter + "'></div>");
        }

        const seatsRowsCreated = document.getElementsByClassName("seats-row");
        for (var index = 0; index < seatsRowsCreated.length; index++) {
            for (var seats = 0; seats < 10; seats++) {
                var $seatRow = document.getElementById(seatsRowsCreated[index].id);
                var div = document.createElement('div');
                var random = Math.floor(Math.random() * divClasses.length);
                div.className = divClasses[random];
                $seatRow.appendChild(div);
            }
        }
    }
}

// clearing selected seats and loading again
clearSelectedSeats = (sel) => {

    $seatContainer.find('div').remove().end();
    document.getElementById("movieName").innerHTML = "";
    loadSeats();
    selectedSeatsCount = 0;
    if ($selectMovie.val() != "") {
        document.getElementById("movieName").innerHTML = "for " + sel.options[sel.selectedIndex].text;
    }
    document.getElementById("seatCount").innerHTML = selectedSeatsCount;

}

// Updating selected seats count
updateSelectedSeatsCount = (e) => {
    if (e.target.className == "seat") {
        selectedSeatsCount--;
    }
    else if (e.target.className == "seat selected") {
        selectedSeatsCount++;
    }
    document.getElementById("seatCount").innerHTML = selectedSeatsCount;
}

// Event listener for Movie container elements
movieContainer.addEventListener("click", (e) => {
    if ($selectMovie.val() != "" &&
        e.target.classList.contains("seat") &&
        !e.target.classList.contains("booked")
    ) {
        e.target.classList.toggle("selected");
        updateSelectedSeatsCount(e);
    }
});
