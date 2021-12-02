async function fetchCountriesData() {
  const url = "https://restcountries.eu/rest/v2/all";
  
  try{
      const countriesDataResponse = await fetch(url);
      const countriesData = await countriesDataResponse.json();    
      generateHtml(countriesData);
  } catch(err){
      console.error(err);
  }
}

// Retrieve Countries Data
fetchCountriesData();

// Retrieves weather data 
async function checkWeather(countryLatLng, countryName) {
  let latLngArr = countryLatLng.split(",");
  let latLngArrFormatted = latLngArr.map((ele) => (+ele).toFixed(2));
  const lat = latLngArrFormatted[0];
  const lng = latLngArrFormatted[1];
  try {
    const weatherData = await fetchWeather(lat, lng);
    showModal(weatherData, countryName);
  } catch(err){
      console.error(err);
  }
}

//Open Modal and pass weather data to it.
async function showModal(weatherData, countryName){
  $("#exampleModalCenter").modal();
  $("#countryName").text(countryName || "NA");
  $("#temperature").text(formatTemperature(weatherData.main.temp));
  $("#weather").text(weatherData.weather[0].description);
  const iconImageSrc = await getWeatherIcon(weatherData.weather[0].icon);
  $("#weatherIcon").attr('src',iconImageSrc);
}

// Fetch Weather icon from openweathermap server
async function getWeatherIcon(iconCode){
  const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  try {
    const weatherIconResponse = await fetch(url); 
    return weatherIconResponse.url;
  } catch(err){
      console.error(err);
  }
}

