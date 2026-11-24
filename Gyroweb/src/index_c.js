const sensor = new AbsoluteOrientationSensor ({frequency: 60});
let initacc = confirm("Grant Access to Gyro?");
let x = 0, y = 0, z = 0;



function requestGyroAccess() {
    if (typeof DeviceMotionEvent.requestPermission === "function"){
        Promise.all([])
        DeviceMotionEvent.requestPermission()
        .then( response => {
            if (response === 'granted'){
                window.addEventListener("devicemotion", handleMotion);
                console.log("yay")
            }
        })
        DeviceOrientationEvent.requestPermission()
        .then( response => {
            if (response === 'granted'){
                window.addEventListener("deviceorientation", handleOrientation);
                console.log("yayOreintation")
            }
            else{
                console.log("Bomboclat")
                window.addEventListener("deviceorientation", handleOrientation);
            }
        })


    }
}



function handleOrientation(event){
    x= event.alpha;
}


// function tick(){
//     console.log(x,y,z);

//     window.requestAnimationFrame(tick);
// }
// tick();













{/* <button onclick='requestGyroAccess();'>Request orientation permission</button> */}


