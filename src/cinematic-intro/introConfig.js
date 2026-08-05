/**
 * Centralized Configuration for Cinematic Interactive Introduction
 */
export const INTRO_CONFIG = {
  // Proximity Activation Distances (in pixels)
  KEY_LOCK_PROXIMITY_RADIUS: 65,      // Radius to snap key to lock
  KEY_LOCK_MOBILE_RADIUS: 85,        // Touch-friendly radius for mobile
  TORCH_IGNITE_PROXIMITY_RADIUS: 70,  // Radius between cursor flambeau and stationary torch
  TORCH_IGNITE_MOBILE_RADIUS: 90,     // Mobile touch radius
  CAMPFIRE_PROXIMITY_RADIUS: 75,      // Radius around campfire to begin ignition
  CAMPFIRE_MOBILE_RADIUS: 95,

  // Animation & Interaction Durations (in milliseconds)
  DOOR_UNLOCK_DURATION: 1200,         // Key rotation & lock opening
  DOOR_OPEN_DURATION: 1600,           // Heavy door swing opening
  CAMERA_WALK_THROUGH_DURATION: 1400, // Move into doorway
  LIGHT_APPROACH_DURATION: 2800,      // Distant light approaching
  WHITE_FLASH_DURATION: 1800,         // White screen hold & transition back to dark
  CAMPFIRE_IGNITION_HOLD_TIME: 1500,  // Time torch must stay near campfire to ignite
  HOMEPAGE_ILLUMINATION_DURATION: 14000,// 14s ultra-slow cinematic light pool expansion across page

  // Physics & Movement Tuning
  POINTER_SMOOTHING_FACTOR: 0.18,     // Lerp factor for cursor flambeau (0.1 = lazy, 0.3 = fast)
  SCROLL_SENSITIVITY: 0.8,            // Sensitivity for door scene scroll exploration

  // Visual Radii (in pixels)
  TORCH_SPOTLIGHT_RADIUS_DESKTOP: 240,// Size of spotlight around lit torch on dark page
  TORCH_SPOTLIGHT_RADIUS_MOBILE: 180,

  // Reduced Motion Settings
  REDUCED_MOTION: {
    DOOR_OPEN_DURATION: 800,
    LIGHT_APPROACH_DURATION: 1200,
    WHITE_FLASH_DURATION: 800,
    HOMEPAGE_ILLUMINATION_DURATION: 1200,
  }
}
