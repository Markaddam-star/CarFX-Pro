/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js - PLAYER COLLISION SYSTEM v1.1
 * ============================================================
 */

class CollisionManager {

    constructor(player, trafficManager) {

        this.player = player;
        this.trafficManager = trafficManager;

        this.safeGap = 170;

    }

    canEnterLane(targetLane) {

        if (!this.player || !this.trafficManager)
            return true;

        for (const car of this.trafficManager.cars) {

            const lane =
                Math.round(car.targetLane ?? car.lane);

            if (lane !== targetLane)
                continue;

            const gap =
                Math.abs(car.y - this.player.y);

            console.log(
                "Lane:", targetLane,
                "PlayerY:", this.player.y,
                "CarY:", car.y,
                "Gap:", gap
            );

            const safeDistance =
                (car.height + this.player.height) / 2 +
                this.safeGap;

            if (gap < safeDistance) {

                console.log("❌ Lane Blocked");

                return false;

            }

        }

        console.log("✅ Lane Free");

        return true;

    }

}

window.CollisionManager = CollisionManager;
