
// module ---------------- HTML Creator -------------------------------------------------------------- //

// Strings
const ratingTitleText = "Рейтинг";
const releaseDateTitleText = "Дата релиза";
const directorTitleText = "Режисер";
const budgetTitleText = "Бюджет";
const plotTitleText = "Сюжет";

// ID of Elements
const filmListContainer = "filmList";

// Classes of Elements
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

// Tag Names
const div = "div";
const h2 = "h2";
const p = "p";
const button = "button";
const img = "img";

function addClass(element, add) {
    if (!element.classList.contains(add)) {
        element.classList.add(add);
    }
}

function removeClass(element, remove) {
    if(element.classList.contains(remove)) {
        element.classList.remove(remove);
    }
}

function createElement(elementClass, tagName, elementContext) {
    let element = document.createElement(`${tagName}`);
    element.className = `${elementClass}`;
    element.textContent = `${elementContext}`;
    return element
}

function createImage(imageClass, imageSrc) {
    let image = document.createElement(img);
    image.className = `${imageClass}`;
    image.height = 390;
    image.width = 265;
    image.src = `${imageSrc}`;
    return image
}

function createCardImage(source) {
    let cardImageContainer= createElement(imageContainerClass, div, "");
    cardImageContainer.append(createImage(imageClass, source));
    return cardImageContainer
}

function createFooterButton(favorite) {
    if (favorite === true) {
        let button = createElement("card__button button button__icon button_remove", "button", "");
        let svg = document.getElementById("svgImg");
        let svgClone = svg.content.cloneNode(true);
        button.appendChild(svgClone);
        return button
    }

    if (favorite === false) {
        let button = createElement("card__button button button__icon button_add", "button", "");
        let svg = document.getElementById("svgImg");
        let svgClone = svg.content.cloneNode(true);
        button.appendChild(svgClone);
        return button
    }
}

function createContainer(classes) {
    let container = createElement(classes, div, "");
    return container
}

function createCardElement(elClass, tag, source) {
    let element = createElement(elClass, tag, source);
    return element
}

function createBodyTitle(context) {
    let title = createElement(bodyTitleClass, p, context);
    return title
}

function createBodyText(context) {
    let text = createElement(bodyTextClass, p, context);
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

function getFooter(isFavorite) {
    let cardFooter = createContainer(cardFooterClass);
    cardFooter.append(createFooterButton(isFavorite));
    return cardFooter
}

function showFilmList(filmsArray, isFavoriteList) {
    for (let i = 0; i < filmsArray.length; i++) {
        let poster = filmsArray[i].Poster;
        let filmTitle = filmsArray[i].Title;
        let rating = filmsArray[i].imdbRating;
        let release = filmsArray[i].Released;
        let director = filmsArray[i].Director;
        let budget = filmsArray[i].BoxOffice;
        let plot = filmsArray[i].Plot;

        console.log(filmsArray)
        console.log(filmsArray[i].Favorite)

        if (!filmsArray[i].Favorite) {
            filmsArray[i].Favorite = false;
        }

        let isFavorite = filmsArray[i].Favorite;
        console.log(isFavorite)

        // Card
        let filmCardContainer = createElement(filmCardClass, div, "");
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
        filmCardContainer.append(getFooter(isFavorite));

        if (isFavoriteList === true) {
            if(isFavorite === true) {
                document.getElementById(filmListContainer).append(filmCardContainer);
            }
        } else {
            document.getElementById(filmListContainer).append(filmCardContainer);
        }
    }
}

// module ---------------- API Manager -------------------------------------------------------------- //

// Constants
const apiURL = "https://fe08-films.herokuapp.com";
const authEndpoint = "/auth";
const filmEndpoint = "/films";
let myFilmList = [];

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
        myFilmList = data["films"]
        localStorage.setItem("filmList", JSON.stringify(myFilmList));
        showFilmList(myFilmList);
    });
}

function startPoint() {
    let films = JSON.parse(localStorage.getItem("filmList"));

    if (films == []) {
        console.log(films)
        auth()
    } else {
        console.log(films)
        showFilmList(films);
    }
}

startPoint()

// module ---------------- Filters -------------------------------------------------------------- //

let isFavoriteList = false;
const ratingField = "imdbRating";
const checkButtonClass = "button_checked";
const addButtonClass = "button_add";
const removeButtonClass = "button_remove";

const searchField = document.querySelector('input');
const checkFavorite = document.getElementById("favorite");
const ratingButton = document.getElementById("rating");
const releaseDateButton = document.getElementById("releaseDate");
const boxOfficeButton = document.getElementById("boxOffice");

