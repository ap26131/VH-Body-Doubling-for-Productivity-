// Array to hold gaze prediction points
let gazePoints = [];

// Function to start capturing gaze data
function startGazeTracking() {
    webgazer.setGazeListener(function(data, elapsedTime) {
            if (data == null) {
                return;
            }

            var xprediction = data.x; // X coordinate
            var yprediction = data.y; // Y coordinate
            
            if(gazePoints.length > 900000) {
                gazePoints.length = 0;
            }
    
            // Store the prediction point
            gazePoints.push({
                x: xprediction,
                y: yprediction,
                time: elapsedTime
            });
            
            // Optionally, log the data for debugging
            console.log(`Gaze Point: (${xprediction}, ${yprediction}), Time: ${elapsedTime}`);
    }).begin();
}
 
// Function to retrieve the stored gaze points
function getGazePoints() {
    console.log(gazePoints);
    return gazePoints;
}

function stopGazeTracking(){
    webgazer.clearGazeListener();
}

// Start tracking gaze when the window loads
window.onload = async function() {
    startGazeTracking();
};