/**
 * ============================================================
 * CarFX Pro Ultimate
 * Background System v2.23
 *
 * GTA Parallax + Road World + Environment Polish
 *
 * Added:
 * - Asphalt noise
 * - Road wear
 * - Road edge details
 * ============================================================
 */

class Background {


constructor(canvas){


this.canvas = canvas;


// ============================
// PARALLAX
// ============================

this.farOffset = 0;
this.nearOffset = 0;

this.farSpeed = 15;
this.nearSpeed = 40;



// ============================
// WORLD OBJECTS
// ============================

this.palms = [];
this.streetLights = [];
this.decorations = [];



// ============================
// ROAD DETAILS
// ============================

this.roadMarks = [];
this.roadSigns = [];



// ============================
// ENVIRONMENT POLISH v2.23
// ============================

this.roadNoise = [];
this.roadWear = [];



this.createRoadsideObjects();

this.createRoadDetails();

this.createRoadSurfaceDetails();



if(window.VehicleFactory){

this.vehicleFactory =
window.VehicleFactory;


this.playerVehicle =
this.vehicleFactory.player();

}


}








update(dt,playerSpeed=0){



const ratio =
Math.min(
playerSpeed/520,
1
);





this.farOffset +=
(this.farSpeed+ratio*20)*dt;



this.nearOffset +=
(this.nearSpeed+ratio*80)*dt;







// 🌴 PALMS

for(const tree of this.palms){


tree.z -=
(this.nearSpeed+
playerSpeed*0.15)*dt;



if(tree.z<-500){

tree.z=2500;

}


}








// 💡 LIGHTS


for(const light of this.streetLights){


light.z -=
(this.nearSpeed+
playerSpeed*0.12)*dt;



if(light.z<-500){

light.z=2500;

}


}








// 🌳 DECOR


for(const item of this.decorations){


item.z -=
(this.nearSpeed+
playerSpeed*0.1)*dt;



if(item.z<-500){

item.z=2500;

}


}








// 🛣️ LANE MARKS


for(const mark of this.roadMarks){


mark.z -=
(this.nearSpeed+
playerSpeed*0.18)*dt;



if(mark.z<-300){

mark.z=2800;

}


}








// 🪧 SIGNS


for(const sign of this.roadSigns){


sign.z -=
(this.nearSpeed+
playerSpeed*0.12)*dt;



if(sign.z<-300){

sign.z=3200;

}


}








// 🕳 ROAD WEAR


for(const wear of this.roadWear){


wear.z -=
(this.nearSpeed+
playerSpeed*0.15)*dt;



if(wear.z<-300){

wear.z=3000;

}


}


}
createRoadsideObjects(){



// 🌴 PALMS

for(let i=0;i<12;i++){


this.palms.push({

side:
i%2===0?-1:1,

z:
i*220+300,

scale:
0.7+
Math.random()*0.3


});


}






// 💡 STREET LIGHTS

for(let i=0;i<14;i++){


this.streetLights.push({

side:
i%2===0?-1:1,

z:
i*180+200,

height:
100+
Math.random()*30


});


}






// 🌳 DECOR

for(let i=0;i<18;i++){


this.decorations.push({

side:
i%2===0?-1:1,

z:
i*160+150,

type:
i%3


});


}


}









createRoadDetails(){



// LANE MARKS

for(let i=0;i<20;i++){


this.roadMarks.push({

z:
i*180+200

});


}






// SIGNS

for(let i=0;i<10;i++){


this.roadSigns.push({

side:
i%2===0?-1:1,


z:
i*500+300,


type:
i%3


});


}



}









createRoadSurfaceDetails(){



// ASPHALT NOISE


for(let i=0;i<120;i++){


this.roadNoise.push({


x:
Math.random(),


z:
Math.random()*3000,


size:
1+
Math.random()*3



});


}






// ROAD WEAR


for(let i=0;i<25;i++){


this.roadWear.push({


z:
i*250+300,


width:
30+
Math.random()*60


});


}



}









render(ctx){



const w =
this.canvas.width;


const h =
this.canvas.height;







// SKY


const sky =
ctx.createLinearGradient(
0,
0,
0,
h
);



sky.addColorStop(
0,
"#87CEEB"
);


sky.addColorStop(
1,
"#d6ecff"
);



ctx.fillStyle=sky;


ctx.fillRect(
0,
0,
w,
h
);








// FOG


ctx.fillStyle=
"rgba(255,255,255,0.06)";


ctx.fillRect(
0,
0,
w,
h
);







// CITY

this.drawCityLayer(
ctx,
w,
h,
this.farOffset,
180,
"rgba(20,20,30,0.25)"
);



this.drawCityLayer(
ctx,
w,
h,
this.nearOffset,
120,
"rgba(10,10,20,0.45)"
);








// ROAD SIZE


const roadWidth =
Math.min(
500,
w*0.5
);


const roadX =
(w-roadWidth)/2;






// ROAD


ctx.fillStyle =
"#303030";


ctx.fillRect(
roadX,
0,
roadWidth,
h
);






// ASPHALT DETAILS

this.drawRoadSurface(
ctx,
w,
h,
roadX,
roadWidth
);






// SIDEWALK


ctx.fillStyle="#8b8b8b";


ctx.fillRect(
roadX-45,
0,
45,
h
);


ctx.fillRect(
roadX+roadWidth,
0,
45,
h
);






// CURB


ctx.fillStyle="#cfcfcf";


ctx.fillRect(
roadX-10,
0,
10,
h
);


ctx.fillRect(
roadX+roadWidth,
0,
10,
h
);






// ROAD MARKS

this.drawRoadMarks(
ctx,
w,
h,
roadX,
roadWidth
);






// WORLD

this.drawRoadsideObjects(
ctx,
w,
h,
roadX,
roadWidth
);






// SIGNS

this.drawRoadSigns(
ctx,
w,
h,
roadX,
roadWidth
);



}
drawRoadSurface(ctx,w,h,roadX,roadWidth){



// Asphalt noise

for(const n of this.roadNoise){



let y =
h -
(n.z*0.35);



let x =
roadX +
n.x*roadWidth;



ctx.fillStyle =
"rgba(255,255,255,0.08)";



ctx.fillRect(

x,

y,

n.size,

n.size

);


}






// Road wear

this.drawRoadWear(
ctx,
w,
h,
roadX,
roadWidth
);




}





drawRoadWear(ctx,w,h,roadX,roadWidth){



for(const wear of this.roadWear){



let y =
h -
(wear.z*0.35);



let x =
roadX+
roadWidth/2-
wear.width/2;



ctx.fillStyle =
"rgba(0,0,0,0.15)";



ctx.fillRect(

x,

y,

wear.width,

6

);



}



}








drawRoadMarks(ctx,w,h,roadX,roadWidth){



const center =
roadX+
roadWidth/2;



for(const mark of this.roadMarks){



let p =
Math.max(
0.2,
1-mark.z/2800
);



let y =
h -
(mark.z*0.35);



ctx.fillStyle =
"#eeeeee";



ctx.fillRect(

center-20*p,

y,

40*p,

10*p

);



}


}








drawRoadSigns(ctx,w,h,roadX,roadWidth){



for(const sign of this.roadSigns){



let p =
Math.max(
0.3,
1-sign.z/3200
);



let x =
sign.side===-1

?

roadX-(55*p)

:

roadX+
roadWidth+
(55*p);





let y =
h -
(sign.z*0.35);




ctx.save();



ctx.translate(
x,
y
);



ctx.scale(
p,
p
);





ctx.fillStyle="#555";


ctx.fillRect(
0,
-70,
5,
70
);





ctx.fillStyle =
sign.type===0
?"#1e88e5"
:
sign.type===1
?"#d32f2f"
:
"#388e3c";



ctx.fillRect(
-25,
-100,
55,
30
);



ctx.restore();



}

}








drawRoadsideObjects(ctx,w,h,roadX,roadWidth){



this.drawDecor(
ctx,
w,
h,
roadX,
roadWidth
);



this.drawPalmTrees(
ctx,
w,
h,
roadX,
roadWidth
);



this.drawStreetLights(
ctx,
w,
h,
roadX,
roadWidth
);



}








drawPalmTrees(ctx,w,h,roadX,roadWidth){



for(const tree of this.palms){



let p =
Math.max(
0.25,
1-tree.z/2500
);



let x =
tree.side===-1
?
roadX-(45*p)
:
roadX+roadWidth+(45*p);




let y =
h-(tree.z*0.35);



ctx.save();


ctx.translate(
x,
y
);



ctx.scale(
tree.scale*p,
tree.scale*p
);



ctx.fillStyle="#8b5a2b";

ctx.fillRect(
-5,
-80,
10,
80
);



ctx.fillStyle="#228b22";



for(let i=0;i<5;i++){


ctx.beginPath();


ctx.ellipse(
0,
-90,
40,
12,
i*0.5,
0,
Math.PI*2
);


ctx.fill();


}



ctx.restore();



}


}








drawStreetLights(ctx,w,h,roadX,roadWidth){



for(const light of this.streetLights){



let p =
Math.max(
0.3,
1-light.z/2500
);



let x =
light.side===-1
?
roadX-(25*p)
:
roadX+roadWidth+(25*p);



let y =
h-(light.z*0.35);



ctx.strokeStyle="#333";


ctx.lineWidth =
4*p;



ctx.beginPath();


ctx.moveTo(
x,
y
);


ctx.lineTo(
x,
y-light.height*p
);


ctx.stroke();



ctx.fillStyle =
"rgba(255,240,150,0.9)";



ctx.beginPath();


ctx.arc(
x,
y-light.height*p,
6*p,
0,
Math.PI*2
);



ctx.fill();



}


}








drawDecor(ctx,w,h,roadX,roadWidth){



for(const item of this.decorations){



let p =
Math.max(
0.3,
1-item.z/2500
);



let x =
item.side===-1
?
roadX-(55*p)
:
roadX+roadWidth+(55*p);



let y =
h-(item.z*0.35);



ctx.fillStyle="#2f7d32";



ctx.beginPath();


ctx.arc(
x,
y,
20*p,
0,
Math.PI*2
);


ctx.fill();



}



}








drawCityLayer(ctx,w,h,offset,baseHeight,color){



ctx.fillStyle=color;



for(let i=0;i<25;i++){


let x =
(i*160-offset)
%(w+300);



if(x<-200){

x+=w+300;

}



let bw =
70+(i%3)*20;



let bh =
baseHeight+(i%5)*45;



ctx.fillRect(
x,
h-bh,
bw,
bh
);



}



}





}



window.Background = Background;
