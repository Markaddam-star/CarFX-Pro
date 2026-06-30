import Engine from "./engine.js";
import Renderer from "./renderer.js";
import ObjectManager from "./objectManager.js";

// 1. Canvas create
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// 2. System setup
const renderer = new Renderer();
const objectManager = new ObjectManager();

// 3. Engine connect
const engine = new Engine(renderer, objectManager);

// 4. GAME START
engine.start(ctx);
