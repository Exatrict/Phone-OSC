import * as THREE from 'three';

// const sensor = new AbsoluteOrientationSensor ({frequency: 60});
// let initacc = confirm("Grant Access to Gyro?");
let x = 0, y = 0;
let ForceClamp = 0.5;
let friction = 0.99;
let sensorActive = false
const startButton = document.getElementById('permissionButton');
const ballRadius = 0.7;



//__________request Access__________

// requestOrientationPermission();
// async function requestOrientationPermission() {
//   if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
//     try {
//       const permissionState = await DeviceOrientationEvent.requestPermission();
//       if (permissionState === 'granted') {
//         window.addEventListener('deviceorientation', handleOrientation);
//         console.log("yay");
//         return true
//       }
//       console.log("no Yay");
//     } catch (error) {
//       console.error(error);
//     }
//     return false
//   } else {
//     // Android / Browser, die keine explizite Permission-API benötigen
//     window.addEventListener('deviceorientation', handleOrientation());
//     console.log("yay");
//     return true
//   }
// }

function startOrientation() {
  window.addEventListener('deviceorientation', handleOrientation);
}

async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    const state = await DeviceOrientationEvent.requestPermission();
    if (state !== 'granted') return false;
  }
  startOrientation();
  return true;
}

startButton.addEventListener('click', async () => {
  if (await requestOrientationPermission()) startButton.remove();
});



// const startButton = document.getElementById('permissionButton')
// startButton.addEventListener('click', async () =>{
//   const ok = await requestOrientationPermission()
//   if(ok) startButton.remove()
// })
const needsPermission =
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission === 'function';

if (needsPermission) {
  startButton.addEventListener('click', async () => {
    if (await requestOrientationPermission()) startButton.remove();
  });
} else {
  startButton.remove();
  requestOrientationPermission(); // just attaches the listener
}

function handleOrientation(event){
  x = event.gamma/180
  y = -event.beta/180
}


//__________Setup Renderer__________


let VecBorderMin = new THREE.Vector3(-4,-4,-4)
let VecBorderMax = new THREE.Vector3(4,4,4)

const size = {
  width:  window.innerWidth,
  height: window.innerHeight
}

const windowVecMax = new THREE.Vector3()
const windowVecmin = new THREE.Vector3()
// console.log(windowVecmin,windowVecMax)

const szene = new THREE.Scene()
const kamera = new THREE.PerspectiveCamera(50, size.width/size.height, 0.1, 100 )


const canvas = document.querySelector("canvas.webgl")

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})

function createFovBorder(){
  const dist = kamera.position.z - BallMesh.position.z;
  const fovHeight = Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2)) * dist
  const fovWidth = fovHeight * kamera.aspect
  VecBorderMax.set(fovWidth - ballRadius, fovHeight - ballRadius, 0)
  VecBorderMin.set(-(fovWidth - ballRadius), -(fovHeight - ballRadius), 0)
}




renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000)

const lineColor = "#626262"
const BallMesh = new THREE.Mesh(
  new THREE.SphereGeometry(ballRadius, 28, 20),
  new THREE.MeshBasicMaterial({color: lineColor})
)

kamera.position.set(0, 0, 8)
kamera.lookAt(0,0,0)
szene.add(kamera)
szene.add(BallMesh)
createFovBorder()




// __________Physics__________
let bForX = 0, bForY = 0;
let bForVec = new THREE.Vector3(0,0,0)

function ballForce(){
bForX = bForX + x/100;
bForY =bForY + y/100;
bForX *= friction;
bForY *= friction;

bForX = THREE.MathUtils.clamp(bForX, -ForceClamp, ForceClamp);
bForY = THREE.MathUtils.clamp(bForY, -ForceClamp, ForceClamp);
bForVec.set(bForX, bForY, 0)
}

function rollBall(){
BallMesh.position.add(bForVec);
// if (BallMesh.position < VecBorderMin){
//   if( BallMesh.position > VecBorderMax){
//   bForX *= 0
//   bForY *= 0
//   }
// }

if (BallMesh.position.x < VecBorderMin.x || BallMesh.position.x > VecBorderMax.x){
  bForX *= -0.2
}

if (BallMesh.position.y < VecBorderMin.y || BallMesh.position.y > VecBorderMax.y){
  bForY *= -0.2
}

BallMesh.position.clamp(VecBorderMin,VecBorderMax)
}




function tick(){
  if(sensorActive === false){
    ballForce();
    rollBall();
    renderer.render(szene, kamera)
    window.requestAnimationFrame(tick);
  }
}
tick();















{/* <button onclick='requestGyroAccess();'>Request orientation permission</button> */}