// Fetch weather for latitude and longitude passed to the  function
async function fetchWeather(lat, lng) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=d9da5c116c793405f65774bb82a48990`;
  try{
      const response = await fetch(url);
      return await response.json();
  } catch(err){
      console.error(err);
  }
}

function formatTemperature(temperature) {
  return (+temperature - 273).toFixed(2);
}

//*********************************************************************DOM ******************************************************

//Create Modal Using DOM
function createModal() {
  const modal = createDomElement("div", "modal fade", "exampleModalCenter");
  modal.tabindex = "-1";
  modal.role = "dialog";
  modal.setAttribute("aria-labelledby", "true");
  modal.setAttribute("aria-hidden", "true");

    const modalDialog = createDomElement( "div", "modal-dialog modal-dialog-centered");
    modalDialog.setAttribute("role", "document");

      const modalContent = createDomElement("div", "modal-content modal-custom-color");
        const modalHeader = createDomElement("div", "modal-header");
          const modalTitle = createDomElement( "h5", "modal-title", "exampleModalLongTitle");
          modalTitle.innerHTML = "Weather Report";
        modalHeader.append(modalTitle);

        const modalBody = createDomElement("div", "modal-body");
          const countryDiv = createDomElement("div");
            const countryP = createDomElement("p");
            countryP.innerHTML = "Country: ";
            const countryPName = createDomElement("p", "", "countryName");
          countryDiv.append(countryP, countryPName);

          const temperatureDiv = createDomElement("div");
            const temperatureP = createDomElement("p");
            temperatureP.innerHTML = "Temperature: ";
            const temperaturePValue = createDomElement( "p","font-weight-bold","temperature");
            const degreeSymbol = createDomElement( "span", "font-weight-bold degreeCelsius");
            degreeSymbol.innerHTML = " &#8451;";
          temperatureDiv.append(temperatureP, temperaturePValue, degreeSymbol);

          const weatherDiv = createDomElement("div");
            const weatherP = createDomElement("p");
            weatherP.innerHTML = "Weather: ";
            const weatherPValue = createDomElement("p", "font-weight-bold", "weather");
          const weatherIcon = createDomElement('img', '', 'weatherIcon');
          weatherDiv.append(weatherP, weatherPValue, weatherIcon);
        modalBody.append(countryDiv, temperatureDiv, weatherDiv);

        const modalFooter = createDomElement("div", "modal-footer");
          const modalCloseButton = createDomElement("div", "btn btn-primary");
          modalCloseButton.setAttribute("data-dismiss", "modal");
          modalCloseButton.innerHTML = "Close";
        modalFooter.append(modalCloseButton);

      modalContent.append(modalHeader, modalBody, modalFooter);
    modalDialog.append(modalContent);
  modal.append(modalDialog);

  document.body.append(modal);
}

//Creates individual Card
function createCard(countryObj) {
    const card = createDomElement("div", "card");
      const cardBody = createDomElement("div", "card-body");
        const cardTitle = createDomElement("h5", "card-title text-center blackBackground");
        // If the name of the country is too long, then change the font size
        if (countryObj.name.length > 15) {
          cardTitle.classList.add("short-title");
        }
        cardTitle.innerHTML = countryObj.name;

        const image = createDomElement("img", "card-img-top");
        image.src = countryObj.flag;
        image.alt = countryObj.name;

        const cardContents = createDomElement("div", "card-contents");

          const capitalP = createDomElement("p");
            capitalP.innerHTML = "Capital:";
            const capitalPSpan = createDomElement("span");
            if (!countryObj.capital) {
              capitalPSpan.innerHTML = "NA";
            } else {
              capitalPSpan.innerHTML = countryObj.capital;
            }
          capitalP.append(capitalPSpan);

          const countryCodesP = createDomElement("p");
            countryCodesP.innerHTML = "Country Codes: ";
            const countryCodesPSpan = createDomElement("span");
            countryCodesPSpan.innerHTML = `${countryObj.alpha2Code}, ${countryObj.alpha3Code}`;
          countryCodesP.append(countryCodesPSpan);

          const regionP = createDomElement("p");
            regionP.innerHTML = "Region:";
            const regionPSpan = createDomElement("span");
            regionPSpan.innerHTML = countryObj.region;
          regionP.append(regionPSpan);

          const latLongP = createDomElement("p");
            latLongP.innerHTML = "Lat Long:";
            const latLongPSpan = createDomElement("span");
            latLongPSpan.innerHTML = formatLatLng(countryObj.latlng);
          latLongP.append(latLongPSpan);

          const checkWeatherButton = createDomElement("button", "weatherBtn btn btn-primary", countryObj.alpha2Code);
            checkWeatherButton.innerHTML = "Check for Weather";
          checkWeatherButton.setAttribute( "onclick", `checkWeather('${countryObj.latlng}', '${countryObj.name}')`);

        cardContents.append( capitalP, regionP, countryCodesP, latLongP, checkWeatherButton);
      cardBody.append(cardTitle, image, cardContents);
    card.append(cardBody);
  return card;
}

// Formats the latitude and longitude
function formatLatLng(latLngArr) {
  return latLngArr.map((ele) => ele.toFixed(2)).join(",");
}

// Creates a Dom element and assigns class and id to it, if they are not empty
function createDomElement(ele, eleClass = "", eleId = "") {
  const element = document.createElement(ele);
  eleClass !== "" ? element.setAttribute("class", eleClass) : "";
  eleId !== "" ? element.setAttribute("id", eleId) : "";
  return element;
}

// Generates Body of the document
function generateHtml(countriesInfo) {
  const container = createDomElement("div", "container");
    const row = createDomElement("div", "row");
      const column = createDomElement("div", "col-lg-12");
        const cardRow = createDomElement('div', 'row');
          
            countriesInfo.forEach((country) => {
              const cardColumn = createDomElement('div', 'col-lg-4 col-sm-12 mt-5')
              const card = createCard(country);
              cardColumn.append(card);
              cardRow.append(cardColumn);
            });
        column.append(cardRow);    
      row.append(column);
    container.append(row);
  document.body.append(container);
  
  // Create a modal using DOM functions
  // Append it to the body of the page
  createModal();
}
