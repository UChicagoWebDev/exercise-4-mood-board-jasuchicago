const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  clearResults();

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  // Get search query
  const query = document.querySelector(".search input").value.trim();

  if (query === "") {
    alert("Please enter a search query.");
    return false;
  }

  // Build API query URL
  const apiUrl = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;

  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request

  // Configure request
  request.open("GET", apiUrl);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = "json";

  // Handle request response
  request.onload = function () {
    if (request.status === 200) {
      const responseData = request.response;
      displayResults(responseData);
    } else {
      console.error("Error:", request.statusText);
    }
  };

  // Send request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function clearResults() {
  // Clear previous search results
  const resultsContainer = document.getElementById("resultsImageContainer");
  resultsContainer.innerHTML = "";
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

function displayResults(responseData) {
  // Display image results
  const resultsContainer = document.getElementById("resultsImageContainer");
  const images = responseData.value;

  images.forEach(image => {
    const imgElement = document.createElement("img");
    imgElement.src = image.thumbnailUrl;
    imgElement.alt = image.name;
    imgElement.addEventListener("click", function () {
      addImageToBoard(image.contentUrl);
    });
    resultsContainer.appendChild(imgElement);
  });

  // Display related concept results
  const relatedConceptsContainer = document.getElementById("relatedConcepts");
  relatedConceptsContainer.innerHTML = "";

  const relatedSearchTerms = responseData.relatedSearches;
  relatedSearchTerms.forEach(term => {
    const termElement = document.createElement("span");
    termElement.textContent = term.text;
    termElement.classList.add("related-concept");
    termElement.addEventListener("click", function () {
      document.querySelector(".search input").value = term.text;
      runSearch();
    });
    relatedConceptsContainer.appendChild(termElement);
  });

  openResultsPane();
}

function addImageToBoard(imageUrl) {
  // Add selected image to the board
  const boardContainer = document.getElementById("moodBoard");
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  boardContainer.appendChild(imgElement);
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
