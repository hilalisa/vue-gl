import VglGeometry from './vgl-geometry.js';
import { TorusBufferGeometry } from './three.js';
import { number } from './validators.js';

export default {
  mixins: [VglGeometry],
  props: {
    radius: { type: number, default: 1 },
    tube: { type: number, default: 0.4 },
    radialSegments: { type: number, default: 8 },
    tubularSegments: { type: number, default: 6 },
    arc: { type: number, default: Math.PI * 2 },
  },
  computed: {
    inst() {
      return new TorusBufferGeometry(
        parseFloat(this.radius),
        parseFloat(this.tube),
        parseInt(this.radialSegments, 10),
        parseInt(this.tubularSegments, 10),
        parseFloat(this.arc),
      );
    },
  },
};