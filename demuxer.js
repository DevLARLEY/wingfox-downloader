const { EventEmitter } = require('events');
const timerEventEmitter = new EventEmitter();

/*
WingFox WASM Decrytor Demuxer
Author: github.com/DevLARLEY
For poly-wasm-player.js build '2024-1-22 14:53:22'
*/

class A {
  constructor() {
    this.map_ = {}
  }
  push(e, t) {
    Object.prototype.hasOwnProperty.call(this.map_, e) ? this.map_[e].push(t) : this.map_[e] = [t]
  }
  get(e) {
    let t = this.map_[e];
    return t ? t.slice() : null
  }
  getAll() {
    let e = [];
    for (let t in this.map_) e.push.apply(e, this.map_[t]);
    return e
  }
  remove(e, t) {
    let n = this.map_[e];
    if (n) for (let e = 0; e < n.length; ++e) n[e] == t && (n.splice(e, 1), --e)
  }
  clear() {
    this.map_ = {}
  }
  forEach(e) {
    for (let t in this.map_) e(t, this.map_[t])
  }
}
class D {
  constructor(e, t, n) {
    this.target = e,
    this.type = t,
    this.listener = n,
    this.target.addEventListener ? this.target.addEventListener(t, n, !1) : this.target.on && this.target.on(t, n, !1)
  }
  off() {
    this.target.removeEventListener ? this.target.removeEventListener(this.type, this.listener, !1) : this.target.off && this.target.off(this.type, this.listener, !1),
    this.target = null,
    this.listener = null
  }
}
class O {
  constructor() {
    this.bindingMap_ = new A
  }
  destroy() {
    this.removeAll(),
    this.bindingMap_ = null
  }
  on(e, t, n) {
    if (!this.bindingMap_) return;
    let r = new D(e, t, n);
    return this.bindingMap_.push(t, r),
    this
  }
  once(e, t, n) {
    this.on(e, t,
    function(r) {
      this.off(e, t),
      n(r)
    }.bind(this))
  }
  off(e, t) {
    if (!this.bindingMap_) return;
    let n = this.bindingMap_.get(t) || [];
    for (let r = 0; r < n.length; ++r) {
      let i = n[r];
      i.target == e && (i.off(), this.bindingMap_.remove(t, i))
    }
  }
  removeAll() {
    if (!this.bindingMap_) return;
    let e = this.bindingMap_.getAll();
    for (let t = 0; t < e.length; ++t) e[t].off();
    this.bindingMap_.clear()
  }
}
r = {
  DATA: "DATA",
  DEMUX_DATA: "DEMUX_DATA",
  DONE: "DONE",
  ERROR: "ERROR",
  INFO: "INFO"
}
var p = Object.create || function(e) {
  var t = function() {};
  return t.prototype = e,
  new t
}
function B(e, t) {
  for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
  return n
}
class b {
  constructor() {
    this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = p(null), this._eventsCount = 0),
    this._maxListeners = this._maxListeners || void 0
  }
  static listenerCount(e, t) {
    return "function" == typeof e.listenerCount ? e.listenerCount(t) : _.call(e, t)
  }
  emit(e, ...t) {
    var n, r, i, a, o, s, u = "error" === e;
    if (s = this._events) u = u && null == s.error;
    else if (!u) return ! 1;
    if (u) {
      if (arguments.length > 1 && (n = arguments[1]), n instanceof Error) throw n;
      var l = new Error('Unhandled "error" event. (' + n + ")");
      throw l.context = n,
      l
    }
    if (! (r = s[e])) return ! 1;
    var c = "function" == typeof r;
    switch (i = arguments.length) {
    case 1:
      !
      function(e, t, n) {
        if (t) e.call(n);
        else for (var r = e.length,
        i = B(e, r), a = 0; a < r; ++a) try {
          i[a].call(n)
        } catch(e) {
          console.error(e)
        }
      } (r, c, this);
      break;
    case 2:
      !
      function(e, t, n, r) {
        if (t) e.call(n, r);
        else for (var i = e.length,
        a = B(e, i), o = 0; o < i; ++o) try {
          a[o].call(n, r)
        } catch(e) {
          console.error(e)
        }
      } (r, c, this, arguments[1]);
      break;
    case 3:
      !
      function(e, t, n, r, i) {
        if (t) e.call(n, r, i);
        else for (var a = e.length,
        o = B(e, a), s = 0; s < a; ++s) try {
          o[s].call(n, r, i)
        } catch(e) {
          console.error(e)
        }
      } (r, c, this, arguments[1], arguments[2]);
      break;
    case 4:
      !
      function(e, t, n, r, i, a) {
        if (t) e.call(n, r, i, a);
        else for (var o = e.length,
        s = B(e, o), u = 0; u < o; ++u) try {
          s[u].call(n, r, i, a)
        } catch(e) {
          console.error(e)
        }
      } (r, c, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      for (a = new Array(i - 1), o = 1; o < i; o++) a[o - 1] = arguments[o]; !
      function(e, t, n, r) {
        if (t) e.apply(n, r);
        else for (var i = e.length,
        a = B(e, i), o = 0; o < i; ++o) try {
          a[o].apply(n, r)
        } catch(e) {
          console.error(e)
        }
      } (r, c, this, a)
    }
    return ! 0
  }
  on(e, t) {
    return function(e, t, n) {
      var r, i, a;
      if ("function" != typeof n) throw new TypeError('"listener" argument must be a function'); (i = e._events) ? (i.newListener && (e.emit("newListener", t, n.listener ? n.listener: n), i = e._events), a = i[t]) : (i = e._events = p(null), e._eventsCount = 0);
      if (a) {
        if ("function" == typeof a ? a = i[t] = [a, n] : a.push(n), !a.warned && (r = void 0 === (o = e)._maxListeners ? b.defaultMaxListeners: o._maxListeners) && r > 0 && a.length > r) {
          a.warned = !0;
          class n extends Error {}
          let r = new n("Possible Dispatcher memory leak detected. " + a.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
          r.name = "MaxListenersExceededWarning",
          r.emitter = e,
          r.type = t,
          r.count = a.length,
          "object" == typeof console && console.warn && console.warn("%s: %s", r.name, r.message)
        }
      } else a = i[t] = n,
      ++e._eventsCount;
      var o;
      return e
    } (this, e, t)
  }
  once(e, t) {
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    return this.on(e,
    function(e, t, n) {
      var r = {
        fired: !1,
        wrapFn: void 0,
        target: e,
        type: t,
        listener: n
      },
      i = v.call(P, r);
      return i.listener = n,
      r.wrapFn = i,
      i
    } (this, e, t)),
    this
  }
  off(e, t) {
    return x.call(this, e, t)
  }
  removeAllListeners(e) {
    var t, n, r;
    if (! (n = this._events)) return this;
    if (!n.off) return 0 === arguments.length ? (this._events = p(null), this._eventsCount = 0) : n[e] && (0 == --this._eventsCount ? this._events = p(null) : delete n[e]),
    this;
    if (0 === arguments.length) {
      var i, a = y(n);
      for (r = 0; r < a.length; ++r)"off" !== (i = a[r]) && this.removeAllListeners(i);
      return this.removeAllListeners("off"),
      this._events = p(null),
      this._eventsCount = 0,
      this
    }
    if ("function" == typeof(t = n[e])) this.off(e, t);
    else if (t) for (r = t.length - 1; r >= 0; r--) this.off(e, t[r]);
    return this
  }
  listeners(e) {
    return w(this, e, !0)
  }
  rawListeners(e) {
    return w(this, e, !1)
  }
  listenerCount() {
    return b.listenerCount.apply(this, arguments)
  }
}
var j; !
function(e) {
  e[e.WORKER_EXCEPTION = 0] = "WORKER_EXCEPTION",
  e[e.WORKER_MSG_EXCEPTION = 1] = "WORKER_MSG_EXCEPTION",
  e[e.TS_SYNC_BYTE = 2] = "TS_SYNC_BYTE",
  e[e.FLV_HEAD_SIGNATURE = 3] = "FLV_HEAD_SIGNATURE",
  e[e.FLV_NOT_EXPECTED_ADJACENT_DATA = 4] = "FLV_NOT_EXPECTED_ADJACENT_DATA"
} (j || (j = {}));
var z = j;
function W(e) {
  let t = 0;
  return ArrayBuffer.isView(e) && (t = e.byteOffset, e = e.buffer),
  new DataView(e, t)
}
class V {
  constructor() {}
  readUint8(e, t) {
    return W(e).getUint8(t)
  }
  readUint16(e, t, n = !1) {
    return W(e).getUint16(t, n)
  }
  readUint32(e, t, n = !1) {
    return W(e).getUint32(t, n)
  }
}
class X extends V {
  constructor(e) {
    super(),
    this.table_id = e[0],
    this.section_syntax_indicator = e[1] >> 7,
    this.section_length = (15 & e[1]) << 8 | e[2],
    this.transport_stream_id = this.readUint16(e, 3),
    this.version_number = e[5] >> 1 & 31,
    this.current_next_indicator = e[5] && 1,
    this.section_number = e[6],
    this.last_section_number = e[7],
    this.network_PID = 0;
    var t, n = 0,
    r = this.section_length - 4 - 5;
    for (this.pmtTable = []; n < r; n += 4) 0 == (t = this.readUint16(e, 8 + n)) ? (this.network_PID = (31 & e[10 + n]) << 8 | e[11 + n], U.log("packet->network_PID %0x /n/n", this.network_PID)) : this.pmtTable.push({
      programNum: t,
      program_map_PID: (31 & e[10 + n]) << 8 | e[11 + n]
    });
    var i = this.section_length + 3;
    this.CRC_32 = (255 & e[i - 4]) << 24 | (255 & e[i - 3]) << 16 | (255 & e[i - 2]) << 8 | 255 & e[i - 1]
  }
}
class Y extends V {
  constructor(e) {
    if (super(), this.table_id = e[0], this.section_syntax_indicator = e[1] >> 7, this.section_length = (15 & e[1]) << 8 | e[2], this.program_number = this.readUint16(e, 3), this.version_number = e[5] >> 1 & 31, this.current_next_indicator = e[5] && 1, this.section_number = e[6], this.last_section_number = e[7], this.PCR_PID = (31 & e[8]) << 8 | e[9], this.program_info_length = (15 & e[10]) << 8 | e[11], this.program_info_length < 0) return;
    if (this.program_info_length > 2) {
      let t = 0;
      for (; t < this.program_info_length;) {
        t += e[13 + t]
      }
    }
    var t = 12 + this.program_info_length,
    n = this.section_length - this.program_info_length - 9 - 4,
    r = t + n;
    if (t >= r) return void U.warn(`es_section_pos < es_section_end $ {
      t
    },
    $ {
      r
    }`);
    this.pes_table = [];
    let i = 0;
    for (; i < n;) {
      let n = e[t + i],
      r = 8191 & this.readUint16(e, t + i + 1),
      a = 4095 & this.readUint16(e, t + i + 3);
      if (this.pes_table.push({
        streamType: n,
        PID: r
      }), a > 2) {
        let n = 0,
        r = t + i + 5;
        for (; n < a;) {
          n += e[r + n]
        }
      }
      i += a + 5
    }
    var a = this.section_length + 3;
    this.CRC_32 = (255 & e[a - 4]) << 24 | (255 & e[a - 3]) << 16 | (255 & e[a - 2]) << 8 | 255 & e[a - 1]
  }
  parse() {}
}
var E = Object.prototype.toString;
function S(e) {
  return !! e && "object" == typeof e
}
function C(e) {
  return "number" == typeof e && !isNaN(e)
}
function R(e) {
  return S(e) && "[object arraybuffer]" === E.call(e).toLowerCase()
}
class L {
  constructor() {
    this.list_ = []
  }
  get byteLength() {
    if (!C(this.byteLength_)) {
      let e = 0;
      for (let t, n = 0; n < this.list_.length; n++) t = this.list_[n],
      e += t.byteLength;
      this.byteLength_ = e
    }
    return this.byteLength_
  }
  get bytes() {
    const {
      bufferList: e
    } = this;
    let t = null;
    return e.length > 0 && (t = 0 === e.length ? e[0] : this.toNewBytes()),
    t
  }
  get empty() {
    return 0 === this.list_.length
  }
  get bufferList() {
    return this.list_
  }
  clear() {
    let e = this.list_.length;
    e > 0 && this.list_.splice(0, e),
    this.byteLength_ = null
  }
  toNewBytes() {
    let e = null,
    t = 0;
    for (; null === e;) try {
      t++,
      e = new Uint8Array(this.byteLength)
    } catch(e) {
      if (t > 50) throw e
    }
    for (let t = 0, n = 0; t < this.list_.length; t++) {
      let r = this.list_[t];
      e.set(r, n),
      n += r.byteLength
    }
    return e
  }
  append(e) {
    e instanceof L ? this.list_ = this.list_.concat(e.bufferList) : this.list_.push(e),
    this.byteLength_ = null
  }
  cut(e, t = !0) {
    let n = null;
    if (e > 0 && !this.empty) {
      let r = this.list_,
      i = 0,
      a = 0;
      for (; r.length > 0;) {
        let o = r.shift();
        if (0 !== a) {
          let a = e - i;
          if (o.byteLength >= a) {
            t && n.set(o.subarray(0, a), i),
            o = o.subarray(a),
            o.byteLength > 0 && r.unshift(o);
            break
          }
          t && n.set(o, i),
          i += o.byteLength;
          break
        }
        if (o.byteLength >= e) {
          t && (n = o.subarray(0, e)),
          o.byteLength > e && (o = o.subarray(e), r.unshift(o));
          break
        }
        if (t) {
          try {
            n = new Uint8Array(e)
          } catch(t) {
            throw`alloc_memory_error@ cache buffer: ${e} ${t.message}`
          }
          n.set(o, 0)
        }
        i += o.byteLength,
        a++
      }
      this.byteLength_ = null
    }
    return n
  }
}
class G extends V {
  constructor(e) {
    super(),
    this.table_id = e[0],
    this.section_syntax_indicator = e[1] >> 7,
    this.section_length = (15 & e[1]) << 8 | e[2],
    this.transport_stream_id = this.readUint16(e, 3),
    this.version_number = e[5] >> 1 & 31,
    this.current_next_indicator = 1 & e[5],
    this.section_number = e[6],
    this.last_section_number = e[7],
    this.original_network_id = this.readUint16(e, 8);
    let t = this.section_length - 8 - 4;
    this.service_table = [];
    let n = 0;
    for (; n < t;) {
      let t = 0,
      r = {
        service_id: this.readUint16(e, 11),
        EIT_schedule_flag: 2 & e[13],
        EIT_present_following_flag: 1 & e[13],
        running_status: e[14] >> 5,
        free_CA_mode: e[14] >> 4 & 1,
        descriptors_loop_length: (15 & e[14]) << 8 | e[15],
        provider_name: "",
        name: ""
      };
      for (; t < r.descriptors_loop_length;) {
        let n = 16 + t,
        i = e[n],
        a = e[n + 1];
        switch (i) {
        case 72:
          {
            let t = [],
            i = e[n + 3],
            a = 0,
            o = 0,
            s = n + 4;
            for (a = 0; a < i; a++) t.push(String.fromCharCode(e[s])),
            s += 1;
            r.provider_name = t.join("");
            let u = [],
            l = e[s];
            for (s += 1, o = 0; o < l; o++) u.push(String.fromCharCode(e[s])),
            s += 1;
            r.name = u.join("")
          }
          break;
        default:
          U.warn("sdt section unhandled descriptor_tag " + i)
        }
        t += 2 + a
      }
      this.service_table.push(r),
      n += 5 + r.descriptors_loop_length
    }
  }
}
class $ {}
class K {
  constructor(e) {
    this.context = e,
    this.metadata = new $,
    this.pat_table = [],
    this.pes_streams = []
  }
  get currentProgramPID() {
    let e = [];
    for (let t = 0; t < this.pat_table.length; t++) e.push(this.pat_table[t].pid);
    return e.length > 0 ? e[0] : -1
  }
  reset() {
    this.metadata = new $,
    this.pat_table.splice(0, this.pat_table.length),
    this.pes_streams.splice(0, this.pes_streams.length)
  }
  parse(e) {
    0 === e.PID ? this._parsePat(e) : 1 === e.PID || 2 === e.PID || 3 <= e.PID && e.PID <= 15 || (17 === e.PID ? this._parseSdt(e) : e.PID === this.currentProgramPID && this._parsePmt(e))
  }
  findTrack(e) {
    let t = null,
    n = this.pes_streams;
    for (let r = 0; r < n.length; r++) if (n[r].id === e) {
      t = n[r];
      break
    }
    return t
  }
  _parsePat(e) {
    let t;
    if (e.payload_unit_start_indicator) {
      let n = e.payload[0];
      t = e.payload.subarray(n + 1)
    } else t = e.payload;
    let n = new X(t);
    for (var r = 0; r < n.pmtTable.length; r++) this._add_pid_to_pmt(n.pmtTable[r].programNum, n.pmtTable[r].program_map_PID);
    return n
  }
  _add_pid_to_pmt(e, t) {
    let n = this.pat_table; (function(e) {
      for (let t, r = 0; r < n.length; r++) if (t = n[r], t.id === e) return {
        idx: r,
        item: t
      };
      return null
    })(e) || n.push({
      id: e,
      pid: t
    })
  }
  _parsePmt(e) {
    let t;
    if (e.payload_unit_start_indicator) {
      let n = e.payload[0];
      t = e.payload.subarray(n + 1)
    } else t = e.payload;
    let n = new Y(t);
    for (var r = 0; r < n.pes_table.length; r++) this._add_pes_stream(n.pes_table[r], n);
    return n
  }
  _add_pes_stream(e, t) {
    let n = this.pes_streams; (function(e) {
      for (let t, r = 0; r < n.length; r++) if (t = n[r], t.id === e) return {
        idx: r,
        item: t
      };
      return null
    })(e.PID) || n.push({
      id: e.PID,
      stream_type: e.streamType,
      pcr_pid: t.PCR_PID,
      duration: 0,
      sps: [],
      pps: [],
      pixelRatio: [1, 1],
      timescale: 9e4,
      width: 0,
      height: 0
    })
  }
  _parseSdt(e) {
    let t;
    if (e.payload_unit_start_indicator) {
      let n = e.payload[0];
      t = e.payload.subarray(n + 1)
    } else t = e.payload;
    let n = new G(t);
    return n.service_table.length > 0 && (this.metadata.service_name = n.service_table[0].name, this.metadata.service_provider = n.service_table[0].provider_name),
    n
  }
}
//let M = "undefined" == typeof window ? self: window;
let M = false;
let I = M.console;
//const N = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && "undefined" != typeof importScripts;
let N = false;
let U = new class extends b {
  constructor() {
    super(),
    this._enable = !1
  }
  get enable() {
    return this._enable
  }
  set enable(e) {
    this._enable = e,
    this.MSG_NAME = "__log__"
  }
  log(...e) {
    //N ? U.emit(this.MSG_NAME, "log", [...e].join("")) : this._enable && I.log.call(I, ">>>", ...e)
    console.log("[LOG]", [...e].join(""));
  }
  debug(...e) {
    //N ? U.emit(this.MSG_NAME, "debug", [...e].join("")) : this._enable && I.debug && I.debug.call(I, ">>>", ...e)
    console.log("[DEBUG]", [...e].join(""));
  }
  assert(...e) {
    if (this._enable && I.assert) {
      let t = e[0],
      n = Array.prototype.slice.call(e, 1);
      n.unshift(">>>"),
      I.assert.call(I, t, ...n)
    }
  }
  warn(...e) {
    //N ? U.emit(this.MSG_NAME, "warn", [...e].join("")) : this._enable && I.warn.call(I, ">>>", ...e)
    console.log("[WARN]", [...e].join(""));
  }
  error(...e) {
    //N ? U.emit(this.MSG_NAME, "error", [...e].join("")) : this._enable && I.error.call(I, ">>>", ...e)
    console.log("[ERROR]", [...e].join(""));
  }
};
class F extends b {
  constructor() {
    super()
  }
  pipe(e) {
    return this.on("reset", (function() {
      e.reset()
    })),
    this.on("data", (function(t) {
      e.push(t)
    })),
    this.on("done", (function(t) {
      e.flush(t)
    })),
    e
  }
  unpipe() {
    return this.removeAllListeners("reset"),
    this.removeAllListeners("data"),
    this.removeAllListeners("done"),
    this
  }
  push(e, t) {
    this.emit("data", e)
  }
  flush(e) {
    this.emit("done", e)
  }
  reset() {
    this.emit("reset")
  }
}
class T extends b {}
class H extends F {
  constructor(e = {}) {
    super(),
    e.debug && (U.enable = !0),
    this.ctx_ = new T,
    this.options_ = e,
    this.cache_buffer_ = new L
  }
  listenEndStream_() {
    this.eventManager_ = new O,
    this.eventManager_.on(this.endStream, "data", e =>{
      //this.emit(r.DEMUX_DATA, e)
      setTimeout(() => {
        timerEventEmitter.emit(r.DEMUX_DATA, e);
      }, 1);
    }).on(this.endStream, "done", e =>{
      //this.emit(r.DONE, e);
      setTimeout(() => {
        timerEventEmitter.emit(r.DONE, e);
      }, 1);
    }).on(this.ctx_, "error", e =>{
      this.emit(r.ERROR, e)
    })
  }
  constraintPushData_(e) {
    let t = null;
    return R(e) || S(n = e) && "[object uint8array]" === E.call(n).toLowerCase() ? (t = R(e) ? new Uint8Array(e) : e, t) : (U.error("Data pushed is not an ArrayBuffer or Uint8Array: " + e), t);
    var n
  }
  reset() {}
  destroy() {
    this.unpipe(),
    this.endStream.unpipe(),
    this.eventManager_.removeAll()
  }
}
class q extends F {
  constructor(e, t) {
    super(),
    this.context = e,
    this.PSI = t,
    this.videoTrack = null,
    this.audioTrack = null,
    this.captionTrack = null
  }
  push(e) {
    let t = e;
    for (let e, n = 0; n < t.length; n++) switch (e = t[n], e.type) {
    case "video":
      // never used
      this._complexVideo(e);
      break;
    case "audio":
      // never used
      this._complexAudio(e);
      break;
    case "caption":
      this._complexCaption(e)
    }
  }
  flush() {
    this.emit("done"),
    this._clearStream()
  }
  reset() {
    this._clearStream()
  }
  _clearStream() {
    this.videoTrack = null,
    this.audioTrack = null,
    this.captionTrack = null
  }
  _complexVideo(e) {
    let t = this.PSI.findTrack(e.trackId);
    t && (t.type = "video", t.gops = e, t.firstDTS = e[0][0].dts, t.firstPTS = e[0][0].pts, t.duration = Number.POSITIVE_INFINITY, this.videoTrack = t, this.emit("data", {
      videoTrack: this.videoTrack
    }))
  }
  _complexAudio(e) {
    let t = this.PSI.findTrack(e.trackId);
    t && (t.type = "audio", t.frames = e, t.firstPTS = t.firstDTS = e[0].dts, t.duration = Number.POSITIVE_INFINITY, this.audioTrack = t, this.emit("data", {
      audioTrack: this.audioTrack
    }))
  }
  _complexCaption() {}
}
class be extends V {
  constructor(e) {
    super(),
    this.start_code_prefix = this.readUint16(e, 0) << 8 | e[2],
    this.stream_id = e[3],
    this.packet_length = this.readUint16(e, 4),
    this.data_alignment_indicator = 4 & e[6],
    this.copyright = 2 & e[6],
    this.PTS_DTS_flags = e[7] >> 6,
    this.ESCR_flag = 32 & e[7],
    this.ES_rate_flag = 16 & e[7],
    this.trick_mode_flag = 8 & e[7],
    this.additional_copy_info_flag = 4 & e[7],
    this.CRC_flag = 2 & e[7],
    this.extension_flag = 1 & e[7],
    this.header_data_length = e[8],
    this.PTS = 0,
    2 == (2 & this.PTS_DTS_flags) && (this.PTS = this.calcTimestamp_(e, 9)),
    this.DTS = this.PTS,
    1 == (1 & this.PTS_DTS_flags) && (this.DTS = this.calcTimestamp_(e, 14)),
    this.data_byte = e.subarray(9 + this.header_data_length)
  }
  calcTimestamp_(e, t) {
    return 536870912 * (14 & e[t]) + (e[t + 1] << 22) + (e[t + 2] >> 1 << 15) + (e[t + 3] << 7) + (e[t + 4] >> 1)
  }
  valid() {
    let e = this.start_code_prefix;
    return 0 === e[0] && 0 === e[1] && 1 === e[2]
  }
}
class ke extends F {
  constructor(e, t) {
    super(),
    this.context = e,
    this.PSI = t,
    this.PID = null,
    this.cache_buffer = new L
  }
  push(e) {
    const t = this;
    e.PID > 31 && e.PID < 8191 && ( - 1 == this.PSI.currentProgramPID ? t._pushPacket(e) : this.PSI.currentProgramPID !== e.PID && (1 === e.payload_unit_start_indicator && t._assembleOnePES(), t._pushPacket(e)))
  }
  flush() {
    this._assembleOnePES(),
    this.emit("done")
  }
  reset() {
    this._clearCached(),
    this.emit("reset")
  }
  _clearCached() {
    this.PID = null,
    this.cache_buffer.clear()
  }
  _pushPacket(e) {
    let t = this.cache_buffer.empty;
    t && 0 === e.payload_unit_start_indicator || (t && (this.PID = e.PID), this.cache_buffer.append(e.payload))
  }
  _assembleOnePES() {
    const e = this;
    if (!this.cache_buffer.empty) {
      let t;
      try {
        t = this.cache_buffer.toNewBytes()
      } catch(e) {
        throw "pes alloc mem err " + this.cache_buffer.byteLength
      }
      let n = new be(t),
      r = this.PSI.findTrack(this.PID);
      if (r) {
        let t = {
          pid: r.id,
          stream_type: r.stream_type,
          pcr_pid: r.pcr_pid,
          pes: n
        };
        e.emit("data", t)
      }
      e._clearCached()
    }
  }
}
class xe extends V {
  constructor(e) {
    if (super(), this.sync_byte = e[0], this.transport_error_indicator = e[1] >> 7, this.payload_unit_start_indicator = e[1] >> 6 & 1, this.transport_priority = e[1] >>> 5 & 1, this.PID = 8191 & this.readUint16(e, 1), this.tsc = e[3] >> 6, this.afc = e[3] >> 4 & 3, this.continuity_counter = 15 & e[3], this.has_payload = 1 & this.afc, this.has_adaptation = 2 & this.afc, this.has_payload) if (this.has_adaptation) {
      let t = e[4];
      this.payload = e.subarray(5 + t)
    } else this.payload = e.subarray(4)
  }
  valid() {
    return 71 === this.sync_byte && 1 === this.has_payload
  }
}
class Pe extends H {
  constructor(e = {}) {
    super(e),
    this.psi_ = new K(this.ctx_),
    this.pesStream_ = new ke(this.ctx_, this.psi_),
    this.elementaryStream_ = new me(this.ctx_, this.psi_, e),
    this.complexStream_ = new q(this.ctx_, this.psi_),
    this.pipe(this.pesStream_),
    this.pesStream_.pipe(this.elementaryStream_),
    this.elementaryStream_.pipe(this.complexStream_),
    super.listenEndStream_()
  }
  get endStream() {
    let e = this.elementaryStream_;
    return this.options_.decodeCodec && (e = this.complexStream_),
    e
  }
  push(e, t) {
    const {
      done: n
    } = t,
    {
      options_: r,
      ctx_: i,
      cache_buffer_: a,
      psi_: o
    } = this;
    let s = super.constraintPushData_(e),
    u = a.byteLength,
    l = null;
    for (r.config = t, U.log(`hls demux received ${s.byteLength} bytes, cache ${u} bytes. ${n?"chunk done":""}`), a.append(s); a.byteLength >= 188;) {
      let e = a.cut(188);
      if (e) {
        let t = new xe(e);
        if (!t.valid()) {
          let n = `Encounter invalid ts packet, packet_length(${e.length}), cache_length(${this.cache_buffer_.byteLength}), has_payload(${t.has_payload}), data(${e})`;
          U.error(n),
          this.reset(),
          i.emit("error", z.TS_SYNC_BYTE, n, {
            startByte: l,
            endByte: l + e.byteLength
          });
          break
        }
        o.parse(t),
        this.emit("data", t),
        l += e.byteLength
      }
    }
    a.empty && n && this.emit("done")
  }
  reset() {
    this.cache_buffer_.clear(),
    this.emit("reset")
  }
}
const oe = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
const se = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
class ue extends b {
  constructor() {
    super()
  }
  push(e) {
    let t,
    n,
    r,
    i,
    a,
    {
      pts: o,
      dts: s,
      payload: u
    } = e,
    l = u,
    c = 0,
    h = 0;
    for (; c + 5 < l.length;) {
      if (255 !== l[c] || 240 != (246 & l[c + 1])) {
        c++;
        continue
      }
      if (n = 2 * (1 & ~l[c + 1]), t = (3 & l[c + 3]) << 11 | l[c + 4] << 3 | (224 & l[c + 5]) >> 5, i = 1024 * (1 + (3 & l[c + 6])), a = 9e4 * i / se[(60 & l[c + 2]) >>> 2], r = c + t, l.byteLength < r) return;
      let e = {
        pts: o + h * a,
        dts: s + h * a,
        sampleCount: i,
        audioObjectType: 1 + (l[c + 2] >>> 6 & 3),
        channelCount: (1 & l[c + 2]) << 2 | (192 & l[c + 3]) >>> 6,
        sampleRate: se[(60 & l[c + 2]) >>> 2],
        samplingFrequencyIndex: (60 & l[c + 2]) >>> 2,
        sampleSize: 16,
        data: l.subarray(c + 7 + n, r)
      };
      if (this.emit("frame", e), l.byteLength === r) return l = void 0,
      void this.emit("done");
      h++,
      l = l.subarray(r)
    }
  }
}
class le extends F {
  constructor(e) {
    super(),
    this.PSI = e,
    this.trackId = null,
    this.codec = new ue,
    this.codec.on("frame", e =>{
      this.frames.push(e),
      this.frames.byteLength += e.data.byteLength,
      this.frames.trackId = this.trackId
    }),
    this._newFrames()
  }
  push(e) {
    15 === e.stream_type && (this.trackId = e.pid, this.codec.push({
      dts: e.pes.DTS,
      pts: e.pes.PTS,
      payload: e.pes.data_byte
    }))
  }
  flush() {
    if (this.frames.length > 0) {
      let e = this.frames.length,
      t = this.frames[0],
      n = this.frames[e - 1],
      r = n.sampleRate * n.sampleCount / 9e4;
      this.frames.firstDTS = t.dts,
      this.frames.firstPTS = t.pts,
      this.frames.duration = 1 === e ? r: r + (n.pts - t.pts),
      this._updateTrackMeta(t),
      this.emit("data", this.frames),
      this.reset(),
      this.emit("done")
    }
  }
  reset() {
    this.trackId = null,
    this._newFrames()
  }
  _newFrames() {
    this.frames = [],
    this.frames.type = "audio",
    this.frames.byteLength = 0,
    this.frames.duration = 0,
    this.frames.firstDTS = 0,
    this.frames.firstPTS = 0
  }
  _updateTrackMeta(e) {
    let t = this.PSI.findTrack(this.trackId),
    n = ((e, t, n) =>{
      let r,
      i,
      a = e;
      if (! (t > oe.length - 1)) return ie.FIREFOX ? t >= 6 ? (e = 5, i = new Array(4), r = t - 3) : (e = 2, i = new Array(2), r = t) : ae.android ? (e = 2, i = new Array(2), r = t) : (e = 5, i = new Array(4), t >= 6 ? r = t - 3 : (1 === n && (e = 2, i = new Array(2)), r = t)),
      i[0] = e << 3,
      i[0] |= (14 & t) >> 1,
      i[1] |= (1 & t) << 7,
      i[1] |= n << 3,
      5 === e && (i[1] |= (14 & r) >> 1, i[2] = (1 & r) << 7, i[2] |= 8, i[3] = 0),
      {
        config: i,
        sampleRate: oe[t],
        channelCount: n,
        codec: "mp4a.40." + e,
        realCodec: "mp4a.40." + a
      };
      U.error("invalid sampling index:" + t)
    })(e.audioObjectType, e.samplingFrequencyIndex, e.channelCount);
    t.config = n.config,
    t.sampleRate = n.sampleRate,
    t.inputTimeScale = t.inputTimeScale || t.timescale,
    t.timescale = n.sampleRate,
    t.channelCount = n.channelCount,
    t.codec = n.codec,
    t.realCodec = n.realCodec,
    t.isAAC = !0
  }
}
class ve extends b {
  constructor() {
    super(),
    this.cachedBytes = null
  }
  push(e) {
    let t,
    n = this,
    r = 0,
    i = 0,
    a = 0,
    {
      pts: o,
      dts: s,
      payload: u,
      naluSizeLength: l
    } = e;
    if (this.cachedBytes) {
      try {
        t = new Uint8Array(this.cachedBytes.byteLength + u.byteLength)
      } catch(e) {
        throw`h264 alloc mem error ${this.cachedBytes.byteLength}/${u.byteLength}`
      }
        t.set(this.cachedBytes),
        t.set(u,this.cachedBytes.byteLength)
      } else t = u;
      if (l) {
        let e = 0,
        r = 0,
        i = 0;
        do {
          r = 0;
          for (let n = 0; n < l; n++) r |= t[e + n] << 8 * (l - n - 1);
          e += l, i = e + r, i > t.length && (i = t.length);
          let a = t.subarray(e, i), u = new ye(a);
          u.pts = o, u.dts = s, n.emit("nalu", u), e = i
        } while ( e < t . length )
    } else {
      let e = t.byteLength - 1,
      u = 0;
      do {
        if (0 !== t[e]) break;
        u++, e--
      } while ( e > 0 );
      u >= 3 && (t = t.subarray(0, e + 1));
      do {
        let e = t[r] << 24 | t[r + 1] << 16 | t[r + 2] << 8 | t[r + 3], l = t.length - r >= 4 ? e: -1, c = 0, h = r === t.length - 1;
        if (l >> 8 == 1 ? c = 3 : 1 === l && (c = 4), 3 === c || 4 === c || h) {
          let e = i + a,
          l = h && u >= 3;
          if (r > i && (!h || l)) {
            let a = t.subarray(e, l ? r + 1 : r),
            u = new ye(a);
            u.pts = o,
            u.dts = s,
            n.emit("nalu", u),
            i = r
          }
          h && (u < 3 ? (this.cachedBytes = t.subarray(i), this.cachedBytes.pts = o, this.cachedBytes.dts = s, this.cachedBytes.startCodeLength = a) : this.cachedBytes = null),
          r === i && (a = c),
          r += c || 1
        } else r++
      } while ( r < t . length )
    }
    if (this.cachedBytes) {
      let e = new ye(this.cachedBytes.subarray(this.cachedBytes.startCodeLength));
      e.pts = this.cachedBytes.pts,
      e.dts = this.cachedBytes.dts,
      this.emit("nalu", e),
      this.cachedBytes = null
    }
    this.emit("done")
  }
  reset() {
    this.cachedBytes = null
  }
}
class ge extends F {
  constructor(e) {
    super(),
    this.PSI = e,
    this.trackId = null,
    this.currentFrame = [],
    this.codec = new ve,
    this._newGop(),
    this._newGops(),
    this.codec.on("nalu", e =>{
      if (7 === e.unit_type) {
        let t = this.PSI.findTrack(this.trackId),
        n = (e =>{
          let t = "avc1.",
          n = [e.profile_idc, e.profile_compatibility, e.level_idc];
          for (let e = 0; e < n.length; e++) {
            let r = n[e].toString(16);
            r.length < 2 && (r = "0" + r),
            t += r
          }
          return {
            codec: t
          }
        })(e.sps);
        t.codec = n.codec,
        t.width = e.sps.width,
        t.height = e.sps.height,
        t.profileIdc = e.sps.profile_idc,
        t.profileCompatibility = e.sps.profile_compatibility,
        t.levelIdc = e.sps.level_idc,
        t.pixelRatio = e.sps.pixelRatio,
        t.sps = [e.rawData]
      } else if (8 === e.unit_type) {
        this.PSI.findTrack(this.trackId).pps = [e.rawData]
      }
      this._grouping(e)
    })
  }
  push(e) {
    const {
      stream_type: t,
      pes: n,
      pid: r
    } = e;
    if (27 === t || 36 === t) {
      this.trackId = r;
      let e = {
        pts: n.PTS,
        dts: n.DTS,
        payload: n.data_byte
      };
      this.codec.push(e)
    }
  }
  flush() {
    this.currentFrame.length > 0 && ((!this.currentFrame.duration || this.currentFrame.duration <= 0) && (this.currentFrame.duration = this.prevFrame.duration || 0), this._pushFrameIntoGop(), this.currentFrame = []),
    this.gop.length > 0 && this._pushGopIntoGroup()
  }
  reset() {
    this.codec.reset(),
    this.currentFrame = [],
    this._newGop(),
    this._newGops()
  }
  _grouping(e) {
    9 === e.unit_type ? (this.currentFrame.length > 0 && (this.currentFrame.duration = e.dts - this.currentFrame.dts, this.gop.length > 0 && this.currentFrame.keyframe && (this.gop.trackId = this.trackId, this._pushGopIntoGroup()), this.currentFrame.keyframe || this.gop.length > 0 ? this._pushFrameIntoGop() : U.warn("h264 codec drop frame")), this.prevFrame = this.currentFrame, this.currentFrame = [], this.currentFrame.keyframe = !1, this.currentFrame.byteLength = 0, this.currentFrame.naluCount = 0, this.currentFrame.pts = e.pts, this.currentFrame.dts = e.dts) : (5 === e.unit_type && (this.currentFrame.keyframe = !0), this.currentFrame.byteLength += e.rawData.byteLength, this.currentFrame.naluCount++, this.currentFrame.push(e)),
    this.currentFrame.duration = e.dts - this.currentFrame.dts
  }
  _newGop() {
    this.gop = [],
    this.gop.duration = 0,
    this.gop.naluCount = 0,
    this.gop.byteLength = 0
  }
  _pushFrameIntoGop() {
    this.gop.push(this.currentFrame),
    this.gop.duration += this.currentFrame.duration,
    this.gop.byteLength += this.currentFrame.byteLength,
    this.gop.naluCount += this.currentFrame.naluCount
  }
  _newGops() {
    this.gops = [],
    this.gops.type = "video",
    this.gops.duration = 0,
    this.gops.naluCount = 0,
    this.gops.byteLength = 0,
    this.gops.frameLength = 0,
    this.gops.firstDTS = 0
  }
  _pushGopIntoGroup() {
    let e = this.gop[0];
    this.gops.trackId = this.trackId,
    this.gops.duration += this.gop.duration,
    this.gops.byteLength += this.gop.byteLength,
    this.gops.naluCount += this.gop.naluCount,
    this.gops.frameLength += this.gop.length,
    this.gops.firstDTS = e.dts,
    this.gops.firstPTS = e.pts,
    this.gops.push(this.gop),
    this.emit("data", this.gops),
    this._newGop(),
    this._newGops(),
    this.emit("done")
  }
}
class me extends F {
  constructor(e, t, n = {}) {
    super(),
    this.context = e,
    this.PSI = t,
    this.options = n,
    this.tracks = [],
    this.adtsStream = new le(t),
    this.avcStream = new ge(t),
    this.streams = [this.adtsStream, this.avcStream],
    n.decodeCodec && (this.avcStream.on("data", e =>{
      let t = n.config.stubTime;
      if (C(t)) {
        let n = (e.firstPTS + e.duration) / 9e4;
        if (n < t) {
          return void U.warn(`drop avc gop, start/end/stubTime(${e.firstPTS}/${n}/${t})`)
        }
      }
      this.tracks.push(e),
      this.emit("data", this.tracks),
      this.tracks = [],
      this.adtsStream.flush()
    }), this.adtsStream.on("data", e =>{
      let t = n.config.stubTime;
      if (C(t)) {
        let n = (e.firstPTS + e.duration) / 9e4;
        if (n < t) {
          return void U.warn(`drop adts, start/end/stubTime(${e.firstPTS}/${n}/${t})`)
        }
      }
      this.tracks.push(e),
      this.emit("data", this.tracks),
      this.tracks = []
    }))
  }
  push(e) {
    const {
      options: t,
      adtsStream: n,
      avcStream: r
    } = this;
    let {
      stream_type: i
    } = e;
    if (t.decodeCodec) switch (i) {
    case 27:
    case 36:
      r.push(e);
      break;
    case 15:
      n.push(e);
      break;
    default:
      U.warn("ts elementary encounter unknown stream type " + i)
    } else this.emit("data", e)
  }
  flush() {
    let {
      streams: e,
      tracks: t
    } = this;
    for (let t = 0; t < this.streams.length; t++) {
      e[t].flush()
    }
    t.length > 0 && this.emit("data", t),
    this.emit("done"),
    t.splice(0, t.length)
  }
  reset() {
    this.tracks = [];
    for (let e = 0; e < this.streams.length; e++) {
      this.streams[e].reset()
    }
    this.emit("reset")
  }
}

module.exports = {
  muxer: Pe,
  events: timerEventEmitter
};