
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

function getSearchResults(searchQuery) {
    var requestURL = "https://api.edamam.com/api/recipes/v2?type=public&q="+ searchQuery + "&app_id=f77c7e0e&app_key=43e8d41a5b2ed56c8d6d782c1d900e3e";
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
    .then(function (data) {
        if (data.hits.length === 0) {
            $("#card-header-title").text("There is no recipe matching your query. Search another menu.")
        } else {
            $("h1").text("Showing " + data.hits.length + " recipe results for: " + searchQuery)

            let cardContainer = $("#container-cards");
            let cardDiv = $("<div>");
            cardDiv.addClass("columns p-2 m-0");

            for (i = 0; i < 20; i ++) {
                var name = data.hits[i].recipe.label;
                var cuisineType = data.hits[i].recipe.cuisineType;
                var mealTypeData = data.hits[i].recipe.mealType;
                var calorieData = Math.round(data.hits[i].recipe.calories);
                var recipeId = data.hits[i].recipe.uri.split("_")[1];
                var imageSouce = data.hits[i].recipe.images.SMALL.url; 

                let card = $("<div>");
                card.addClass("card")
                
                let cardHeader = $("<div>");
                cardHeader.addClass("card-header");
                
                let cardTitle = $("<h3>");
                cardTitle.addClass("card-header-title title my-0 is-3 is-centered");
                cardTitle.text(name)

                let icon = createBookmark(name, recipeId, "recipe");
                icon.addClass("more-icon");
                
                cardHeader.append(cardTitle);
                cardHeader.append(icon);
                let cardContent = $("<div>");
                cardContent.addClass("card-content is-size-4 mb-0");

                let cardImage = $("<div>");
                cardImage.addClass("card-image");

                let figure = $("<figure>");
                figure.addClass('image');
                figure.html('<img style="border-radius:5%" src = "'+ imageSouce + '">');
                cardImage.append(figure);

                let descriptions = $("<ul>");
                descriptions.addClass("content");
                
                let cuisine = $("<li>");
                cuisine.html("<b>Type</b>: " + cuisineType);

                let mealType = $("<li>");
                mealType.html("<b>Good for</b>: " + mealTypeData);

                let calorie = $("<li>");
                calorie.html(calorieData + " calories");

                let detailsLink = $("<li>");
                detailsLink.html('<a href = "./recipe-details.html?=' + recipeId +' "> Details ' + icon +'</a>');

                descriptions.append(cuisine,mealType,calorie,detailsLink)
                cardContent.append(descriptions);
                card.append(cardImage,cardHeader, cardContent);
                cardDiv.append(card);
            }
            cardContainer.append(cardDiv)
        };
    })
} 