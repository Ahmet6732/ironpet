// Real ironpet sprite data from GitHub repository
// Updated with actual ironpet PNG files

const baseUrl = 'https://raw.githubusercontent.com/Ahmet6732/ironpet/main/sprites';

export const mockSprites = {
  idle: [
    `${baseUrl}/idle/ironpet_idle1.png`,
    `${baseUrl}/idle/ironpet_idle2.png`,
    `${baseUrl}/idle/ironpet_idle3.png`
  ],
  walk: [
    `${baseUrl}/walk/ironpet_walk1.png`,
    `${baseUrl}/walk/ironpet_walk2.png`,
    `${baseUrl}/walk/ironpet_walk3.png`,
    `${baseUrl}/walk/ironpet_walk4.png`
  ],
  run: [
    `${baseUrl}/run/ironpet_run1.png`,
    `${baseUrl}/run/ironpet_run2.png`,
    `${baseUrl}/run/ironpet_run3.png`,
    `${baseUrl}/run/ironpet_run4.png`
  ],
  jump: [
    `${baseUrl}/jump/ironpet_jump1.png`,
    `${baseUrl}/jump/ironpet_jump2.png`,
    `${baseUrl}/jump/ironpet_jump3.png`,
    `${baseUrl}/jump/ironpet_jump4.png`
  ],
  fire: [
    `${baseUrl}/fire/ironpet_fire1.png`,
    `${baseUrl}/fire/ironpet_fire2.png`,
    `${baseUrl}/fire/ironpet_fire3.png`,
    `${baseUrl}/fire/ironpet_fire4.png`
  ],
  punch: [
    `${baseUrl}/punch/ironpet_punch1.png`,
    `${baseUrl}/punch/ironpet_punch2.png`,
    `${baseUrl}/punch/ironpet_punch3.png`,
    `${baseUrl}/punch/ironpet_punch4.png`
  ],
  fly: [
    `${baseUrl}/fly/ironpet_fly1.png`,
    `${baseUrl}/fly/ironpet_fly2.png`,
    `${baseUrl}/fly/ironpet_fly3.png`,
    `${baseUrl}/fly/ironpet_fly4.png`
  ],
  fly_fire: [
    `${baseUrl}/fly_fire/ironpet_fly_fire1.png`,
    `${baseUrl}/fly_fire/ironpet_fly_fire2.png`,
    `${baseUrl}/fly_fire/ironpet_fly_fire3.png`,
    `${baseUrl}/fly_fire/ironpet_fly_fire4.png`
  ],
  fly_groundfire: [
    `${baseUrl}/fly_groundfire/ironpet_fly_groundfire1.png`,
    `${baseUrl}/fly_groundfire/ironpet_fly_groundfire2.png`,
    `${baseUrl}/fly_groundfire/ironpet_fly_groundfire3.png`,
    `${baseUrl}/fly_groundfire/ironpet_fly_groundfire4.png`
  ],
  fly_speedup: [
    `${baseUrl}/fly_speedup/ironpet_fly_speedup1.png`,
    `${baseUrl}/fly_speedup/ironpet_fly_speedup2.png`,
    `${baseUrl}/fly_speedup/ironpet_fly_speedup3.png`,
    `${baseUrl}/fly_speedup/ironpet_fly_speedup4.png`
  ],
  fly_downhill: [
    `${baseUrl}/fly_downhill/ironpet_fly_downhill1.png`,
    `${baseUrl}/fly_downhill/ironpet_fly_downhill2.png`,
    `${baseUrl}/fly_downhill/ironpet_fly_downhill3.png`,
    `${baseUrl}/fly_downhill/ironpet_fly_downhill4.png`
  ]
};

export const animationConfig = {
  idle: { loop: true, speed: 600, frames: 3 },
  walk: { loop: true, speed: 200, frames: 4 },
  run: { loop: true, speed: 120, frames: 4 },
  jump: { loop: false, speed: 150, frames: 4 },
  fire: { loop: false, speed: 120, frames: 4 },
  punch: { loop: false, speed: 100, frames: 4 },
  fly: { loop: true, speed: 180, frames: 4 },
  fly_fire: { loop: false, speed: 130, frames: 4 },
  fly_groundfire: { loop: false, speed: 140, frames: 4 },
  fly_speedup: { loop: true, speed: 80, frames: 4 },
  fly_downhill: { loop: true, speed: 160, frames: 4 }
};