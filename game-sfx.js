// game-sfx.js — tiny WebAudio synth for UI sounds. window.SFX.
// All sounds are synthesized — no audio files. Muting persists.
(function () {
  var ctx = null;
  var MUTE_KEY = "aivid_sfx_muted";
  var muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // one enveloped oscillator note
  function note(freq, t0, dur, type, gain, glide) {
    var c = ac(); if (!c || muted) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    var start = c.currentTime + (t0 || 0);
    o.frequency.setValueAtTime(freq, start);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, start + dur);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain || 0.08, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(start); o.stop(start + dur + 0.05);
  }

  var SFX = {
    get muted() { return muted; },
    setMuted: function (m) {
      muted = !!m;
      try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (e) {}
    },
    unlock: function () { ac(); },
    click: function () { note(880, 0, 0.06, "square", 0.025); },
    hover: function () { note(660, 0, 0.04, "sine", 0.015); },
    start: function () { // power-on sweep
      note(220, 0, 0.5, "sawtooth", 0.05, 880);
      note(440, 0.12, 0.5, "sine", 0.06, 1760);
    },
    correct: function () { note(660, 0, 0.12, "sine", 0.07); note(990, 0.1, 0.18, "sine", 0.07); },
    wrong: function () { note(220, 0, 0.22, "sawtooth", 0.05, 160); },
    place: function () { note(520, 0, 0.07, "triangle", 0.05); },
    cleared: function () { // little fanfare
      note(523, 0, 0.14, "triangle", 0.07); note(659, 0.12, 0.14, "triangle", 0.07);
      note(784, 0.24, 0.2, "triangle", 0.08); note(1047, 0.4, 0.34, "triangle", 0.08);
    },
    rankup: function () { // achievement arpeggio
      [523, 659, 784, 988, 1175].forEach(function (f, i) { note(f, i * 0.09, 0.22, "sine", 0.07); });
      note(1568, 0.5, 0.5, "sine", 0.05);
    },
  };
  window.SFX = SFX;
})();
