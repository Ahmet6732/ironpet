// Mock sprite data for ironpet animations
// This will be replaced with actual ironpet sprite images later

export const mockSprites = {
  idle: [
    'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Idle1',
    'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Idle2',
    'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Idle3',
    'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Idle4'
  ],
  walk: [
    'https://via.placeholder.com/100x100/059669/FFFFFF?text=Walk1',
    'https://via.placeholder.com/100x100/059669/FFFFFF?text=Walk2',
    'https://via.placeholder.com/100x100/059669/FFFFFF?text=Walk3',
    'https://via.placeholder.com/100x100/059669/FFFFFF?text=Walk4'
  ],
  run: [
    'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Run1',
    'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Run2',
    'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Run3',
    'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=Run4'
  ],
  jump: [
    'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Jump1',
    'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Jump2',
    'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Jump3',
    'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=Jump4'
  ],
  fire: [
    'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Fire1',
    'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Fire2',
    'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Fire3',
    'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Fire4'
  ],
  punch: [
    'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Punch1',
    'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Punch2',
    'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Punch3',
    'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Punch4'
  ],
  fly: [
    'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=Fly1',
    'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=Fly2',
    'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=Fly3',
    'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=Fly4'
  ],
  fly_fire: [
    'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=FlyFire1',
    'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=FlyFire2',
    'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=FlyFire3',
    'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=FlyFire4'
  ],
  fly_groundfire: [
    'https://via.placeholder.com/100x100/F97316/FFFFFF?text=FlyGF1',
    'https://via.placeholder.com/100x100/F97316/FFFFFF?text=FlyGF2',
    'https://via.placeholder.com/100x100/F97316/FFFFFF?text=FlyGF3',
    'https://via.placeholder.com/100x100/F97316/FFFFFF?text=FlyGF4'
  ],
  fly_speedup: [
    'https://via.placeholder.com/100x100/10B981/FFFFFF?text=FlySpeed1',
    'https://via.placeholder.com/100x100/10B981/FFFFFF?text=FlySpeed2',
    'https://via.placeholder.com/100x100/10B981/FFFFFF?text=FlySpeed3',
    'https://via.placeholder.com/100x100/10B981/FFFFFF?text=FlySpeed4'
  ],
  fly_downhill: [
    'https://via.placeholder.com/100x100/84CC16/FFFFFF?text=FlyDown1',
    'https://via.placeholder.com/100x100/84CC16/FFFFFF?text=FlyDown2',
    'https://via.placeholder.com/100x100/84CC16/FFFFFF?text=FlyDown3',
    'https://via.placeholder.com/100x100/84CC16/FFFFFF?text=FlyDown4'
  ]
};

export const animationConfig = {
  idle: { loop: true, speed: 500, frames: 4 },
  walk: { loop: true, speed: 200, frames: 4 },
  run: { loop: true, speed: 150, frames: 4 },
  jump: { loop: false, speed: 100, frames: 4 },
  fire: { loop: false, speed: 120, frames: 4 },
  punch: { loop: false, speed: 100, frames: 4 },
  fly: { loop: true, speed: 200, frames: 4 },
  fly_fire: { loop: false, speed: 120, frames: 4 },
  fly_groundfire: { loop: false, speed: 120, frames: 4 },
  fly_speedup: { loop: true, speed: 100, frames: 4 },
  fly_downhill: { loop: true, speed: 180, frames: 4 }
};