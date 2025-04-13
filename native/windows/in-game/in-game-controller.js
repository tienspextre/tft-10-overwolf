import { InGameView } from '../../windows/in-game/in-game-view.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

let audioFiles;
let startAudio;
let winAudio;
let loseAudio;
let audioStartCar;
let audioCar;
let audioEndCar;
let audioNoTraitEarly;
let audioFilesSet12;

let chosenAudios = [];
let chosenParts = []
let intervals = [];
let trait = 'emo';
let isCarousel = false;
let isMatchEnd = false;
let isLate = false;
let lost = false;
let triggered = false;
let timeoutIds = [];
let stageNumber;
let currentSprite;
let set = 10;
let combat = false;
const logger = document.getElementById('logger');

export class InGameController {
	constructor() {
		this.inGameView = new InGameView();
		this.hotkeysService = new HotkeysService();
		this.runningGameService = new RunningGameService();
		this._eventListenerBound = this._eventListener.bind(this);
		this.owEventBus = null;
		document.getElementById('saveSet10').addEventListener('click', this.handleSaveSet10);
	}

	run() {
		// Get the event bus instance from the background window
		const { owEventBus, owAudioFiles, owstartAudio, owwinAudio, owloseAudio, owaudioStartCar, owaudioCar, owaudioEndCar, ownoTraitEarly, owAudioFilesSet12 } = overwolf.windows.getMainWindow();
		audioFiles = owAudioFiles;
		startAudio = owstartAudio;
		winAudio = owwinAudio;
		loseAudio = owloseAudio;
		audioStartCar = owaudioStartCar;
		audioCar = owaudioCar;
		audioEndCar = owaudioEndCar;
		audioNoTraitEarly = ownoTraitEarly;
		audioFilesSet12 = owAudioFilesSet12;
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
			this._clearTimeouts();
			chosenAudios = [];
			chosenParts = [];
			isLate = false;
			isCarousel = false;
			isMatchEnd = false;
			lost = false;
			triggered = false;
			// chosenAudios.forEach(sound => {
			// 	sound.stop();
			// });
			Howler.stop();
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
		//
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

	_log(message) {
		logger.innerHTML += `<br>${message} | ` + new Date().toLocaleTimeString();
	}

	// Logs events
	async _gameEventHandler(event) {''
		let isHighlight = false;
		switch (event.name) {
			case 'kill':
			case 'death':
			case 'assist':
			case 'level':
			case 'matchStart':
				break;
			case 'matchEnd':
			case 'match_start':
				// this.inGameView.logEvent(tmp, isHighlight);
				if (set === 10) {
					// if (chosenParts.length === 0) chosenAudios = Object.values(audioFiles['noTrait']['Early']);
					// chosenAudios.forEach(sound => {
					// 	if (!sound.playing()) {
					// 		currentSprite = sound.play('loop');
					// 	}
					// });
					await this.earlyPlaySet10(0, 0);
					this._log("Match start early audio init");
					audioNoTraitEarly.volume(0);
					audioNoTraitEarly.play('loop');
				}
				if (set === 12) {
					combat = false;
					trait = 'bunny';
					chosenAudios = audioFilesSet12[trait]['first']['nonCombat'];
					// chosenAudios.forEach(sound => {
					// 	if (!sound.playing()) {
					// 		currentSprite = sound.play('loop');
					// 	}
					// });
				}
				break;
			case 'match_end':
				isHighlight = true;
				isMatchEnd = true;
				break;
			case 'battle_start':
				if (set === 12) {
					this.combatChangeSet12();
				}
				break;
			case 'battle_end':
				if (set === 12) {
					this.combatChangeSet12();
				}
				break;
		}
		// this.inGameView.logEvent(JSON.stringify(event), isHighlight);
		console.log(JSON.stringify(event));
	}

	_infoUpdateHandler(infoUpdate) {
		console.log(infoUpdate);
		if (set === 10) this._infoUpdateHandlerSet10(infoUpdate);
		if (set === 12) this._infoUpdateHandlerSet12(infoUpdate);
		// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), false);
	}

	async _infoUpdateHandlerSet10(infoUpdate) {
		// console.log(chosenAudios);
		let isHighlight = false;
		if (!isMatchEnd) {
			if (infoUpdate.feature === 'match_info') {
				try{
					let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
					if (roundType.native_name === 'Carousel') {  //Carousel audio
						if (parseInt(roundType.stage.split("-")[0]) != 1) {
							this._log("Carousel audio init");
							isCarousel = true;
							isHighlight = true;
							chosenAudios.forEach(sound => {
								sound.stop();
							});
							this._clearTimeouts();
							triggered = false;
							this._clearIntervals();
							audioStartCar.play();
							setTimeout(() => {
								audioCar.play();
							}, 1050);
						}
					}
					else {
						let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
						stageNumber = roundType.stage;
						let stage = parseInt(stageNumber.split("-")[0]);
						if (isCarousel) { //Check if last round is carousel
							isCarousel = false;
							this._log("Carousel end audio init");
							audioCar.stop();
							audioEndCar.play(); // Start carousel end audio
							setTimeout(async () => {
								if (isLate) {
									await this.latePlaySet10(10.67, 1);
								} else {
									await this.earlyPlaySet10(0, 1);
								}
								audioEndCar.stop();
							}, 1800);
						}
						else if (stage > 1) {
							if (audioNoTraitEarly.playing()) {
								this._log("Fade out noTrait audio");
								// audioNoTraitEarly.fade(audioNoTraitEarly.volume(), 0, 500);
								// setTimeout(() => {
								// 	audioNoTraitEarly.stop();
								// }, 500);
								const time = audioNoTraitEarly.seek();
								audioNoTraitEarly.stop();
							}
							if (isLate) {
								if(!triggered) {
									this._log("Late audio init");
									this._clearTimeouts();
									await this.latePlaySet10(10.67, 1);
								}
							}
							else {
								this._log("Early audio init");
								await this.earlyPlaySet10(0, 1);
							}
						}
						else {
							if (stageNumber === '1-1') {
								isHighlight = true;
								this._log("Stage 1-1 audio init");
								startAudio.play();
								// chosenAudios.forEach(sound => {
								// 	if (!sound.playing()) {
								// 		currentSprite = sound.play('loop');
								// 	}
								// });
								setTimeout(() => {
									startAudio.fade(1, 0, 500);
									audioNoTraitEarly.fade(0, 1, 500);
									startAudio.stop();
								}, 50500);
							}
							else {
								if (!startAudio.playing()) {
									this._log("Stage 1-x audio init");
									audioNoTraitEarly.fade(audioNoTraitEarly.volume(), 1, 500);
								}
								if (!audioNoTraitEarly.playing()) {
									audioNoTraitEarly.play('loop');
									audioNoTraitEarly.fade(audioNoTraitEarly.volume(), 1, 500);
								}
							}
						}
					}
					// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), isHighlight);
					// this._log(JSON.stringify(infoUpdate));
				} catch (error){
				}
			}
			else if (infoUpdate.feature === 'roster') {
				// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
				let playerStatus = JSON.parse(infoUpdate.info.roster.player_status);
				for (let playerName in playerStatus) {
					if (playerStatus.hasOwnProperty(playerName)) {
						let player = playerStatus[playerName];
						if (player.rank === 8 && isLate === false) {
							this._log("Top8 audio init");
							// let volume = 0;
							// chosenParts = [];
							// const buttons = document.getElementsByClassName('trait-button');
							// Array.from(buttons).forEach(button => {
							// 	if (button.classList.contains('gradient-text')) {
							// 		const tmp = JSON.parse(button.value);
							// 		console.log(tmp);
							// 		if (isLate) chosenParts.push(audioFiles[tmp.trait]['Late'][tmp.type]);
							// 		else chosenParts.push(audioFiles[tmp.trait]['Early'][tmp.type]);
							// 	}
							// });
							// await Promise.all(chosenParts.map(part => {
							// 	return new Promise(resolve => {
							// 		part.once('load', resolve); // Wait for the load event
							// 		part.load();
							// 	});
							// }));
							// if (chosenAudios.length !== 0) {
							// 	volume = chosenAudios[last].volume();
							// 	chosenAudios.forEach(sound => {
							// 		sound.stop();
							// 		sound.unload();
							// 	});
							// }
							// if (chosenParts.length === 0){
							// 	if (isLate) chosenAudios = Object.values(audioFiles['noTrait']['Late']);
							// 	else chosenAudios = Object.values(audioFiles['noTrait']['Early']);
							// }
							// else chosenAudios = chosenParts;
							// console.log(chosenParts);
							// this.latePlaySet10(10.67, volume);
							if (!isLate) {
								isLate = true;
								chosenAudios.forEach(sound => {
									// sound.seek(10);
									sound.stop();
								})
								await this.handleSaveSet10(null);
								triggered = false;
								this._clearTimeouts();
								await this.latePlaySet10(10.67, 1);
								this._log("Top8 done audio init");
							}
						}
					}	
				}
			}
		}
		else if (infoUpdate.feature === 'roster') {
			// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
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

	_infoUpdateHandlerSet12(infoUpdate) {
		let isHighlight = false;
		if (!isMatchEnd) {
			if (infoUpdate.feature === 'match_info') {
				let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
				if (roundType.native_name === 'Carousel') {  //Carousel audio
					if (parseInt(roundType.stage.split("-")[0]) != 1) {
						isCarousel = true;
						isHighlight = true;
						chosenAudios.stop();
						this._clearTimeouts();
						this._clearIntervals();
						audioStartCar.play();
						setTimeout(() => {
							audioCar.play();
						}, 1050);
					}
				}
				else {
					let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
					stageNumber = roundType.stage;
					let stage = parseInt(stageNumber.split("-")[0]);
					if (isCarousel) { //Check if last round is carousel
						isCarousel = false;
						audioCar.stop();
						audioEndCar.play(); // Start carousel end audio
						setTimeout(() => {
							chosenAudios.play('loop');
							chosenAudios.fade(chosenAudios.volume(), 1, 500);
							audioEndCar.stop();
						}, 1800);
					}
					else if (stage > 1) {
						if (!isLate){
							if (chosenAudios === undefined) chosenAudios = audioFilesSet12[trait]['first']['nonCombat'];
							if (triggered === false){
								triggered = true;
								audioFilesSet12[trait]['first']['init'].play();
								setTimeout(() => {
									if (!chosenAudios.playing()) {
										chosenAudios.play('loop');
									}
									chosenAudios.fade(chosenAudios.volume(), 1, 500);
								}, 5000);
							}
							else {
								if (!chosenAudios.playing()) {
									chosenAudios.play('loop');
								}
								chosenAudios.fade(chosenAudios.volume(), 1, 500);
							}
						}
						else {
							if (chosenAudios === undefined) chosenAudios = audioFilesSet12[trait]['second']['nonCombat'];
							if (triggered === false){
								triggered = true;
								audioFilesSet12[trait]['second']['init'].play();
								setTimeout(() => {
									if (!chosenAudios.playing()) {
										chosenAudios.play('loop');
									}
									chosenAudios.fade(chosenAudios.volume(), 1, 500);
								}, 5000);
							}
							else {
								if (!chosenAudios.playing()) {
									chosenAudios.play('loop');
								}
								chosenAudios.fade(chosenAudios.volume(), 1, 500);
							}
						}
					}
					else {
						if (stageNumber === '1-1') {
							isHighlight = true;
							startAudio.play();
						}
						else {
							if (triggered === false){
								triggered = true;
								audioFilesSet12[trait]['first']['init'].play();
								setTimeout(() => {
									if (!chosenAudios.playing()) {
										chosenAudios.play('loop');
									}
									chosenAudios.fade(chosenAudios.volume(), 1, 500);
								}, 5000);
							}
							else {
								if (!chosenAudios.playing()) {
									chosenAudios.play('loop');
								}
								chosenAudios.fade(chosenAudios.volume(), 1, 500);
							}
						}
						
					}
				}
				// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), isHighlight);
			}
			else if (infoUpdate.feature === 'live_client_data') {
				// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
				let allPlayers = JSON.parse(infoUpdate.info.live_client_data.all_players);
				let playerLevel = allPlayers[0].level;
				if (playerLevel >= 7 && isLate === false) {
					isLate = true;
					chosenAudios.stop();
					if (combat) chosenAudios = audioFilesSet12[trait]['second']['combat'];
					else chosenAudios = audioFilesSet12[trait]['second']['nonCombat'];
					audioFilesSet12[trait]['second']['init'].play();
					const tmp = chosenAudios.play('loop');
					chosenAudios.pause();
					setTimeout(() => {
						chosenAudios.play(tmp);
					}, 8700);
				}
			}
		}
		else if (infoUpdate.feature === 'roster') {
			// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), true);
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
				chosenAudios.stop();
				loseAudio.play();
				lost = true;
			}
			else if (playerRank === 1) {
				chosenAudios.stop();
				winAudio.play();
			}
		}
	}


	_clearIntervals() {
		intervals.forEach(i => {
			clearInterval(i);
		})
	}

	_clearTimeouts() {
		timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
		timeoutIds = [];
	}


	async latePlaySet10(time, volume) {
		let sprites = [];
		if (chosenAudios.length === 0) {
			chosenAudios = Object.values(audioFiles['noTrait']['Late']);
			console.log(chosenAudios);
		}
		if (!triggered) {
			chosenAudios.forEach(sound => {
				const spriteid = sound.play('loop');
				sprites.push(spriteid);
				sound.once('play', () => {
					sound.fade(0, volume, 500, spriteid);
					sound.seek(time, spriteid);
				})
				currentSprite = spriteid;
			});
			// chosenAudios.forEach(sound => {
			// 	sound.seek(chosenAudios[0].seek(sprites[0]), sprites[chosenAudios.indexOf(sound)]);
			// });
			if (time * 1000 <= 154670) {
				const timeoutId = setTimeout(() => {
					triggered = false;
					this.latePlaySet10(0, volume);
				}, 154670 - time * 1000);
				timeoutIds.push(timeoutId);
			}
			else {
				triggered = false;
				await this.latePlaySet10(time - 154.67, volume);
				this._log("latePlaySet10 time-154.67" + (time - 154.67) + " " + volume);
			}
		}
		this._log("latePlaySet10 " + time + " " + volume);
		triggered = true;
		sprites.forEach(sound => {
			sound.seek(sprites[0].seek());
		});
	}

	async earlyPlaySet10(time, volume) {
		if (chosenAudios.length === 0) {
			chosenAudios = Object.values(audioFiles['noTrait']['Early']);
			console.log(chosenAudios);
		}
		chosenAudios.forEach(sound => {
			if (!sound.playing()) {
				const spriteId = sound.play('loop');
				sound.once('play', () => {
					sound.seek(time, spriteId);
				})
			}
			else {
				sound.seek(chosenAudios[0].seek());
			}
			sound.fade(sound.volume(), volume, 500);
		});
		this._log("earlyPlaySet10 " + time + " " + volume);
	}

	combatChangeSet12() {
		let state = chosenAudios.playing();
		let volume = chosenAudios.volume();
		chosenAudios.fade(volume, 0, 100);
		setTimeout(() => {
			let time = chosenAudios.seek();
			chosenAudios.stop();
			let cur = '';
			if (combat) {
				cur = 'nonCombat';
				combat = false;
			}
			else {
				cur = 'combat';
				combat = true;
			}
			if (isLate) {
				chosenAudios = audioFilesSet12[trait]['second'][cur];
			}
			else chosenAudios = audioFilesSet12[trait]['first'][cur];
			if (state) {
				chosenAudios.play('loop');
				chosenAudios.seek(time);
				chosenAudios.fade(0, volume, 100);
			}
		}, 100);
	}

	async musicChangeSet10() {
		let last;
		let time = 10.67;
		let state = false;
		let volume = 0;
		// Load new parts not in chosenAudios
		await Promise.all(chosenParts.map(part => {
			if (!chosenAudios.includes(part)) {
				return new Promise(resolve => {
					part.once('load', resolve); // Wait for the load event
					part.load();
				});
			}
		}));
		if (chosenAudios.length !== 0) {
			last = chosenAudios.length - 1;
			volume = chosenAudios[last].volume(currentSprite);
			state = chosenAudios[last].playing();
			time = chosenAudios[last].seek();
			if (time === 0) time = chosenAudios[last].seek(currentSprite);
			chosenAudios.forEach(sound => {
				sound.fade(volume, 0, 500);
				sound.stop();
				if (!chosenParts.find(audio => audio === sound)) {
					sound.unload();
				}
			});
		}
		chosenAudios = chosenParts;
		this._log(state + " " + time + " " + volume);
		chosenAudios.forEach(sound => {
			this._log(sound);
		});
		if (state) {
			if (isLate) {
				triggered = false;
				this._clearTimeouts();
				await this.latePlaySet10(time, volume);
			}
			else await this.earlyPlaySet10(time, volume);
			// sound.fade(0, volume, 500);
			// sound.seek(time);
		}
	}

	handleSaveSet10 = async (event) => {
		if (event && event.preventDefault) {
			event.preventDefault();
		}
		chosenParts = [];
		const buttons = document.getElementsByClassName('trait-button');
		Array.from(buttons).forEach(button => {
			if (button.classList.contains('gradient-text')) {
				const tmp = JSON.parse(button.value);
				console.log(tmp);
				this._log(tmp.trait + " " + tmp.type);
				if (isLate) chosenParts.push(audioFiles[tmp.trait]['Late'][tmp.type]);
				else chosenParts.push(audioFiles[tmp.trait]['Early'][tmp.type]);
			}
		});
		if (chosenParts.length === 0){
			if (isLate) chosenParts = Object.values(audioFiles['noTrait']['Late']);
			else chosenParts = Object.values(audioFiles['noTrait']['Early']);
		}
		await this.musicChangeSet10();
		console.log(chosenParts);
	}
}