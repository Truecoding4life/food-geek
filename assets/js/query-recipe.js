const SEARCH_RESULT = "recipeResults";

var queryItem = $("#query-item");
var queryLocation = $("#query-location");
var buttonSearch = $("#button-search");
var modalCloseButton = $("#modal-close");

$(function () {
  buttonSearch.on("click", searchClick);
  loadBookmarks();
});

function searchClick(event) {
  event.stopPropagation();
  event.preventDefault();
  if (queryItem.val().length === 0 || queryLocation.val().length === 0) {
    openModal();
  } else {
    $(".recipe-display").children().remove();
    $(".restaurant-display").children().remove();
    showRecipeResults(queryItem.val());
  }
}

// Close the modal when user clicks close
modalCloseButton.on("click", function () {
  $("#emptyinput").removeAttr("class");
  $("#emptyinput").attr("class", "modal");
});

/// Base API request to get recipe data
let result = {};
function showRecipeResults(searchQuery) {
  var requestURL =
    "https://api.edamam.com/api/recipes/v2?type=public&q=" +
    searchQuery +
    "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";

  fetch(requestURL)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      // ALL WE HAVE TO DO IS INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
      localStorage.setItem(SEARCH_RESULT, JSON.stringify(data));
      RecipecardGenerator(data, searchQuery);

      // Scroll user to results
    });
}

// THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
// THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL

function openModal() {
  document
    .getElementById("emptyinput")
    .setAttribute("class", "modal is-active");
}

function getLocalStorage() {
  var data = JSON.parse(localStorage.getItem(SEARCH_RESULT));
  RecipecardGenerator(data);
}

getLocalStorage();
