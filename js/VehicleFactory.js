/**
 * ============================================================
 * CarFX Pro Ultimate
 * Vehicle Factory v2.0
 * Dynamic Vehicle Generator
 * ============================================================
 */

class VehicleFactory {

   static TYPES = [

    { type: "sedan", width: 60, height: 118, speed: "normal" },

    { type: "suv", width: 68, height: 126, speed: "slow" },

    { type: "sports", width: 58, height: 112, speed: "fast" },

    { type: "hatchback", width: 56, height: 108, speed: "normal" },

    { type: "taxi", width: 60, height: 118, speed: "normal" },

    { type: "pickup", width: 66, height: 124, speed: "slow" },

    { type: "van", width: 70, height: 132, speed: "slow" }

];

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

    static random() {

        const base =
            this.TYPES[
                Math.floor(Math.random() * this.TYPES.length)
            
            ];

        return {

            type: base.type,

            width: base.width,

            height: base.height,

            speedClass: base.speed,

            color:
                this.COLORS[
                    Math.floor(Math.random() * this.COLORS.length)
                ],

            roofStyle: Math.floor(Math.random() * 3),

            wheelSize: 8 + Math.random() * 4,

            spoiler: Math.random() > 0.82,

            headlights: Math.random() > 0.5,

            brakeLights: false

        };

    }

    static player() {

        return {

            type: "sports",

            width: 62,

            height: 118,

            color: "#ff6d00",

            roofStyle: 2,

            wheelSize: 10,

            spoiler: true,

            headlights: true,

            brakeLights: false

        };

    }

}

window.VehicleFactory = VehicleFactory;
