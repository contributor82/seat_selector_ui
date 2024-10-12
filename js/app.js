const movieContainer = document.querySelector(".movie-container");
const $seatContainer = $("#seatContainer");
const div = document.querySelector("div");
const $selectMovie = $("#selectMovie");
const selectedSeats = div.getElementsByClassName(DIV_CLASS_NAMES_FOR_SEATS.SEAT_SELECTED);
var selectedSeatsCount = 0;
document.getElementById("seatCount").innerHTML = selectedSeatsCount;
var movie_seats = [];
// loading movies list from movies csv file.
// loading seats
loadMoviesAndSeats = () => {

    $.ajax({
        url: API_URL.GET_MOVIES,
        type: API_METHOD.GET,
        dataType: API_RESPONSE_DATA_TYPE.JSON,
        success: (movies_seats) => {
            for (var i = 0; i < movies_seats.movies.length; i++) {
                $selectMovie.append("<option value = '" + movies_seats.movies[i].movie_id + "' >" + movies_seats.movies[i].movie_name + "</option>");
            }
            movie_seats = movies_seats.seats;
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
        for (var counter = 0; counter < 2; counter++) {
            $seatContainer.append("<div class='seats-row' id='seatRow" + counter + "'></div>");
        }

        var selectedMovieSeats = []
        for (var i = 0; i < movie_seats.length; i++) {
            if (movie_seats[i].movie_id == $selectMovie.val()) {
                selectedMovieSeats.push(movie_seats[i]);
            }
        }

        const seatsRowsCreated = document.getElementsByClassName("seats-row");
        var seat_index = 0;
        for (var index = 0; index < seatsRowsCreated.length; index++) {
            var $seatRow = document.getElementById(seatsRowsCreated[index].id);
            var seatCounter = 0;
            while (seatCounter < 10) {

                var div = document.createElement('div');
                div.id = selectedMovieSeats[seat_index].seat_id;
                if (selectedMovieSeats[seat_index].seat_status == SEAT_STATUS.AVAILABLE)
                    div.className = DIV_CLASS_NAMES_FOR_SEATS.SEAT;
                else if (selectedMovieSeats[seat_index].seat_status == SEAT_STATUS.BOOKED)
                    div.className = DIV_CLASS_NAMES_FOR_SEATS.SEAT_BOOKED;

                $seatRow.appendChild(div);
                seatCounter++;
                seat_index++;
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
    else if (e.target.className == DIV_CLASS_NAMES_FOR_SEATS.SEAT_SELECTED) {
        selectedSeatsCount++;
    }
    document.getElementById("seatCount").innerHTML = selectedSeatsCount;
}

// Event listener for Movie container elements
movieContainer.addEventListener("click", (e) => {
    if ($selectMovie.val() != "" &&
        e.target.classList.contains("seat") &&
        !e.target.classList.contains(SEAT_STATUS.BOOKED)
    ) {
        e.target.classList.toggle(SEAT_STATUS.SELECTED);
        updateSelectedSeatsCount(e);
    }
});
