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

    if (Math.round(car.targetLane ?? car.lane) !== targetLane)
        continue;

    const gap = Math.abs(car.y - this.player.y);

    console.log(
        "Lane:", targetLane,
        "PlayerY:", this.player.y,
        "CarY:", car.y,
        "Gap:", gap
    );

    const safeDistance =
        (car.height + this.player.height) / 2 + 35;

    if (gap < safeDistance)
        return false;
}

window.CollisionManager = CollisionManager;
