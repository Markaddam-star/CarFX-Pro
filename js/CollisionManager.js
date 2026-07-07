/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js - PLAYER COLLISION SYSTEM v1.0
 * ============================================================
 */

class CollisionManager {

    constructor(player, trafficManager) {

        this.player = player;
        this.trafficManager = trafficManager;

        this.safeGap = 130;

    }

    canEnterLane(targetLane) {

        if (!this.player || !this.trafficManager)
            return true;

        for (const car of this.trafficManager.cars) {

            if (Math.round(car.lane) !== targetLane)
                continue;

            const gap = Math.abs(car.y - this.player.y);

            if (gap < this.safeGap)
                return false;

        }

        return true;

    }

}

window.CollisionManager = CollisionManager;
