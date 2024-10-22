let gazePoints = [];

function startSessionTracking () {
    let timer = null; 
  
        webgazer.setGazeListener(function(data, elapsedTime) { 
          if (data == null) {
            return;
          }
      
          var xprediction = data.x; 
          var yprediction = data.y; 
      
          
          var viewportWidth = window.innerWidth;
          var viewportHeight = window.innerHeight;

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

        /** Code for checking if user is looking off screen
          var minX = viewportWidth * 0.1; 
          var maxX = viewportWidth * 0.9; 
          var minY = viewportHeight * 0.1; 
          var maxY = viewportHeight * 0.9; 
      
        
          if ((xprediction < minX || xprediction > maxX || yprediction < minY || yprediction > maxY) ) {
            
            timer = setTimeout(function() {
                    swal('Get Back To Work!');
                            }, 10000); // 10 seconds
        }
                            */
        }).begin();
}

function endSessionTracking () {
  
  $.ajax({
    url: '/endsession',
    type: 'post',
    dataType: "text",
    data: {
      gazedata : JSON.stringify(gazePoints)
    },
    success: function(data) {
      console.log("success");
    }
  })

}

// Start tracking gaze when the window loads
window.onload = async function() {
  swal({
    title: "Quiz One",
    text: "Press the button to begin the quiz!",
    closeOnEsc: false,
    allowOutsideClick: false,
    closeModal: true
}).then( () => {
    // Start gaze tracking when swal is closed
    startSessionTracking();
});

window.onbeforeunload = async function() {

}
};