searchField.addEventListener("input", searchFilm);
checkFavorite.addEventListener("change", showFavorite);
ratingButton.addEventListener("click", sortedByRating);
releaseDateButton.addEventListener("click", sortedByReleaseDate);
boxOfficeButton.addEventListener("click", sortedByBoxOffice);
document.body.addEventListener("click", addFavorite);
searchField.value = "";
checkFavorite.checked = false;

function filterFilm2(array, query) {
    const match = (array, s) => {
        const p = Array.from(s).reduce((a, v, i) => `${a}[^${s.substr(i)}]*?${v}`, '');
        const re = RegExp(p);
        return array.filter(v => v.match(re));
    }

    const filterItems = (arr, query) => {
        return arr.filter(el => el.toString().toLowerCase().indexOf(query.toString().toLowerCase()) !== -1)
    }



    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        let filmTitle = array[i].Title
        if (filmTitle.search(query) !== -1) {
            newArray.push(array[i]);
            console.log(newArray)
        }
    }
    return newArray
}

function removeAll() {
    document.querySelectorAll(".card").forEach(e => e.remove());
}

function filterFilm(array, query) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        let filmTitle = array[i].Title
        if (filmTitle.indexOf(query) !== -1) {
            newArray.push(array[i]);
        }
    }
    return newArray
}

function searchFilm(event) {
    let array = filterFilm(myFilmList, event.target.value);
    removeAll();
    showFilmList(array);
}

function showFavorite() {
    if (this.checked) {
        removeAll();
        showFilmList(myFilmList, true);
        isFavoriteList = true;
    } else {
        removeAll();
        showFilmList(myFilmList, false);
        isFavoriteList = false;
    }
}

function addFavorite(event) {
    const addFavorite = event.target.closest(".button_add");
    const removeFavorite = event.target.closest(".button_remove");
    const card = event.target.closest(".card");
    let favoriteFilm = {};

    if (addFavorite) {
        removeClass(addFavorite, addButtonClass);
        addClass(addFavorite, removeButtonClass);
        favoriteFilm.Poster = card.children.item(0).children.item(0).getAttribute("src");
        favoriteFilm.Title = card.children.item(1).textContent;
        favoriteFilm.imdbRating = card.children.item(2).children.item(0).children.item(1).textContent;
        favoriteFilm.Released = card.children.item(2).children.item(1).children.item(1).textContent;
        favoriteFilm.Director = card.children.item(2).children.item(2).children.item(1).textContent;
        favoriteFilm.BoxOffice = card.children.item(2).children.item(3).children.item(1).textContent;
        favoriteFilm.Plot = card.children.item(2).children.item(4).children.item(1).textContent;
        favoriteFilm.Favorite = true;

        myFilmList = myFilmList.map(obj => {
            if (obj.Title === favoriteFilm.Title) {
                return favoriteFilm
            }
            return obj
        });
        console.log(myFilmList);
        localStorage.clear()
        localStorage.setItem("filmList", JSON.stringify(myFilmList));
        console.log("addFavorite");
    }

    if (removeFavorite) {
        removeClass(removeFavorite, removeButtonClass);
        addClass(removeFavorite, addButtonClass);
        myFilmList = myFilmList.map(obj => {
            if (obj.Title === card.children.item(1).textContent) {
                obj.Favorite = false;
                return obj
            }
            return obj
        });

        if (isFavoriteList === true) {
            card.remove()
        }
        console.log(myFilmList);
        localStorage.clear()
        localStorage.setItem("filmList", JSON.stringify(myFilmList));
        console.log("removeFavorite");
    }
}

function sortedByField(field) {
    return (a, b) => a[field] < b[field] ? 1 : -1;
}

function sortedByRating() {
    removeClass(releaseDateButton, checkButtonClass);
    removeClass(boxOfficeButton, checkButtonClass);
    addClass(ratingButton, checkButtonClass);
    removeAll();
    showFilmList(myFilmList.sort(sortedByField(ratingField)));
}

function sortedByReleaseDate() {
    removeClass(ratingButton, checkButtonClass);
    removeClass(boxOfficeButton, checkButtonClass);
    addClass(releaseDateButton, checkButtonClass);
    removeAll();
    showFilmList(myFilmList.sort(function(a,b) {
        return new Date(b.Released).getTime() - new Date(a.Released).getTime()
    }));
}

function sortedByBoxOffice() {
    removeClass(releaseDateButton, checkButtonClass);
    removeClass(ratingButton, checkButtonClass);
    addClass(boxOfficeButton, checkButtonClass);
    removeAll();
    showFilmList(myFilmList.sort(function(a,b) {
        return b.BoxOffice.replace(/\D/g,'') - a.BoxOffice.replace(/\D/g,'')
    }));
}
