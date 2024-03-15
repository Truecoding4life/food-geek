const SEARCH_RESULTS = "restaurantResults";
const RESULTS_PHOTO_URL = "photo_url";
const RESULTS_IS_OPEN = "is_open";
const RESULTS_NO_HOURS = "No hours listed"

$(function() {
    let results = loadFromStorage(SEARCH_RESULTS)
    displayResults(results);
})

function loadFromStorage(key) {
    var storage = JSON.parse(localStorage.getItem(key))

    if (storage) {
        return storage
    } else {
        console.log("Nothing found for", key)
    }
}


function displayResults(results) {
    let searchInfo = results.pop();
    let keyword = searchInfo.keyword;
    let city = searchInfo.city;
    let radius = searchInfo.radius;

    let pageH1 = $("h1")
    pageH1.text("Showing " + results.length + " restaurants results for: " + keyword)

    let pageH2 = $("<h2>");
    pageH2.addClass("title is-3 has-text-primary has-text-centered")
    pageH2.text("within " + radius + " mi in " + city)
    pageH2.insertAfter(pageH1);

    let cardContainer = $("#container-cards");
    let cardDiv = $("<div>");
    cardDiv.addClass("columns p-2 m-0");

    for (let i = 0; i < results.length; i++) {
        let info = results[i];
        let name = info.name;
        let isOpen = buildIsOpen(info.is_open);
        let priceLevel = buildPriceLevelStr(info.price_level);
        let rating = info.rating;
        let ratingsCount = info.user_ratings_total;
        let photo = info[RESULTS_PHOTO_URL];

        let card = $("<div>");
        card.addClass("card col-4  mx-3 mt-3")


      

        let cardTitle = $("<h3>");
        cardTitle.addClass("card-title title");
        cardTitle.text(name)
      
      
        let icon = createBookmark(name, results[i].place_id, "restaurant");
        icon.addClass("more-icon");
        cardTitle.append(icon);



        var cardImage = $("<img>").attr("src", photo).addClass("card-img-top");
       

     

     
        let cardContent = $("<div>").addClass('card-body');
        cardContent.addClass("is-size-4");

        let isOpenEl = $("<p>");
        isOpenEl.html(isOpen)

        let ratingEl = $("<p>");
        ratingEl.html(`<strong>${rating}</strong> /5 (${ratingsCount} reviews)`)

        let priceLevelEl = $("<p>");
        priceLevelEl.html(priceLevel);

        let detailsLink = $("<p>");
        detailsLink.html('<a href = "./restaurant-details.html?=' + results[i].place_id + '">Details</a>');

        cardContent.append(isOpenEl, priceLevelEl, ratingEl, detailsLink);
        card.append(cardImage, cardTitle, cardContent);
        cardDiv.append(card);
    }

    cardContainer.append(cardDiv)

}

/**
 * Determines if a place's hours is listed or not, if so then say if place is open or closed.
 * @param {String} isOpen 
 * @returns String if restaurant is open, closed, or has no hours listed
 */
function buildIsOpen(isOpen) {
    if (isOpen === RESULTS_NO_HOURS) {
        return RESULTS_NO_HOURS;
    }

    if (isOpen) {
        return "is <strong>Open</strong>";
    } else {
        return  "is <strong>Closed</strong>";
    }
}

function buildPriceLevelStr(priceLevel) {
    switch (priceLevel) {
        case 0:
            return "Free"
        
        case 1:
            return "<strong>$ </strong>"
        
        case 2:
            return "<strong>$ $</strong>"
    
        case 3:
            return "<strong>$ $ $</strong>"

        case 4:
            return "<strong>$ $ $ $</strong>"
        
        default:
            return "<strong>$ $</strong>"
    }
}

loadBookmarks();
