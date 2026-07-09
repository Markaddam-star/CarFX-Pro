/**
 * ============================================================
 * CarFX Pro Ultimate
 * Vehicle Factory v2.1
 * Advanced Dynamic Vehicle Generator
 * ============================================================
 */

class VehicleFactory {


    // =========================================================
    // VEHICLE DATABASE
    // =========================================================

    static TYPES = [


        // =========================
        // CIVILIAN CARS
        // =========================

        {
            type: "sedan",

            width: 60,
            height: 118,

            speed: "normal",

            maxSpeed: 300,

            acceleration: 80,

            braking: 420,

            weight: 1400,

            handling: "balanced",

            aiStyle: "normal"
        },



        {
            type: "suv",

            width: 68,
            height: 126,

            speed: "slow",

            maxSpeed: 240,

            acceleration: 55,

            braking: 380,

            weight: 2100,

            handling: "stable",

            aiStyle: "cautious"
        },



        {
            type: "sports",

            width: 58,
            height: 112,

            speed: "fast",

            maxSpeed: 380,

            acceleration: 140,

            braking: 520,

            weight: 1200,

            handling: "sharp",

            aiStyle: "aggressive"
        },



        {
            type: "hatchback",

            width: 56,
            height: 108,

            speed: "normal",

            maxSpeed: 280,

            acceleration: 75,

            braking: 400,

            weight: 1200,

            handling: "balanced",

            aiStyle: "normal"
        },



        {
            type: "taxi",

            width: 60,
            height: 118,

            speed: "normal",

            maxSpeed: 270,

            acceleration: 70,

            braking: 400,

            weight: 1500,

            handling: "balanced",

            aiStyle: "city"
        },



        {
            type: "pickup",

            width: 66,
            height: 124,

            speed: "slow",

            maxSpeed: 230,

            acceleration: 50,

            braking: 350,

            weight: 2200,

            handling: "heavy",

            aiStyle: "cautious"
        },



        {
            type: "van",

            width: 70,
            height: 132,

            speed: "slow",

            maxSpeed: 220,

            acceleration: 45,

            braking: 320,

            weight: 2500,

            handling: "heavy",

            aiStyle: "cautious"
        },


        // =========================
        // FUTURE READY VEHICLES
        // =========================


        {
            type: "police",

            width: 62,
            height: 120,

            speed: "fast",

            maxSpeed: 360,

            acceleration: 130,

            braking: 500,

            weight: 1600,

            handling: "sharp",

            aiStyle: "pursuit"
        },


        {
            type: "ambulance",

            width: 72,
            height: 140,

            speed: "normal",

            maxSpeed: 260,

            acceleration: 70,

            braking: 420,

            weight: 2400,

            handling: "heavy",

            aiStyle: "emergency"
        },


        {
            type: "firetruck",

            width: 78,
            height: 150,

            speed: "slow",

            maxSpeed: 210,

            acceleration: 40,

            braking: 300,

            weight: 6000,

            handling: "veryHeavy",

            aiStyle: "emergency"
        }


    ];





    // =========================================================
    // COLORS
    // =========================================================

    static COLORS = [


        "#ffffff",
        "#111111",
        "#bdbdbd",
        "#616161",

        "#1976d2",
        "#0d47a1",

        "#d32f2f",
        "#b71c1c",

        "#43a047",
        "#1b5e20",

        "#fb8c00",
        "#fdd835",

        "#8e24aa",
        "#6a1b9a",

        "#795548"

    ];






    // =========================================================
    // RANDOM VEHICLE
    // =========================================================

    static random() {


        const base =
            this.TYPES[
                Math.floor(
                    Math.random() *
                    this.TYPES.length
                )
            ];



        return {


            type:
                base.type,


            width:
                base.width,


            height:
                base.height,



            speedClass:
                base.speed,



            maxSpeed:
                base.maxSpeed,


            acceleration:
                base.acceleration,


            braking:
                base.braking,


            weight:
                base.weight,


            handling:
                base.handling,


            aiStyle:
                base.aiStyle,



            color:
                this.COLORS[
                    Math.floor(
                        Math.random() *
                        this.COLORS.length
                    )
                ],



            roofStyle:
                Math.floor(
                    Math.random() * 3
                ),



            wheelSize:
                8 +
                Math.random() * 4,



            spoiler:
                Math.random() > 0.82,



            headlights:
                Math.random() > 0.5,



            brakeLights:
                false

        };


    }







   // =========================================================
// PLAYER VEHICLE
// GTA SUPPORT / PURSUIT CAR v2.2
// =========================================================

static.player() {

return {

    type: "sports",

    width: 62,

    height: 118,

    color: "#ff6d00",


    // GTA STYLE PERFORMANCE

    maxSpeed: 520,

    acceleration: 220,

    braking: 260,


    weight: 1200,


    handling: "sharp",


    aiStyle:
        "player",


    roofStyle: 2,

    wheelSize: 10,

    spoiler: true,

    headlights: true,

    brakeLights: false

};

}


}



window.VehicleFactory = VehicleFactory;


console.log(
    "✅ VehicleFactory v2.1 Loaded Successfully"
);
