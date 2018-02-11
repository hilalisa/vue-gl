import VglExtrudeGeometry from './vgl-extrude-geometry.js';
import { TextBufferGeometry, BufferGeometry, FontLoader } from './three.js';
import { validatePropNumber, validatePropString, validatePropBoolean } from './utils.js';
import { fonts } from './object-stores.js';

export default {
  mixins: [VglExtrudeGeometry],
  props: {
    font: validatePropString,
    size: { type: validatePropNumber, default: 100 },
    height: { type: validatePropNumber, default: 50 },
    curveSegments: { type: validatePropNumber, default: 12 },
    bevelEnabled: validatePropBoolean,
    bevelThickness: { type: validatePropNumber, default: 10 },
    bevelSize: { type: validatePropNumber, default: 8 },
    bevelSegments: { type: validatePropNumber, default: 3 },
    text: { type: validatePropString, default: '' },
  },
  data() { return { f: undefined }; },
  computed: {
    inst() {
      return this.f !== undefined ? new TextBufferGeometry(this.text, {
        font: fonts[this.f],
        size: parseFloat(this.size),
        height: parseFloat(this.height),
        curveSegments: parseInt(this.curveSegments, 10),
        bevelEnabled: this.bevelEnabled,
        bevelThickness: parseFloat(this.bevelThickness),
        bevelSize: parseFloat(this.bevelSize),
        bevelSegments: parseInt(this.bevelSegments, 10),
      }) : new BufferGeometry();
    },
  },
  watch: {
    font: {
      handler(src) {
        if (!fonts[src]) {
          fonts[src] = [() => { if (src === this.font) this.f = src; }];
          if (!/^data:.*?(?:;base64)?,.*$/.test(src)) {
            // GET src data manually and pass as a data URI.
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
              new FontLoader().load(`data:,${encodeURIComponent(xhr.responseText)}`, (font) => {
                const queue = fonts[src];
                fonts[src] = font;
                queue.forEach((f) => { f(); });
              });
            }, false);
            xhr.open('GET', src);
            xhr.send();
          } else {
            new FontLoader().load(src, (font) => {
              const queue = fonts[src];
              fonts[src] = font;
              queue.forEach((f) => { f(); });
            });
          }
        } else if (fonts[src].isFont) {
          this.f = src;
        } else {
          fonts[src].push(() => { if (src === this.font) this.f = src; });
        }
      },
      immediate: true,
    },
  },
};