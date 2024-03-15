const SEARCH_RESULT = 'recipeResults'


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
    if ((queryItem.val().length === 0) || (queryLocation.val().length === 0)){
        openModal();
    } else {
        $(".recipe-display").children().remove();
        $(".restaurant-display").children().remove();
        showRecipeResults(queryItem.val());
    }
}

// Close the modal when user clicks close
modalCloseButton.on("click", function() {
    $("#emptyinput").removeAttr("class");
    $("#emptyinput").attr("class","modal");
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
                localStorage.setItem(SEARCH_RESULT, JSON.stringify(data))
                RecipecardGenerator(data, searchQuery);
               
            
                
            

            // Scroll user to results
        });
}

// THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
// THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
function RecipecardGenerator(data, searchQuery) {

     for (i = 0; i < 4; i++) {
                recipeId = data.hits[i].recipe.uri.split("_")[1];
                var title = data.hits[i].recipe.label;         //<---- RECIPE NAME SOURCE
                var subtitle = data.hits[i].recipe.cuisineType[0];      //<----------------RECIPE CUISINE TYPE SOURCE
                var imageSource = data.hits[i].recipe.images.SMALL.url;   //<-------- RECIPE IMAGE SOURCE
                var mealTypeData = data.hits[i].recipe.mealType;
                var calorieData = Math.round(data.hits[i].recipe.calories);


    var resultColumn = $("<div>").addClass("col-12 result-display m-0 p-2");
    var resultCard = $("<div>").addClass("card result-card");

    var cardBody = $("<div>").addClass("card-body p-0");

    var row = $("<div>").addClass("row g-0");

    var cardImageColumn = $("<div>").addClass("col-md-4");
    var cardImage = $("<img>").attr("src", imageSource).addClass("img-fluid card-image");
    cardImageColumn.append(cardImage);

    var cardContentColumn = $("<div>").addClass("col-md-8 card-content ");
  

    var cardTitle = $("<h5>").addClass("card-title d-flex justify-content-between");
    cardTitle.text(title);

    let icon = createBookmark(title,recipeId, "recipe");
    cardTitle.append(icon);

    var cardSub = $("<h5>").addClass("subtitle");
    cardSub.html("<b>Cuisine type: </b>" + subtitle);

    var recipeBox = $("<div>").addClass("");
    recipeBox.append("<p>Good for:" + mealTypeData + "</p>");
    recipeBox.append("<p>" + calorieData + " calories</p>");
    recipeBox.append('<a href="./recipe-details.html?=' + recipeId + '"> Details</a>').addClass('list-group-item');

    cardContentColumn.append(cardTitle, cardSub, recipeBox);
 

    cardContentColumn.append( cardBody);
    row.append(cardImageColumn ,cardContentColumn);
    resultCard.append(row);
    resultColumn.append(resultCard);
    
    
    $(".recipe-display").append(resultColumn);
}
$(".recipe-display").append('<div> <p class="text-centered"><a href="./see-more-recipes.html?q=' + searchQuery +'">See more recipes</a></p></div>');

}

function openModal(){
    document.getElementById("emptyinput").setAttribute("class", "modal is-active");
};


function getLocalStorage(){
    var data = JSON.parse(localStorage.getItem(SEARCH_RESULT))
    RecipecardGenerator(data);
}

getLocalStorage()