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
            for (i = 0; i < 4; i++) {
                console.log(data.hits[i].recipe.images)
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                var recipeTitle = data.hits[i].recipe.label;         //<---- RECIPE NAME SOURCE
                var extractCuiseType = data.hits[i].recipe.cuisineType;
                crusinetype = extractCuiseType[0];      //<----------------RECIPE CUISINE TYPE SOURCE
                var imageSouce = data.hits[i].recipe.images.SMALL.url;   //<-------- RECIPE IMAGE SOURCE
                var mealTypeData = data.hits[i].recipe.mealType;
                var calorieData = Math.round(data.hits[i].recipe.calories);
                // ALL WE HAVE TO DO IS INSERT INTO THE CARD GENERATOR FUNCTION VALUES RETURNED FROM API
                RecipecardGenerator(recipeTitle, crusinetype, imageSouce,recipeId, mealTypeData, calorieData);
            }

            if (data.hits.length > 0) {
                $(".recipe-display").append('<div> <p class = "is-size-2 mb-3 text-centered"><a href = "./see-more-recipes.html?q=' + searchQuery +'">See more recipes <p></div>');
            }

            // Scroll user to results
            document.getElementById("results-columns").scrollIntoView({ behavior: "smooth" });
        });
}

// THIS FUNCTION WILL GENERATE ELEMENT ON THE PAGE WE JUST NEED TO NEST THE INFO WE NEED INSIDE
// THIS FUNCTION WILL TAKE IN TITLE, CARD TEXT CONTENT AND IMAGE URL
function RecipecardGenerator(title, subtitle, imagehtml, recipeId, mealTypeData, calorieData) {
    var resultColumn = $("<div>").addClass("col-12 result-display m-0 p-2");
    var resultCard = $("<div>").addClass("card result-card");

    var cardBody = $("<div>").addClass("card-body p-0");

    var row = $("<div>").addClass("row g-0");

    var cardImageColumn = $("<div>").addClass("col-md-4");
    var cardImage = $("<img>").attr("src", imagehtml).addClass("img-fluid card-image");
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

function openModal(){
    document.getElementById("emptyinput").setAttribute("class", "modal is-active");
};
