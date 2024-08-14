import { InGameView } from '../../windows/in-game/in-game-view.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

const kdaEarlyFiles = ['music/kda early drum.ogg', 'music/kda early main.ogg', 'music/kda early secondary.ogg'];
const pentakillEarlyFiles = ['music/pentakill early drum.ogg', 'music/pentakill early main.ogg', 'music/pentakill early secondary.ogg'];
const trueDamageEarlyFiles = ['music/true dmg early drum.ogg', 'music/true dmg early main.ogg', 'music/true dmg early secondary.ogg'];
const heartsteelEarlyFiles = ['music/heartsteel early drum.ogg', 'music/heartsteel early main.ogg', 'music/heartsteel early secondary.ogg'];
const discoEarlyFiles = ['music/disco early drum.ogg', 'music/disco early main.ogg'];
const bit8EarlyFiles = ['music/8bit early drum.ogg', 'music/8bit early main.ogg'];
const emoEarlyFiles = ['music/emo early drum.ogg', 'music/emo early main.ogg'];
const punkEarlyFiles = ['music/punk early drum.ogg', 'music/punk early main.ogg'];
const countryEarlyFiles = ['music/country early drum.ogg', 'music/country early main.ogg'];
const noTraitEarlyFiles = ['music/no trait 1.ogg'];

const kdaLateFiles = ['music/late/kda late drum.ogg', 'music/late/kda late main.ogg', 'music/late/kda late secondary.ogg'];
const pentakillLateFiles = ['music/late/pentakill late drum.ogg', 'music/late/pentakill late main.ogg', 'music/late/pentakill late secondary.ogg'];
const trueDamageLateFiles = ['music/late/true dmg late drum.ogg', 'music/late/true dmg late main.ogg', 'music/late/true dmg late secondary.ogg'];
const heartsteelLateFiles = ['music/late/heartsteel late drum.ogg', 'music/late/heartsteel late main.ogg', 'music/late/heartsteel late secondary.ogg'];
const discoLateFiles = ['music/late/disco late drum.ogg', 'music/late/disco late main.ogg'];
const bit8LateFiles = ['music/late/8bit late drum.ogg', 'music/late/8bit late main.ogg'];
const emoLateFiles = ['music/late/emo late drum.ogg', 'music/late/emo late main.ogg'];
const punkLateFiles = ['music/late/punk late drum.ogg', 'music/late/punk late main.ogg'];
const countryLateFiles = ['music/late/country late drum.ogg', 'music/late/country late main.ogg'];
const noTraitLateFiles = ['music/late/no trait 2.ogg'];

var globalVolume = 1;

const audioNoTraitEarly = new Howl({
	src: ['music/no trait 1.ogg'],
	volume: 0,
	loop: [6840, 192000, true],
	preload: true
});

const startAudio = new Howl({
	src: ['music/start.ogg'],
	volume: 1,
	preload: true
});

const winAudio = new Howl({
	src: ['music/win.ogg'],
	volume: 1,
	preload: true
});

const loseAudio = new Howl({
	src: ['music/lose.ogg'],
	volume: 1,
	preload: true
});

const audioStartCar = new Howl({
	src: ['music/carousel start.ogg'],
	volume: 1,
	preload: true
});

const audioCar = new Howl({
	src: ['music/carousel kda + jazz.mp3'],
	volume: 1,
	preload: true
});

const audioEndCar = new Howl({
	src: ['music/carousel end.ogg'],
	volume: 1,
	preload: true
});


var audioFiles = {
	noTrait: {
		Early: [],
		Late: []
	},
    kda: { 
        Early: [], 
        Late: [] 
    },
    pentakill: { 
        Early: [], 
        Late: [] 
    },
	trueDamage: { 
        Early: [], 
        Late: [] 
    },
	heartsteel: { 
        Early: [], 
        Late: [] 
    },
	disco: { 
        Early: [], 
        Late: [] 
    },
	bit8: { 
        Early: [], 
        Late: [] 
    },
	emo: { 
        Early: [], 
        Late: [] 
    },
	punk: { 
        Early: [], 
        Late: [] 
    },
	country: { 
        Early: [], 
        Late: [] 
    },
    // Add other traits in the same pattern
};

let earlyAudios = {
    kdaEarly: [],
    pentakillEarly: [],
    trueDamageEarly: [],
    heartsteelEarly: [],
    discoEarly: [],
    bit8Early: [],
    emoEarly: [],
    punkEarly: [],
    countryEarly: []
};

