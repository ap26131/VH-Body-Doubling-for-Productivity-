document.addEventListener("DOMContentLoaded", () => {
    // Extract the letter from the filename
    const groupLetter = window.location.pathname.match(/Group([A-E])/)[1];

    // Send the letter to the server using a POST request
    fetch("/store-group-letter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ group: groupLetter })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();  // Parse JSON only if the response is valid
    })
    .then(data => console.log("Group letter stored:", data))
    .catch(error => console.error("Error:", error));
});