const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {
  clearResults();

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  // Get search query
  const q = document.querySelector(".search input").value.trim();

  if (q === "") {
    alert("Please enter a search query.");
    return false;
  }

  // Build API query URL
  const apiUrl = `${bing_api_endpoint}?q=${encodeURIComponent(q)}`;

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
  let request = new XMLHttpRequest();
  
  // Configure request
  request.open("GET", apiUrl);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = "json";

  // Handle request response
  request.onload = function () {
    if (request.status === 200) {
      const responseData = request.response;
      displayResults(responseData);
      displayRelatedConcepts(request.response.relatedSearches);
    } else {
      console.error("Error:", request.statusText);
    }
  };

  // Handle network errors
  request.onerror = function () {
    console.error("Network error occurred");
    // Handle error here, e.g., display an error message to the user
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
  closeResultsPane();
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

function displayResults(responseData) {
  // Display image results
  // Error handling: Check if responseData is empty or does not contain expected properties
  if (!responseData || !responseData.value || !responseData.relatedSearches) {
    console.error("Invalid response data:", responseData);
    return;
  }

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

  openResultsPane();
}

function displayRelatedConcepts(relatedSearches) {
  const suggestionsList = document.querySelector(".suggestions ul");
  suggestionsList.innerHTML = "";
  relatedSearches.forEach((relatedSearch) => {
    const li = document.createElement("li");
    li.textContent = relatedSearch.text;
    li.addEventListener("click", () => runSearchWithRelated(relatedSearch.text));
    suggestionsList.appendChild(li);
  });
}

function runSearchWithRelated(query) {
  document.querySelector(".search input").value = query;
  runSearch();
}


function addImageToBoard(imageUrl) {
  // Add selected image to the board
  const boardContainer = document.getElementById("board");
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  boardContainer.appendChild(imgElement);
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#runSearchButton").addEventListener("click", runSearch);
  document.querySelector(".search input").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {runSearch()}
  });

  document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
  document.querySelector("body").addEventListener("keydown", (e) => {
    if(e.key == "Escape") {closeResultsPane()}
  });
});
