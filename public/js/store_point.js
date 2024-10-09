/**
 * This function is for storing precision points in a txt file.
 */

async function store_Points(){

        if(localStorage.getItem("predictions") == null) {
                let empty = [];
                localStorage.setItem("predictions", JSON.stringify(empty));
        }

        let array = JSON.parse(localStorage.getItem("predictions"));
        let prediction = await webgazer.getCurrentPrediction(async () => {
                if (prediction) {
                        var x = prediction.x;
                        var y = prediction.y;
                }
                array.push(x + ", " + y);
                localStorage.setItem('predictions', JSON.stringify(array));
                alert(localStorage.getItem('predictions'));
        });
};