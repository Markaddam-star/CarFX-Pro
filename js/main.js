import Engine from "./engine.js";
import Renderer from "./renderer.js";
import ObjectManager from "./objectManager.js";
import TrafficCar from "./TrafficCar.js";

// 1. Canvas create
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// 2. System setup
const renderer = new Renderer();
const objectManager = new ObjectManager();
const engine = new Engine(renderer, objectManager);

// 3. Scene
const scene = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 4. Image
const carImg = new Image();
carImg.src = chrome.runtime.getURL("images/car.png");

// 5. 🚗 TRAFFIC CARS ADD (IMPORTANT PART)
const trafficCars = [];

for (let i = 0; i < 6; i++) {

    const car = new TrafficCar(
        Math.floor(Math.random() * 3),
        Math.random() * -500,
        100 + Math.random() * 200,
        carImg,
        scene
    );

    trafficCars.push(car);
    objectManager.add(car);
}

// 6. GAME START (LAST STEP)
engine.start(ctx);