let lateAudios = {
    kdaLate: [],
    pentakillLate: [],
    trueDamageLate: [],
    heartsteelLate: [],
    discoLate: [],
    bit8Late: [],
    emoLate: [],
    punkLate: [],
    countryLate: []
};

let chosenAudios = [];
let intervals = [];
// let chosenLateAudios2 = ['heartsteelLate11', 'heartsteelLate22', 'heartsteelLate33'];
let trait = 'noTrait'
let isCarousel = false;
let isMatchEnd = false;
let isLate = false;
let lost = false;
let triggered = false;
let timeoutIds = [];
let stageNumber;
let currentSprite;

export class InGameController {
constructor() {
	this.inGameView = new InGameView();
	this.hotkeysService = new HotkeysService();
	this.runningGameService = new RunningGameService();
	// this.chosenAudios = ['heartsteelEarly1', 'heartsteelEarly2', 'heartsteelEarly3'];
	this._eventListenerBound = this._eventListener.bind(this);
	this.owEventBus = null;
	this.createEarlySounds();
    this.createLateSounds();
	document.getElementById("kda").addEventListener("click", () => {
		this.musicChange("kda");
	});
	document.getElementById("heartsteel").addEventListener("click", () => {
		this.musicChange("heartsteel");
	});
	document.getElementById("bit8").addEventListener("click", () => {
		this.musicChange("bit8");
	});
	document.getElementById("noTrait").addEventListener("click", () => {
		this.musicChange("noTrait");
	});
	
}

createHowlObjects(fileList, targetArray, loopConfig) {
	fileList.forEach(file => {
		var sound = new Howl({
			src: [file],
			sprite: loopConfig,
			volume: 0,
			preload: true
		});
		targetArray.push(sound);
	});
}

createEarlySounds() {
	const loopConfig = {
		loop: [6840, 192000, true] // Loop from 6.84s to 198.84s
	};

	this.createHowlObjects(kdaEarlyFiles, audioFiles['kda'].Early, loopConfig);
	this.createHowlObjects(pentakillEarlyFiles, audioFiles['pentakill'].Early, loopConfig);
	this.createHowlObjects(trueDamageEarlyFiles, audioFiles['trueDamage'].Early, loopConfig);
	this.createHowlObjects(heartsteelEarlyFiles, audioFiles['heartsteel'].Early, loopConfig);
	this.createHowlObjects(discoEarlyFiles, audioFiles['disco'].Early, loopConfig);
	this.createHowlObjects(bit8EarlyFiles, audioFiles['bit8'].Early, loopConfig);
	this.createHowlObjects(emoEarlyFiles, audioFiles['emo'].Early, loopConfig);
	this.createHowlObjects(punkEarlyFiles, audioFiles['punk'].Early, loopConfig);
	this.createHowlObjects(countryEarlyFiles, audioFiles['country'].Early, loopConfig);
	this.createHowlObjects(noTraitEarlyFiles, audioFiles['noTrait'].Early, loopConfig);
}

createLateSounds() {
	const loopConfig = {
		loop: [0, 167000]
		// onend: function() {
		// 	this.seek(10670);
		// }
	};

	this.createHowlObjects(kdaLateFiles, audioFiles['kda'].Late, loopConfig);
	this.createHowlObjects(pentakillLateFiles, audioFiles['pentakill'].Late, loopConfig);
	this.createHowlObjects(trueDamageLateFiles, audioFiles['trueDamage'].Late, loopConfig);
	this.createHowlObjects(heartsteelLateFiles, audioFiles['heartsteel'].Late, loopConfig);
	this.createHowlObjects(discoLateFiles, audioFiles['disco'].Late, loopConfig);
	this.createHowlObjects(bit8LateFiles, audioFiles['bit8'].Late, loopConfig);
	this.createHowlObjects(emoLateFiles, audioFiles['emo'].Late, loopConfig);
	this.createHowlObjects(punkLateFiles, audioFiles['punk'].Late, loopConfig);
	this.createHowlObjects(countryLateFiles, audioFiles['country'].Late, loopConfig);
	this.createHowlObjects(noTraitLateFiles, audioFiles['noTrait'].Late, loopConfig);
}

run() {
	// Get the event bus instance from the background window
	const { owEventBus } = overwolf.windows.getMainWindow();

	this.owEventBus = owEventBus;

	this._readStoredData();

	// This callback will run in the context of the current window
	this.owEventBus.addListener(this._eventListenerBound);

	// Update hotkey view and listen to changes:
	this._updateHotkey();
	this.hotkeysService.addHotkeyChangeListener(() => this._updateHotkey());

	this._addBeforeCloseListener();
}

/**
 * This removes in-game window's listener from the event bus when the window
 * closes
 */
_addBeforeCloseListener() {
	window.addEventListener('beforeunload', e => {
	delete e.returnValue;

	this.owEventBus.removeListener(this._eventListenerBound);
	});
}

/**
 * Read & render events and info updates that happened before this was opened
 */
_readStoredData() {
	const {
	owEventsStore,
	owInfoUpdatesStore
	} = overwolf.windows.getMainWindow();

	owEventsStore.forEach(v => this._gameEventHandler(v));
	owInfoUpdatesStore.forEach(v => this._infoUpdateHandler(v));
}

async _updateHotkey() {
	const gameInfo = await this.runningGameService.getRunningGameInfo();

	const [
	hotkeyToggle,
	hotkeySecondScreen
	] = await Promise.all([
	this.hotkeysService.getHotkey(
		kHotkeyToggle,
		gameInfo.classId
	),
	this.hotkeysService.getHotkey(
		kHotkeySecondScreen,
		gameInfo.classId
	)
	]);

	this.inGameView.updateToggleHotkey(hotkeyToggle);
	this.inGameView.updateSecondHotkey(hotkeySecondScreen);
}

_eventListener(eventName, eventValue) {
	switch (eventName) {
		case 'event': {
			this._gameEventHandler(eventValue);
			break;
		}
		case 'info': {
			this._infoUpdateHandler(eventValue);
			break;
		}
	}
}

// Logs events
_gameEventHandler(event) {
	let isHighlight = false;
	switch (event.name) {
		case 'kill':
		case 'death': 
		case 'assist':
		case 'level':
		case 'matchStart':
		case 'matchEnd':
		case 'match_start':
			// this.inGameView.logEvent(tmp, isHighlight);
			chosenAudios = audioFiles[trait].Early;
			chosenAudios.forEach(sound => {
				if (!sound.playing()){
					currentSprite = sound.play('loop');
				}
			});
			// chosenLateAudios2.forEach(i => {
			//   let audio1 = document.getElementById(i);
			//   audio1.addEventListener("timeupdate", () => {
			//     this._checkLoopLate2(audio1);
			//   });
			// });
			break;
		case 'match_end':
			isHighlight = true;
			isMatchEnd = true;
			break;
	}

	this.inGameView.logEvent(JSON.stringify(event), isHighlight);
}

_infoUpdateHandler(infoUpdate){
	this._infoUpdateHandlerSet10(infoUpdate);
}

_infoUpdateHandlerSet10(infoUpdate) {
	let isHighlight = false;
	// let playerStatus = JSON.parse(infoUpdate.info.roster.playerStatus);
	if (!isMatchEnd){
	if (infoUpdate.feature === 'match_info') {
		let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
		if (roundType.native_name === 'Carousel'){  //Carousel audio
			if (parseInt(roundType.stage.split("-")[0]) != 1){
				isCarousel = true;
				isHighlight = true;
				chosenAudios.forEach(sound => {
					sound.stop();
				});
				timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
				timeoutIds = []; 
				triggered = false;
				this._clearIntervals();
				// let audioStartCar = document.getElementById('carouselStart'); //Carousel start audio
				// let audioCar = document.getElementById('carousel'); //Carousel audio
				audioStartCar.play();
				setTimeout(() => {
					// audioStartCar.stop();
					audioCar.play();
				}, 1050);
				// var tmp = setInterval(() => {
				// 	let currentTime = Math.round(audioStartCar.seek() * 10) / 10;
				// 	if (currentTime >= 0.9){
				// 		audioStartCar.stop();
				// 		audioCar.play(); //Start carousel audio
				// 		clearInterval(tmp);
				// 	}
				// }, 100);
				// audioStartCar.addEventListener("timeupdate", () => {
				// if (audioStartCar.currentTime >= 0.9){ //End carousel start audio
				// 	audioStartCar.pause();
				// 	audioStartCar.currentTime = 0;
				// 	audioCar.play(); //Start carousel audio
				// }
				// });
			}
		}
		else {
			let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
			stageNumber = roundType.stage;
			let stage = parseInt(stageNumber.split("-")[0]);
			if (isCarousel){ //Check if last round is carousel
				isCarousel = false;
				// let audioCar = document.getElementById('carousel'); //Carousel audio
				// let audioEndCar = document.getElementById('carouselEnd'); //Carousel end audio
				audioCar.stop();
				audioEndCar.play(); // Start carousel end audio
				setTimeout(() => {
					if (isLate) {
						this.latePlay(10.67);
					} else {
						this.earlyPlay();
					}
					audioEndCar.stop();
				}, 1800);
				// audioEndCar.addEventListener("timeupdate", () => {
				// if (audioEndCar.currentTime >= 1.8){ //End carousel end audio
				// 	audioEndCar.pause();
				// 	audioEndCar.currentTime = 0;
				// }
				// });
			}
			else if (stage > 1){
				// if (audioNoTraitEarly.playing()) audioNoTraitEarly.stop();
				if (isLate && !triggered){
					this.latePlay(10.67);
				}
				else {
					this.earlyPlay(0);
				}
			}
			else {
				if (stageNumber === '1-1'){
					isHighlight = true;
					startAudio.play();
					chosenAudios.forEach(sound => {
						if (!sound.playing()){
							currentSprite = sound.play('loop');
						}
					});
					setTimeout(() => {
						startAudio.fade(1, 0, 500);
						this.earlyPlay(0);
						startAudio.stop();
					}, 50500);
					// let tmp = setInterval(() => {
					// 	let currentTime = Math.round(startAudio.seek() * 10) / 10;
					// 	if (currentTime >= 50.5){
					// 		startAudio.fade(1, 0, 500);
					// 		audioNoTraitEarly.play();
					// 		audioNoTraitEarly.seek(56500);
					// 		audioNoTraitEarly.fade(0, 1, 500);
					// 		startAudio.stop();
					// 		clearInterval(tmp);
					// 	}
					// }, 100);
					// startAudio.addEventListener("timeupdate", () => {
					// 	if (startAudio.currentTime >= 50.5){ //End audio game start
					// 		this._fadeOutAudio(startAudio);
					// 		startAudio.stop();
					// 		audioNoTraitEarly.seek(56500);
					// 		audioNoTraitEarly.play();
					// 		audioNoTraitEarly.fade(0, 1, 500);
					// 	}
					// });
				}
				else if (!startAudio.playing()){
					// if (!audioNoTraitEarly.playing()){
					// 	audioNoTraitEarly.play();
					// 	audioNoTraitEarly.seek(56500);
					// 	audioNoTraitEarly.fade(0, 1, 500);
					// }
					this.earlyPlay(0);
				}
			}
		}
		this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), isHighlight);
	}
	else if (infoUpdate.feature === 'roster'){
		this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
		let playerStatus = JSON.parse(infoUpdate.info.roster.player_status);
		for (let playerName in playerStatus) {
			if (playerStatus.hasOwnProperty(playerName)) {
				let player = playerStatus[playerName];
				if (player.rank === 8 && isLate === false) {
					isLate = true;
					chosenAudios.forEach(sound => {
						sound.stop();
					});
					chosenAudios = audioFiles[trait].Late;
					this.latePlay(10.67);
				}
			}
		}
	}
	}
	else if (infoUpdate.feature === 'roster') { 
		this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
		let playerRank = 0;
		let playerStatus = JSON.parse(infoUpdate.info.roster.player_status);
		for (let playerName in playerStatus) {
			if (playerStatus.hasOwnProperty(playerName)) {
				let player = playerStatus[playerName];
				if (player.localplayer === true) {
					playerRank = player.rank;
					break;
				}
			}
		}
		if (playerRank > 1 && lost === false) {
			chosenAudios.forEach(sound => {  
				sound.stop();
			});
			loseAudio.play();
			lost = true;
		}
		else if (playerRank === 1) {
			chosenAudios.forEach(sound => {
				sound.stop();
			});
			winAudio.play();
		}
	}
}

