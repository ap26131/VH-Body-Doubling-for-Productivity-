function storeLetter(letter){
// Send the letter to the server using a POST request
fetch("/store-group-letter", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ group: letter })
})
.then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
})
.then(data => {
    console.log("Group letter stored:", data)
})
.catch(error => console.error("Error:", error));
}
