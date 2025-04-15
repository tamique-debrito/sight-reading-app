const NoteInfo = function(fmt, t) {
  this.len_fmt = fmt;
  this.ticks = t;
}

const TREBLE_CLEF_NOTES = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
const ALTO_CLEF_NOTES = ['b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3'];
const BASS_CLEF_NOTES = ['c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3', 'c/4'];

const NOTE_LENGTH_FORMATS = ['32', '16', '16d', '8', '8d', '4', '4d', '2'];
const NOTE_LENGTHS = [1, 2, 3, 4, 6, 8, 12, 16];
const ALL_NOTE_CHOICES = NOTE_LENGTH_FORMATS.map((e, i) => new NoteInfo(e, NOTE_LENGTHS[i]));
const NUM_LEN_OPTIONS = 8;

const NOTE_NAME_TO_TICKS = {quarter: 8, eighth: 4, sixteenth: 2, thirtysecond: 1};


function random_start(range) {
  return Math.floor(Math.random() * (range + 1));
}

function random_offset(leap_amount) {
  return Math.floor(Math.random() * leap_amount + 1) * (Math.random() > 0.5? 1 : -1);
}

function random_choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clip(note, range) {
  return Math.max(Math.min(note, range), 0);
}

function map_note(note, clef_type) {
  return {treble: TREBLE_CLEF_NOTES[note], bass: BASS_CLEF_NOTES[note], alto: ALTO_CLEF_NOTES[note]}[clef_type];
}

function random_next_note(current_note, leap_amount, range) {
  let note = current_note + random_offset(leap_amount);
  note = clip(note, range);
  return note;
}

function get_candidate_notes(shortest_note, ticks_remaining) {
  let min_ticks = NOTE_NAME_TO_TICKS[shortest_note];
  return ALL_NOTE_CHOICES.filter(e => e.ticks % min_ticks === 0 && e.ticks <= ticks_remaining);
}

function random_note_length(shortest_note, ticks_remaining) {
  return random_choice(get_candidate_notes(shortest_note, ticks_remaining))
}

function generateBar(shortest_note, beats_per_bar, beat_division, leap_amount, clef_type) {
  // shortest_note is one of 'quarter', 'eighth', 'sixteenth', 'thirtysecond'
  let note_range = 7;
  let ticks_remaining = beats_per_bar * 32 / beat_division;
  let notes_list = [];
  let current_note = random_start(note_range);
  let length_info = random_note_length(shortest_note, ticks_remaining);
  ticks_remaining -= length_info.ticks;
  notes_list.push({note: map_note(current_note, clef_type), len_fmt: length_info.len_fmt});

  while (ticks_remaining > 0 ) {
    length_info = random_note_length(shortest_note, ticks_remaining)
    ticks_remaining -= length_info.ticks;
    current_note = random_next_note(current_note, leap_amount, note_range);
    notes_list.push({note: map_note(current_note, clef_type), len_fmt: length_info.len_fmt});
  }
  return notes_list;
}

function generateSequence(num_bars, shortest_note, beats_per_bar, beat_division, leap_amount, clef_type) {
  let bars = []
  for (let i=0; i<num_bars; i++) {
    bars.push(generateBar(shortest_note, beats_per_bar, beat_division, leap_amount, clef_type));
  }

  return bars;
}

module.exports.generateSequence = generateSequence;