// _checkLoopEarly(audio) {
//     if (audio.currentTime >= 191.77) {
//       audio.pause();
//       chosenAudios.forEach(i => {
//         let audio1 = document.getElementById(i);
//         audio1.pause();
//         audio1.currentTime = 0;
//         audio1.play();
//       })
//     }
// }

// _checkLoopLate(audio) {
//   if (audio.currentTime >= 154.60 && lateRep == false) {
//     lateRep = true;
//     chosenLateAudios2.forEach(i => {
//       let audio1 = document.getElementById(i);
//       audio1.play();
//     });
//   }
// }

// _checkLoopLate2(audio) {
//   if (audio.currentTime >= 10.60) {
//     lateRep = false;
//     chosenLateAudios2.forEach(i => {
//       let audio2 = document.getElementById(i);
//       audio2.pause();
//     });
//     chosenAudios.forEach(i => {
//       let audio1 = document.getElementById(i);
//       audio1.pause();
//       audio1.currentTime = audio.currentTime;
//       audio1.play();
//     });
//     chosenLateAudios2.forEach(i => {
//       let audio2 = document.getElementById(i);
//       audio2.currentTime = 0;
//     });
//   }
// }
	_clearIntervals(){
		intervals.forEach(i => {
			clearInterval(i);
		})
	}

	// _fadeInAudio(audioElement) {
	// 	const duration = 2000; // Animation duration in milliseconds
	// 	const startVolume = audioElement.volume;
	// 	const targetVolume = 1;
	// 	const volumeIncrement = (targetVolume - startVolume) / (duration / 20); // Adjust increment for smoother animation
	// 	const volumeInterval = setInterval(() => {
	// 		if (audioElement.volume < targetVolume) {
	// 			audioElement.volume += volumeIncrement;
	// 		} else {
	// 			clearInterval(volumeInterval); // Stop interval when volume reaches target
	// 		}
	// 	}, 20);
	// }

	// _fadeOutAudio(audioElement) {
	// 	const duration = 2000; // Animation duration in milliseconds
	// 	const startVolume = audioElement.volume;
	// 	const targetVolume = 0;
	// 	const volumeDecrement = (startVolume - targetVolume) / (duration / 20); // Adjust increment for smoother animation
	// 	const volumeInterval2 = setInterval(() => {
	// 		if (audioElement.volume < targetVolume) {
	// 		audioElement.volume -= volumeDecrement;
	// 		} else {
	// 			clearInterval(volumeInterval2); // Stop interval when volume reaches target
	// 		}
	// 	}, 20);
	// }

	latePlay(time){
		if (chosenAudios.length === 0) chosenAudios = audioFiles[trait].Late;
		if (!triggered){
			chosenAudios.forEach(sound => {
				const spriteid = sound.play('loop');
				currentSprite = spriteid;
				sound.seek(time, spriteid);
				sound.fade(sound.volume(), 1, 500, spriteid);
			});
			if (time * 1000 <= 154670){
				const timeoutId = setTimeout(() => {
					triggered = false;
					this.latePlay(0);
				}, 154670 - time * 1000);
				timeoutIds.push(timeoutId);
			}
			else {
				triggered = false;
				this.latePlay(time - 154.67);
			}
		}
		triggered = true;
	}

	earlyPlay(time){
		// console.log(chosenAudios);
		if (chosenAudios.length === 0) chosenAudios = audioFiles[trait].Early;
		chosenAudios.forEach(sound => {
			if (!sound.playing()){
				currentSprite = sound.play('loop');
				sound.seek(time);
			}
			sound.fade(sound.volume(), 1, 500);
		});
	}

	// _pauseAllAudio(){
	// 	const audioElements = document.querySelectorAll('audio');
	// 	audioElements.forEach(audio => {
	// 		audio.pause();
	// 	});
	// }

	musicChange(newValue){
		if (trait !== newValue){
			let last = chosenAudios.length - 1;
			let time = chosenAudios[last].seek();
			if (time == 0) time = chosenAudios[last].seek(currentSprite);
			let state = chosenAudios[last].playing();
			// setInterval(() => {
			// 	console.log(chosenAudios[last].seek());
			// 	console.log(chosenAudios[last].seek(currentSprite));
			// 	console.log(currentSprite);
			// 	console.log(last);
			// }, 1000);
			chosenAudios.forEach(sound => {
				sound.fade(1, 0, 500);
				setTimeout(() => {
					sound.stop();
				}, 500);
			});
			if (isLate) {
				chosenAudios = audioFiles[newValue].Late;
				timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
				timeoutIds = []; 
				triggered = false;
			}
			else chosenAudios = audioFiles[newValue].Early;
			trait = newValue;
			chosenAudios.forEach(sound => {
				if (state){
					if (isLate) this.latePlay(time);
					else this.earlyPlay(time);
					sound.fade(0, 1, 500);
					// sound.seek(time);
				}
			});
		}
	}
	
}

function createWatchedVariable(initialValue, onchange) {
	let value = initialValue;
	return {
		get: function() {
			return value;
		},
		set: function(newValue) {
			value = newValue;
			onchange(newValue);
		}
	};
}
