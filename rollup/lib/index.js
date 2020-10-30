!(function (e, t) { typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = t(require('react')) : typeof define === 'function' && define.amd ? define(['react'], t) : (e = e || self).LGE = t(e.React); }(this, ((e) => {
  const t = 'default' in e ? e.default : e; function r() { return (r = Object.assign || function (e) { for (let t = 1; t < arguments.length; t++) { const r = arguments[t]; for (const o in r)Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]); } return e; }).apply(this, arguments); } function o(e, t) { return (function (e) { if (Array.isArray(e)) return e; }(e)) || (function (e, t) { if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(e))) return; const r = []; let o = !0; let n = !1; let l = void 0; try { for (var a, f = e[Symbol.iterator](); !(o = (a = f.next()).done) && (r.push(a.value), !t || r.length !== t); o = !0); } catch (e) { n = !0, l = e; } finally { try { o || f.return == null || f.return(); } finally { if (n) throw l; } } return r; }(e, t)) || (function (e, t) { if (!e) return; if (typeof e === 'string') return n(e, t); let r = Object.prototype.toString.call(e).slice(8, -1); r === 'Object' && e.constructor && (r = e.constructor.name); if (r === 'Map' || r === 'Set') return Array.from(e); if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return n(e, t); }(e, t)) || (function () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }()); } function n(e, t) { (t == null || t > e.length) && (t = e.length); for (var r = 0, o = new Array(t); r < t; r++)o[r] = e[r]; return o; } return {
    Alpha() { const r = o(e.useState(0), 2); const n = r[0]; const l = r[1]; return t.createElement('button', { onClick() { return l(n + 1); } }, 'Clicked', n, ' ', 'times'); },
    MyContext: t.createContext({}),
    CheckOn(t) {
      return e.createElement('svg', { width: 30, height: 30, ...t }, e.createElement('defs', null, e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '91.272%', gradientTransform: 'matrix(.7541 .62324 -.60098 .78203 .327 -.178)', id: 'check-on_svg__a',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '28.096%' }), e.createElement('stop', { stopColor: '#D6D6D6', offset: '55.752%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' })), e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '91.329%', gradientTransform: 'scale(.96329 1) rotate(38.524 .425 .396)', id: 'check-on_svg__b',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '28.096%' }), e.createElement('stop', { stopColor: '#D6D6D6', offset: '55.752%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' }))), e.createElement('g', { transform: 'translate(-306 -288)', fill: 'none', fillRule: 'evenodd' }, e.createElement('rect', {
        width: 28, height: 27, rx: 3, transform: 'translate(307 289)', fill: 'url(#check-on_svg__a)',
      }), e.createElement('rect', {
        fill: '#7ED321', style: { mixBlendMode: 'multiply' }, x: 307, y: 289, width: 28, height: 27, rx: 3,
      }), e.createElement('path', { d: 'M335 292v6.528l-13.463 13.463-5.444-5.444.03-.032-4.669-4.668 4.514-4.514 4.67 4.669 12.691-12.692A3 3 0 01335 292z', fill: 'url(#check-on_svg__b)' })));
    },
    CheckOff(t) {
      return e.createElement('svg', { width: 30, height: 30, ...t }, e.createElement('defs', null, e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '91.272%', gradientTransform: 'matrix(.7541 .62324 -.60098 .78203 .327 -.178)', id: 'check-off_svg__a',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '28.096%' }), e.createElement('stop', { stopColor: '#D6D6D6', offset: '55.752%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' }))), e.createElement('rect', {
        width: 28, height: 27, rx: 3, transform: 'translate(1 1)', fill: 'url(#check-off_svg__a)', fillRule: 'evenodd',
      }));
    },
    RadioOn(t) {
      return e.createElement('svg', { width: 30, height: 30, ...t }, e.createElement('defs', null, e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '95.312%', gradientTransform: 'matrix(.72213 .59683 -.53714 .80237 .316 -.175)', id: 'radio-on_svg__a',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '28.096%' }), e.createElement('stop', { stopColor: '#D6D6D6', offset: '55.752%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' })), e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '97.074%', gradientTransform: 'matrix(.70903 .586 -.51274 .81032 .313 -.173)', id: 'radio-on_svg__b',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '40.81%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' }))), e.createElement('g', { transform: 'translate(-306 -255)', fill: 'none', fillRule: 'evenodd' }, e.createElement('ellipse', {
        cx: 15, cy: 13.5, rx: 15, ry: 13.5, transform: 'translate(306 256)', fill: 'url(#radio-on_svg__a)',
      }), e.createElement('ellipse', {
        fill: '#7ED321', style: { mixBlendMode: 'multiply' }, cx: 321, cy: 269.5, rx: 15, ry: 13.5,
      }), e.createElement('path', { d: 'M331.977 259.167c1.961 1.908 3.327 4.35 3.82 7.07l-13.746 13.744-5.444-5.444.03-.032-4.669-4.668 4.514-4.514 4.67 4.669z', fill: 'url(#radio-on_svg__b)' })));
    },
    RadioOff(t) {
      return e.createElement('svg', { width: 30, height: 30, ...t }, e.createElement('defs', null, e.createElement('radialGradient', {
        cx: '41.692%', cy: '37.355%', fx: '41.692%', fy: '37.355%', r: '93.279%', gradientTransform: 'matrix(.73787 .60983 -.56777 .79253 .321 -.177)', id: 'radio-off_svg__a',
      }, e.createElement('stop', { stopColor: '#FFF', offset: '0%' }), e.createElement('stop', { stopColor: '#FFF', offset: '28.096%' }), e.createElement('stop', { stopColor: '#D6D6D6', offset: '55.752%' }), e.createElement('stop', { stopColor: '#989898', offset: '100%' }))), e.createElement('ellipse', {
        cx: 14.5, cy: 13.5, rx: 14.5, ry: 13.5, transform: 'translate(0 1)', fill: 'url(#radio-off_svg__a)', fillRule: 'evenodd',
      }));
    },
  };
})));
