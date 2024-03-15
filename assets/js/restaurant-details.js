var queryResult;
var SAVE_FAVORITE = "Save to favorite";
var saved = $("<i>");

$(document).ready(function () {
  queryResult = document.location.search.split("=")[1];
  if (queryResult) {
    initPlaces();
    getPlaceDetails(queryResult);
    loadBookmarks();
  } else {
    // If no result, go back to main page
    document.location.replace("./index.html");
  }
});

function getPlaceDetails(restId) {
  var request = {
    placeId: restId,
    fields: [
      "name",
      "rating",
      "formatted_phone_number",
      "geometry",
      "formatted_address",
      "photos",
      "url",
      "opening_hours",
      "review",
    ],
  };

  // console.log("gPlaces", gPlaces);
  gPlaces.getDetails(request, callback);

  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // console.log("place: ", place);
      let image = $("#image");
      image.attr(
        "src",
        place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 })
      );

      let name = $("#title");
      let title = $("<h2>");
      title.addClass("title");
      title.text(place.name);

      let icon = createBookmark(place.name, queryResult, "restaurant");
      icon.addClass("details-icon icon-need-fix");
      if (filterBookmarks(queryResult) >= 0) {
        SAVE_FAVORITE = "favorite";
      }
      icon.html("<span class='save-reminder'> " + SAVE_FAVORITE + " </span>");
      name.append(title);

      let info = $("#info");
      let formatted_address = place.formatted_address.split(" ");
      formatted_address[5] = formatted_address[5].split(",")[0];
      // console.log("Address: ", formatted_address);

      information =
        " <span class='bolder'> Address: </span> <br>" +
        formatted_address[0] +
        " " +
        formatted_address[1] +
        " " +
        formatted_address[2] +
        "<br>     " +
        formatted_address[3] +
        " " +
        formatted_address[4] +
        " " +
        formatted_address[5] +
        "<br><br> <span class='bolder'>Phone: </span> <br>" +
        place.formatted_phone_number +
        "<br><br> <span class='bolder'>Hours: </span> <br>";
      let weekdays = place.opening_hours.weekday_text;

      for (let x = 0; x < weekdays.length; x++) {
        information += weekdays[x] + "<br>";
      }
      info.html(information);

      let restaurantDetail = $("#restaurant-detail");
      restaurantDetail.prepend(icon);
      
      let header = $('<h3>')
      header.html('Restaurant Details')

      info.prepend(header)

      let website = $("#website");
      let anchor = $("<a>");
      anchor.attr({ href: place.url });
      anchor.text("Find it on Google Maps");
      website.append(anchor);

      var reviews = $("#reviews");
      for (let x = 0; x < place.reviews.length; x++) {
        let reviewBox = $("<div>");
        reviewBox.addClass(" row custom-card p-3 ");

        let authorBox = $("<div>");
        authorBox.addClass("d-inline-flex");
        let authorName = $("<h5>");
        authorName.addClass("card-text-detail-name");
        authorName.text(place.reviews[x].author_name);

        let authorImg = $("<div>");
        authorImg.addClass(
          "col-4 col-sm-2 col-lg-3 col-xl-1 p-3 card-detail-image text-center"
        );
        let image = $("<img>");
        image.attr("src", place.reviews[x].profile_photo_url);
        image.addClass("img-fluid ");
        authorImg.append(image);
        authorImg.append(authorName);
        authorBox.append(authorImg);

        let authorRating = $("<p>");
        authorRating.text("rate:  " + place.reviews[x].rating + "/5");

        let authorText = $("<div>");
        authorText.addClass(
          " my-0 p-4 review-text col-8 col-sm-10 col-lg-10 col-xl-11 card-text-detail-text"
        );
        let text = place.reviews[x].text;
        authorText.append(`<p> ${text} </p>`);
        authorText.append(authorRating);

        authorBox.append(authorText);
        reviewBox.append(authorBox);
        reviewBox.addClass("my-2");
        reviews.append(reviewBox);
      }
    }
  }
}

function findRestaurant(restId) {
  var restaurants = JSON.parse(localStorage.getItem("restaurantResults"));
  for (var x = 0; x < restaurants.length; x++) {
    if (restaurants[x].place_id === restId) {
      return x;
    }
  }
}

function initPlaces() {
  // Init map for PlacesServices to work
  infowindow = new google.maps.InfoWindow();
  let map = new google.maps.Map(document.getElementById("map"), {});
  gPlaces = new google.maps.places.PlacesService(map);
}
