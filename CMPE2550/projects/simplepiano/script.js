/* ======== Constants & frequency math ======== */
/* chromatic semitone numbers relative to C0 */
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/* frequency from MIDI/note number:
   A4 = 440 Hz is MIDI 69. formula: freq = 440 * 2^((midi-69)/12)
   We'll build notes by mapping name+octave -> midi -> freq */
function nameToMidi(noteName, octave) {
    const base = noteNames.indexOf(noteName);
    return (octave + 1) * 12 + base; // C0 -> midi 12
}
function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

/* build keys for 2 octaves (C..B) starting from chosen octave */
const AUDIO = new (window.AudioContext || window.webkitAudioContext)();
let masterGain = AUDIO.createGain(); masterGain.gain.value = 0.9; masterGain.connect(AUDIO.destination);

const pianoEl = document.getElementById('piano');
const octaveSelect = document.getElementById('octave');
const sustainBtn = document.getElementById('sustain');
const waveSelect = document.getElementById('wave');

let sustain = false;
let activeNodes = new Map(); // midi -> {osc,gain}
let pressedKeys = new Set(); // physical keyboard keys

sustainBtn.onclick = () => { sustain = !sustain; sustainBtn.textContent = `Sustain: ${sustain ? 'on' : 'off'}`; if (!sustain) releaseAllReleased(); }

/* keyboard mapping for white and black ordering */
const keyboardMap = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', ';', '.', '\'', '/'];

function buildPiano() {
    pianoEl.innerHTML = '';
    const baseOctave = parseInt(octaveSelect.value, 10);
    const keys = [];
    for (let o = baseOctave; o < baseOctave + 2; o++) {
        for (let i = 0; i < 12; i++) {
            const name = noteNames[i];
            const midi = nameToMidi(name, o);
            keys.push({ name, octave: o, midi });
        }
    }

    // create white keys container & place black keys absolutely
    let whiteIndex = 0;
    keys.forEach((k, idx) => {
        const isBlack = k.name.includes('#');
        if (!isBlack) {
            const key = document.createElement('div');
            key.className = 'key white';
            key.dataset.midi = k.midi;
            key.dataset.note = k.name + k.octave;
            key.innerHTML = `<div class="label">${k.name}${k.octave}</div>`;
            key.style.position = 'relative';
            key.onclick = (e) => { pressKey(k.midi); if (!sustain) releaseKey(k.midi); }
            key.onpointerdown = (e) => { e.preventDefault(); pressKey(k.midi); }
            key.onpointerup = (e) => { if (!sustain) releaseKey(k.midi); }
            key.onpointerleave = (e) => { if (!sustain) releaseKey(k.midi); }
            pianoEl.appendChild(key);
            whiteIndex++;
        } else {
            // black keys will be positioned later
            const key = document.createElement('div');
            key.className = 'key black';
            key.dataset.midi = k.midi;
            key.dataset.note = k.name + k.octave;
            key.innerHTML = `<div class="label">${k.name.replace('#', '♯')}${k.octave}</div>`;
            key.onclick = () => { pressKey(k.midi); if (!sustain) releaseKey(k.midi); }
            key.onpointerdown = (e) => { e.preventDefault(); pressKey(k.midi); }
            key.onpointerup = (e) => { if (!sustain) releaseKey(k.midi); }
            pianoEl.appendChild(key);
            // absolute position: approximate by placing black keys every ~56px offset
        }
    });

    // Re-style the keys to mimic layout
    // simple approach: find whites and overlay blacks
    const whiteKeys = Array.from(pianoEl.querySelectorAll('.key.white'));
    const blackKeys = Array.from(pianoEl.querySelectorAll('.key.black'));
    pianoEl.style.width = `${whiteKeys.length * 60}px`;
    whiteKeys.forEach((k, i) => { k.style.marginRight = '4px'; k.style.width = '56px'; });
    // place blacks: offset based on index
    let blIndex = 0;
    keys.forEach((k, idx) => {
        if (k.name.includes('#')) {
            const correspondingWhitePos = whiteKeys[blIndex];
            if (correspondingWhitePos) {
                const left = correspondingWhitePos.offsetLeft + 38;
                const blackEl = blackKeys.shift();
                blackEl.style.left = `${left}px`;
                pianoEl.appendChild(blackEl);
            }
        } else {
            blIndex++;
        }
    });
}

