
// Constants
const apiURL = "https://fe08-films.herokuapp.com";
const authEndpoint = "/auth";
const filmEndpoint = "/films";
let myFilmList = [];
let myFavoriteFilms = [];

// Strings
const ratingTitleText = "Рейтинг";
const releaseDateTitleText = "Дата релиза";
const directorTitleText = "Режисер";
const budgetTitleText = "Бюджет";
const plotTitleText = "Сюжет";

// Tag Names
const div = "div";
const h2 = "h2";
const p = "p";
const button = "button";
const img = "img";

// ID of Elements
const filmCardId = "filmCardContainer";

// Classes of Elements
const filmContainer = "film-list";
const filmCardClass = "card";
const imageContainerClass = "card__header card-header";
const imageClass = "card-header__image";
const cardTitleClass = "card-header__title";
const cardBodyClass = "card__body";
const ratingBoxClass = "film-info film-info__rating";
const bodyTitleClass = "film-info__title";
const bodyTextClass = "film-info__text";
const directorBoxClass = "film-info film-info__director";
const releaseDateBoxClass = "film-info film-info__release-date";
const budgetBoxClass = "film-info film-info__box-office";
const plotBoxClass = "film-info film-info__plot";
const cardFooterClass = "card__footer";
const footerButtonClass = "card__button button button__icon button_add";
const buttonImageClass = "button__icon-svg svg-inline--fa fa-plus fa-w-14";

function createElement(elementClass, tagName, elementContext, idElement) {
    let element = document.createElement(`${tagName}`);
    element.id = idElement;
    element.className = `${elementClass}`
    element.textContent = `${elementContext}`;
    return element
}

function createImage(imageClass, imageSrc) {
    let image = document.createElement(img);
    image.className = `${imageClass}`
    image.height = 390;
    image.width = 265;
    image.src = `${imageSrc}`;
    return image
}

function createCardImage(source) {
    let cardImageContainer= createElement(imageContainerClass, div, "", "");
    cardImageContainer.append(createImage(imageClass, source));
    return cardImageContainer
}

function createFooterButton() {
    let footerButtonTemplate = document.getElementById("footerButton");
    return footerButtonTemplate.content.cloneNode(true)
}

function createContainer(classes) {
    let container = createElement(classes, div, "", "")
    return container
}

function createCardElement(elClass, tag, source) {
    let element = createElement(elClass, tag, source, "");
    return element
}

function createBodyTitle(context) {
    let title = createElement(bodyTitleClass, p, context, "");
    return title
}

function createBodyText(context) {
    let text = createElement(bodyTextClass, p, context, "");
    return text
}

function getRating(textValue) {
    let ratingBox = createContainer(ratingBoxClass);
    ratingBox.append(createBodyTitle(ratingTitleText));
    ratingBox.append(createBodyText(textValue));
    return ratingBox
}

function getReleaseDate(textValue) {
    let releaseDateBox = createContainer(releaseDateBoxClass);
    releaseDateBox.append(createBodyTitle(releaseDateTitleText));
    releaseDateBox.append(createBodyText(textValue));
    return releaseDateBox
}

function getDirector(textValue) {
    let directorBox = createContainer(directorBoxClass);
    directorBox.append(createBodyTitle(directorTitleText));
    directorBox.append(createBodyText(textValue));
    return directorBox
}

function getBudget(textValue) {
    let budgetBox = createContainer(budgetBoxClass);
    budgetBox.append(createBodyTitle(budgetTitleText));
    if (textValue === "N/A") {
        budgetBox.append(createBodyText(0));
    } else {
        budgetBox.append(createBodyText(textValue));
    }
    return budgetBox
}

function getPlot(textValue) {
    let plotBox = createContainer(plotBoxClass);
    plotBox.append(createBodyTitle(plotTitleText));
    plotBox.append(createBodyText(textValue));
    return plotBox
}

function getFooter() {
    let cardFooter = createContainer(cardFooterClass);
    cardFooter.append(createFooterButton());
    return cardFooter
}

