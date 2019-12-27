Tone.Transport.bpm.value = 80;

var tremolo = new Tone.Tremolo(2, 0.75).toMaster().start();
var feedbackDelay = new Tone.FeedbackDelay("8n", 0.8).toMaster();
var kickDelay = new Tone.FeedbackDelay("16n", 0.2).toMaster();
var snareDelay = new Tone.PingPongDelay("8n", 0.35).toMaster();
var autoPanner = new Tone.AutoPanner("8n").toMaster().start();
var autoFilter = new Tone.AutoFilter("8n").toMaster().start();
var freeverb = new Tone.Freeverb().toMaster();
var freeverb2 = new Tone.Freeverb().toMaster();
var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
var crusher = new Tone.BitCrusher(8).toMaster();
var crusher2 = new Tone.BitCrusher(8).toMaster();
var filter = new Tone.AutoFilter({
	"frequency" : 2,
	"depth" : 1,
}).toMaster().start();

pingPong.wet.value = 0.25;
kickDelay.wet.value = 0.25;
snareDelay.wet.value = 0.15;
crusher.wet.value = 0.25;
crusher2.wet.value = 0.05;
freeverb2.wet.value = 0.15;

var panner = new Tone.Panner(0.75).toMaster();
var panner2 = new Tone.Panner(-1).toMaster();

var synthA = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationType: 'sawtooth',
    modulationIndex: 3,
    harmonicity: 5.4,
  },
  envelope: {
    attack: 5,
    decay: 0.25,
    sustain: 0.25,
    release: 0.25,
  }
}).connect(filter).connect(feedbackDelay).toMaster();
synthA.volume.value = -17.5;

var synthB = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationType: 'sawtooth',
    modulationIndex: 3,
    harmonicity: 5.4,
  },
  envelope: {
    attack: 1.5,
    decay: 0.15,
    sustain: 0.15,
    release: 0.15,
  }
}).connect(panner2).connect(freeverb).connect(autoFilter).connect(autoPanner).toMaster();
synthB.volume.value = -50;

var synthC = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationType: 'sawtooth',
    modulationIndex: 3,
    harmonicity: 5.4,
  },
  envelope: {
    attack: 1.25,
    decay: 0.15,
    sustain: 0.15,
    release: 0.15,
  }
}).connect(panner).connect(pingPong).toMaster();
synthC.volume.value = -40;

var kick = new Tone.MembraneSynth({
pitchDecay : 0.05 ,
octaves : 3 ,
oscillator : {
type : "sine"
} ,
envelope : {
attack : 0.001 ,
decay : 0.4 ,
sustain : 0.01 ,
release : 1.4 ,
attackCurve : "exponential"
}
}).connect(crusher).connect(kickDelay).connect(freeverb2).toMaster();
kick.volume.value = -25;

var snare = new Tone.NoiseSynth().connect(snareDelay).toMaster();
snare.volume.value = -27;

var noise = new Tone.NoiseSynth({
noise : {
type : "brown"
} ,
envelope : {
attack : 1.005 ,
decay : 0.5 ,
sustain : 0.25
}
}).connect(crusher2).connect(autoPanner).connect(autoFilter).toMaster();
noise.volume.value = -55;

var seq = new Tone.Sequence(function(time, note){
	synthA.triggerAttackRelease(note, "2n",time)
}, ["C4", "E4", "D4", "A4", "C4", "B3", "D4", "E4"], "1n");

var pattern = new Tone.Sequence(function(time, note){
	synthB.triggerAttackRelease(note, "1n",time)
}, ["F5", "C5", "G5"], "1n");

var pattern2 = new Tone.Sequence(function(time, note){
	synthC.triggerAttackRelease(note, "4n",time)
}, ["G6", "C7", "F6", "A6", "G6", "C7", "A6", "C6", "D6"], "4n");

var kickPattern = new Tone.Sequence(function(time, note){
	kick.triggerAttackRelease(note, "1n",time)
}, ["C2"], "1n");

var snarePattern = new Tone.Sequence(function(time, note){
	snare.triggerAttackRelease("1n")
}, ["C3"], "1n");

var snarePattern2 = new Tone.Sequence(function(time, note){
	noise.triggerAttackRelease("1n")
}, ["C6"], "1n");



seq.start(0).stop('200m')
pattern.start(0).stop('200m')
pattern2.start(12).stop('200m')
kickPattern.start(12).stop('200m')
snarePattern.start(13.5).stop('200m')
snarePattern2.start(0).stop('200m')

//start/stop the transport
document.querySelector('tone-play-toggle').addEventListener('change', e => Tone.Transport.toggle())
