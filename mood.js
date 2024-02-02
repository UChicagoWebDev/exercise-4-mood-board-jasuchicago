const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY;

function runSearch() {
  console.log("Running search");
  const query = document.querySelector(".search input").value.trim();
  if (!query) {
    alert("Please enter a search query!");
    return false;
  }

  // Clear previous search results
  clearResults();

  // Create a new XMLHttpRequest object
  const request = new XMLHttpRequest();
  request.open("GET", `${bing_api_endpoint}?q=${encodeURIComponent(query)}`);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = "json";

  // Event handler for successful request completion
  request.onload = function () {
    if (request.status === 200) {
      const results = request.response.value;
      displayResults(results);
      displayRelatedConcepts(request.response.relatedSearches);
    } else {
      // Display error message if there's an issue with fetching results
      alert("Error fetching results. Please try again later.");
    }
  };

  // Event handler for request errors
  request.onerror = function () {
    // Display error message if there's a network error
    alert("Network error occurred. Please try again later.");
  };

  // Send the request
  request.send();

  return false;
}

function clearResults() {
  const resultsContainer = document.getElementById("resultsImageContainer");
  resultsContainer.innerHTML = "";
}

function displayResults(results) {
  const resultsContainer = document.getElementById("resultsImageContainer");
  results.forEach((result) => {
    const img = document.createElement("img");
    img.src = result.thumbnailUrl;
    img.title = result.name;
    img.addEventListener("click", () => addToBoard(result.contentUrl));
    resultsContainer.appendChild(img);
  });
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

function addToBoard(imageUrl) {
  const board = document.getElementById("board");
  const img = document.createElement("img");
  img.src = imageUrl;
  img.classList.add("board-image");
  board.appendChild(img);
}

function runSearchWithRelated(query) {
  document.querySelector(".search input").value = query;
  runSearch();
}

function openResultsPane() {
  console.log("Opening results pane");
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  document.querySelector("#resultsExpander").classList.remove("open");
}

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") runSearch();
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeResultsPane();
});
