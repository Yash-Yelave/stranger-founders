/**
 * Centralized Configuration for the Door + Key + Box Cinematic Overlay
 */
export const DOOR_INTRO_CONFIG = {
  // Proximity & Interaction Radii
  LOCK_ACTIVATION_RADIUS: 90,
  LOCK_MOBILE_ACTIVATION_RADIUS: 110,
  
  // Timings (in milliseconds)
  BOX_OPEN_DURATION: 600,
  KEY_REVEAL_DELAY: 300,
  AUTO_RETURN_DELAY: 400,
  KEY_SNAP_DURATION: 500,
  LOCK_TURN_DURATION: 700,
  LATCH_RELEASE_DURATION: 400,
  DOOR_PAUSE_BEFORE_OPEN: 300,
  DOOR_OPEN_DURATION: 1200,
  CAMERA_ENTER_DURATION: 1000,
  HANDOFF_CROSSFADE_DURATION: 600,

  // Physics & Interpolation
  POINTER_LERP_FACTOR: 0.12,
  KEY_DRAG_LERP_FACTOR: 0.14,
  SCROLL_SENSITIVITY: 0.0018,

  // Storage Box Data (4 unique atmospheric containers with staggered organic layout)
  BOXES: [
    {
      id: 'box-wood-1',
      title: 'Aged Oak Trunk',
      type: 'wooden-trunk',
      hasKey: false,
      content: 'envelope',
      x: 5,  // % from left
      y: 12  // % from top
    },
    {
      id: 'box-leather-key',
      title: 'Founder Travel Case',
      type: 'leather-case',
      hasKey: true,
      content: 'key',
      x: 52,
      y: 22
    },
    {
      id: 'box-wood-2',
      title: 'Carved Cedar Cask',
      type: 'cedar-cask',
      hasKey: false,
      content: 'photograph',
      x: 18,
      y: 62
    },
    {
      id: 'box-metal-1',
      title: 'Brass Document Vault',
      type: 'metal-vault',
      hasKey: false,
      content: 'seal',
      x: 74,
      y: 56
    }
  ],

  // Accessibility / Reduced Motion
  REDUCED_MOTION: {
    DOOR_OPEN_DURATION: 600,
    CAMERA_ENTER_DURATION: 500
  }
}