function auth() {
    return fetch(`${apiURL}${authEndpoint}`, {
        method: "POST",
    }).then((response) => response.json()).then(data => {
        let tk = Object.values(data);
        const myToken = `Beare ${tk[0]}`;
        getFilmList(myToken);
    });
}

function getFilmList(token) {
    return fetch(`${apiURL}${filmEndpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Autorization: `${token}`,
        },
    }).then((response) => response.json()).then(data => {
        let filmList = data["films"];
        myFilmList = filmList
        showFilmList(myFilmList);
    });
}

function removeAll() {
    document.querySelectorAll(".card").forEach(e => e.remove());
}

function showFilmList(filmsArray) {
    for (let i = 0; i < filmsArray.length; i++) {
        let poster = filmsArray[i].Poster;
        let filmTitle = filmsArray[i].Title;
        let rating = filmsArray[i].imdbRating;
        let release = filmsArray[i].Released;
        let director = filmsArray[i].Director;
        let budget = filmsArray[i].BoxOffice;
        let plot = filmsArray[i].Plot;

        // Card
        let filmCardContainer = createElement(filmCardClass, div, "", "");
        filmCardContainer.append(createCardImage(poster));
        filmCardContainer.append(createCardElement(cardTitleClass, h2, filmTitle));

        // Card Body
        let cardBody = createContainer(cardBodyClass);
        cardBody.append(getRating(rating));
        cardBody.append(getReleaseDate(release));
        cardBody.append(getDirector(director));
        cardBody.append(getBudget(budget));
        cardBody.append( getPlot(plot));

        filmCardContainer.append(cardBody);
        filmCardContainer.append(getFooter());
        document.getElementById("filmList").append(filmCardContainer);
    }
}

auth()

const checkFavorite = document.getElementById("favorite");
checkFavorite.addEventListener("change", function(e) {
    if (this.checked) {
        console.log(myFilmList);
        removeAll();
        showFilmList(myFavoriteFilms);
        console.log("i am checked");
    } else {
        removeAll();
        showFilmList(myFilmList);
        console.log("i am not checked");
    }
});

document.body.addEventListener("click", handleFavorite);
function handleFavorite(event) {
    const addFavorite = event.target.closest(".button_add");
    const removeFavorite = event.target.closest(".button_remove");
    const card = event.target.closest(".card");

    const rating = event.target.closest(".ra")

    if (addFavorite) {
        addFavorite.classList.remove('button_add');
        addFavorite.classList.add('button_remove');
        myFavoriteFilms.push(card)
        console.log("addFavorite");
        console.log(myFavoriteFilms);
    }

    if (removeFavorite) {
        removeFavorite.classList.remove('button_remove');
        removeFavorite.classList.add('button_add');
        myFavoriteFilms = myFavoriteFilms.filter(item => item !== card);
        console.log("removeFavorite");
        console.log(myFavoriteFilms);
    }
};

const ratingButton = document.getElementById("rating");
const releaseDateButton = document.getElementById("releaseDate");
const boxOfficeButton = document.getElementById("boxOffice");
ratingButton.addEventListener("click", sortedByRating);
releaseDateButton.addEventListener("click", sortedByReleaseDate);
boxOfficeButton.addEventListener("click", sortedByBoxOffice);

function sortedByField(field) {
    return (a, b) => a[field] < b[field] ? 1 : -1;
}

function sortedByRating() {
    removeAll();
    let newArray = myFilmList.sort(sortedByField("imdbRating"));
    showFilmList(newArray);
    console.log("Click sortedByRating");
}

function sortedByReleaseDate() {
    removeAll();
    let newArray = myFilmList.sort(sortedByField("Released"));
    showFilmList(newArray);
    console.log("Click sortedByReleaseDate");
}

function sortedByBoxOffice() {
    removeAll();
    let newArray = myFilmList.sort(sortedByField("BoxOffice"));
    showFilmList(newArray);
    console.log("Click sortedByBoxOffice");
}