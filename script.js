const imagesDiv = document.querySelector("#imagesDiv");
const textsDiv = document.querySelector("#textsDiv");
const btnSearch = document.querySelector("#btnSearch");
const searchInput = document.querySelector(".search-input");
const contentContainer = document.querySelector(".content-container");
const btnPreviousArray = document.querySelectorAll(".btn-previous");
const btnNextArray = document.querySelectorAll(".btn-next");
const btnContainerDesktop = document.querySelector("#btnContainerDesktop");
const btnContainerMobile = document.querySelector("#btnContainerMobile");
const pageNumberArray = document.querySelectorAll(".pageNumber");
const back2Top = document.querySelector("#back2Top");
const btnImage = document.querySelector(".image-button");
const notFound = document.querySelector(".not-found");

contentContainer.style = "display: none";
btnContainerDesktop.style = "display: none";
btnContainerMobile.style = "display: none";

btnImage.style = "visibility: hidden";
notFound.style = "display: none";

let startIndex = 1;
let lastQuery;
let apiKey = "AIzaSyDs_oxKNzPlM6SusPYEvYp_Im0nOy797Vg";
let customSearchId = "001070535140200413681:8sbflscrdn2";

async function search(query) {
  if (query === "" || query === null || query === undefined) {
    return;
  }
  let texts = await getTexts(query);
  let images = await getImages(query);
  let nothingFound = texts == undefined && images == undefined;
  if (nothingFound) {
    contentContainer.style = "display: none";
    btnImage.style = "visibility: hidden";
    btnContainerDesktop.style = "visibility: hidden";
    btnContainerMobile.style = "visibility: hidden";
    btnContainerDesktop.style = "visibility: hidden";
    btnContainerMobile.style = "visibility: hidden";
    notFound.style = "display: block";

    return;
  } else {
    contentContainer.style = "display: flex";
    btnImage.style = "visibility: visible";
    btnContainerDesktop.style = "visibility: visible";
    btnContainerMobile.style = "visibility: visible";
    btnContainerDesktop.style = "visibility: visible";
    btnContainerMobile.style = "visibility: visible";
    notFound.style = "display: none";
  }
  appendTexts(texts);
  appendImages(images);

  //page number count
  pageNumberArray[0].innerHTML = (startIndex - 1) / 10 + 1;
  pageNumberArray[1].innerHTML = (startIndex - 1) / 10 + 1;

  if (startIndex == 1) {
    btnPreviousArray.style = "visibility: hidden";
  } else {
    btnPreviousArray.style = "visibility: visible";
  }
  if (startIndex == 91) {
    btnNextArray.style = "visibility: hidden";
  } else {
    btnNextArray.style = "visibility: visible";
  }
}

function onSearchClick(e) {
  e.preventDefault();
  //do call only if btnSearch is clicked, not if input is retyped
  let doCallout = true;

  if (e.target.id == btnSearch.id) {
    lastQuery = searchInput.value;
    startIndex = 1;
  } else if (lastQuery != searchInput.value) {
    doCallout = false;
  }

  if (doCallout) {
    search(searchInput.value);
  }
}
btnSearch.addEventListener("click", onSearchClick);

function appendImages(imageItems) {
  imagesDiv.innerHTML = "";
  imageItems.forEach((imageItem) => {
    imgDiv = document.createElement("div");
    imgDiv.classList.add("image-div");
    if (imageItem.fileFormat == "image/") {
      imgDiv.innerHTML = `<a target="_blank" href=${imageItem.link}><img src=${imageItem.image.thumbnailLink}></img></a>`;
    } else {
      imgDiv.innerHTML = `<a target="_blank" href=${imageItem.link}><img src=${imageItem.link}></img></a>`;
    }
    imagesDiv.appendChild(imgDiv);
  });
}

async function getImages(query) {
  let tmpUrl = new URL("https://www.googleapis.com/customsearch/v1");
  tmpUrl.searchParams.append("key", apiKey);
  tmpUrl.searchParams.append("cx", customSearchId);
  tmpUrl.searchParams.append("q", query);
  tmpUrl.searchParams.append("searchType", "image");
  tmpUrl.searchParams.append("start", startIndex);

  const data = await fetch(tmpUrl)
    .then((response) => {
      if (response.ok) return response.json();
      else throw Error(`Request rejected with status ${response.status}.`);
    })
    .catch((error) => {
      notFound.innerHTML = error.message;
      return {};
    });
  return data.items;
}

function appendTexts(textItems) {
  textsDiv.innerHTML = "";
  textItems.forEach((textItem) => {
    let textDiv = document.createElement("div");
    textDiv.classList.add("text-div");
    textDiv.innerHTML = `<p>${textItem.htmlTitle}</p><a target="_blank" href="${textItem.link}">${textItem.link}</a>`;
    textsDiv.appendChild(textDiv);
  });
}

async function getTexts(query) {
  let tmpUrl = new URL("https://www.googleapis.com/customsearch/v1");
  tmpUrl.searchParams.append("key", apiKey);
  tmpUrl.searchParams.append("cx", customSearchId);
  tmpUrl.searchParams.append("q", query);
  tmpUrl.searchParams.append("start", startIndex);
  const data = await fetch(tmpUrl)
    .then((response) => {
      if (response.ok) return response.json();
      else throw Error(`Request rejected with status ${response.status}.`);
    })
    .catch((error) => {
      notFound.innerHTML = error.message;
      return {};
    });
  return data.items;
}

function decreasePage(e) {
  if (startIndex > 1) {
    startIndex = startIndex - 10;
  }

  onSearchClick(e);
}

function increasePage(e) {
  if (startIndex < 91) {
    startIndex = startIndex + 10;
  }
  onSearchClick(e);
}

//when scrolled down 20 px from the top, show button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    back2Top.style.display = "block";
  } else {
    back2Top.style.display = "none";
  }
}

// When clicked on the button, scroll to the top of the document
function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" }); //working on mobile chrome
}
function downFunction() {
  let imgPosition = imagesDiv.offsetTop;

  window.scrollTo({ top: imgPosition, behavior: "smooth" }); //working on mobile chrome
}

btnPreviousArray[0].addEventListener("click", decreasePage);
btnPreviousArray[1].addEventListener("click", decreasePage);

btnNextArray[0].addEventListener("click", increasePage);
btnNextArray[1].addEventListener("click", increasePage);