octaveSelect.onchange = buildPiano;
buildPiano();

/* ======= sound helpers ======= */
function createTone(midi, velocity = 1) {
    const freq = midiToFreq(midi);
    const osc = AUDIO.createOscillator();
    const g = AUDIO.createGain();
    osc.type = waveSelect.value || 'sine';
    osc.frequency.value = freq;
    const vel = Math.min(1, Math.max(0, velocity));
    g.gain.value = 0;
    osc.connect(g);
    g.connect(masterGain);
    const now = AUDIO.currentTime;
    // quick attack:
    g.gain.linearRampToValueAtTime(vel * 0.25, now + 0.01);
    osc.start(now);
    activeNodes.set(midi, { osc, g });
    return { osc, g };
}
function stopTone(midi) {
    const node = activeNodes.get(midi);
    if (!node) return;
    const now = AUDIO.currentTime;
    node.g.gain.cancelScheduledValues(now);
    node.g.gain.setValueAtTime(node.g.gain.value, now);
    node.g.gain.linearRampToValueAtTime(0.0001, now + 0.15);
    node.osc.stop(now + 0.16);
    setTimeout(() => { try { node.osc.disconnect(); node.g.disconnect(); } catch (e) { } }, 200);
    activeNodes.delete(midi);
}

/* press/release logic */
function pressKey(midi) {
    if (activeNodes.has(midi)) return;
    // velocity from pointer vertical pos could be added; for now medium velocity
    const vel = 0.9;
    createTone(midi, vel);
    highlightKey(midi, true);
}
function releaseKey(midi) {
    if (sustain) {
        // mark as released but keep playing; actual release when sustain turned off
        const el = findKeyEl(midi);
        if (el) el.dataset.released = 'true';
        highlightKey(midi, false);
        return;
    }
    stopTone(midi);
    highlightKey(midi, false);
}
function releaseAllReleased() {
    // stop tones that were released while sustain was on
    document.querySelectorAll('.key').forEach(k => {
        if (k.dataset.released === 'true') {
            const midi = parseInt(k.dataset.midi, 10);
            stopTone(midi);
            delete k.dataset.released;
        }
    });
}

function findKeyEl(midi) { return pianoEl.querySelector(`.key[data-midi="${midi}"]`); }
function highlightKey(midi, on) {
    const el = findKeyEl(midi);
    if (el) { el.classList.toggle('active', !!on); }
}

/* keyboard mapping */
window.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const k = ev.key.toLowerCase();
    const idx = keyboardMap.indexOf(k);
    if (idx >= 0) {
        const baseOct = parseInt(octaveSelect.value, 10);
        const midi = nameToMidi(noteNames[idx % 12], baseOct + Math.floor(idx / 12));
        if (!pressedKeys.has(k)) {
            pressKey(midi);
            pressedKeys.add(k);
        }
    } else {
        // octave up/down quick controls
        if (k === 'arrowup') octaveSelect.value = (parseInt(octaveSelect.value) + 1); buildPiano();
        if (k === 'arrowdown') octaveSelect.value = (parseInt(octaveSelect.value) - 1); buildPiano();
    }
});
window.addEventListener('keyup', (ev) => {
    const k = ev.key.toLowerCase();
    const idx = keyboardMap.indexOf(k);
    if (idx >= 0) {
        const baseOct = parseInt(octaveSelect.value, 10);
        const midi = nameToMidi(noteNames[idx % 12], baseOct + Math.floor(idx / 12));
        releaseKey(midi);
        pressedKeys.delete(k);
    }
});