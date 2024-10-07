/**
 * This function is for storing precision points in a txt file.
 */

async function call_Point(){
        var prediction = await webgazer.getCurrentPrediction();
        if (prediction) {
                var x = prediction.x;
                var y = prediction.y;
        }

        alert(x + " " + y);
};