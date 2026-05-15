/**
 * Auto-register all 10 accent systems by importing this module.
 * Side-effect: each child module calls registerAccent() on load.
 */
export { default as lightingCct }     from './lighting-cct.js';
export { default as lightingRgb }     from './lighting-rgb.js';
export { default as hvacTemperature } from './hvac-temperature.js';
export { default as hvacCo2 }         from './hvac-co2.js';
export { default as shadesPosition }  from './shades-position.js';
export { default as humidity }        from './humidity.js';
export { default as powerLoad }       from './power-load.js';
export { default as batterySoc }      from './battery-soc.js';
export { default as alarmLevel }      from './alarm-level.js';
export { default as pvGeneration }    from './pv-generation.js';
