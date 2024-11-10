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

        /** 
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
    
        var minX = viewportWidth * 0.1; 
        var maxX = viewportWidth * 0.9; 
        var minY = viewportHeight * 0.1; 
        var maxY = viewportHeight * 0.9; 
    
      
        if ((xprediction < minX || xprediction > maxX || yprediction < minY || yprediction > maxY) ) {
          
          timer = setTimeout(function() {
                  alert('Get Back To Work!');
                          }, 10000); // 10 seconds
      }
                          */
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


window.onload = async function() {
    swal({
      title: "Quiz One",
      text: "Press the button to begin the quiz!",
      closeOnEsc: false,
      allowOutsideClick: false,
      closeModal: true
  }).then( () => {
      // Start gaze tracking when swal is closed
      startGazeTracking();
  });
}