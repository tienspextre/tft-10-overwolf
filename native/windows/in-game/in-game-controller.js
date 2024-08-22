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

let chosenAudios;
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

	// Logs events
	_gameEventHandler(event) {''
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
					if (chosenParts.length === 0) chosenAudios = Object.values(audioFiles['noTrait']['Early']);
					chosenAudios.forEach(sound => {
						if (!sound.playing()) {
							currentSprite = sound.play('loop');
						}
					});
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
	}

	_infoUpdateHandler(infoUpdate) {
		if (set === 10) this._infoUpdateHandlerSet10(infoUpdate);
		if (set === 12) this._infoUpdateHandlerSet12(infoUpdate);
		// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), false);
	}

	_infoUpdateHandlerSet10(infoUpdate) {
		// console.log(chosenAudios);
		let isHighlight = false;
		if (!isMatchEnd) {
			if (infoUpdate.feature === 'match_info') {
				try{
					let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
					if (roundType.native_name === 'Carousel') {  //Carousel audio
						if (parseInt(roundType.stage.split("-")[0]) != 1) {
							isCarousel = true;
							isHighlight = true;
							chosenAudios.forEach(sound => {
								sound.stop();
							});
							timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
							timeoutIds = [];
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
							audioCar.stop();
							audioEndCar.play(); // Start carousel end audio
							setTimeout(() => {
								if (isLate) {
									this.latePlaySet10(10.67);
								} else {
									this.earlyPlaySet10(0, 1);
								}
								audioEndCar.stop();
							}, 1800);
						}
						else if (stage > 1) {
							if (audioNoTraitEarly.playing()) {
								audioNoTraitEarly.fade(audioNoTraitEarly.volume(), 0, 500);
								setTimeout(() => {
									audioNoTraitEarly.stop();
								}, 500);
							}
							if (isLate && !triggered) {
								this.latePlaySet10(10.67);
							}
							else {
								this.earlyPlaySet10(0, 1);
							}
						}
						else {
							if (stageNumber === '1-1') {
								isHighlight = true;
								startAudio.play();
								chosenAudios.forEach(sound => {
									if (!sound.playing()) {
										currentSprite = sound.play('loop');
									}
								});
								setTimeout(() => {
									startAudio.fade(1, 0, 500);
									audioNoTraitEarly.fade(0, 1, 500);
									startAudio.stop();
								}, 50500);
							}
							else if (!startAudio.playing()) {
								audioNoTraitEarly.fade(audioNoTraitEarly.volume(), 1, 500);
							}
						}
					}
					// this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), isHighlight);
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
							isLate = true;
							chosenAudios.forEach(sound => {
								sound.stop();
							});
							chosenParts = [];
							const buttons = document.getElementsByClassName('trait-button');
							Array.from(buttons).forEach(button => {
								if (button.classList.contains('gradient-text')) {
									const tmp = JSON.parse(button.value);
									console.log(tmp);
									if (isLate) chosenParts.push(audioFiles[tmp.trait]['Late'][tmp.type]);
									else chosenParts.push(audioFiles[tmp.trait]['Early'][tmp.type]);
								}
							});
							if (chosenParts.length === 0){
								if (isLate) chosenAudios = Object.values(audioFiles['noTrait']['Late']);
								else chosenAudios = Object.values(audioFiles['noTrait']['Early']);
							}
							console.log(chosenParts);
							chosenAudios = chosenParts;
							this.latePlaySet10(10.67);
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
						timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
						timeoutIds = [];
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


	latePlaySet10(time) {
		if (chosenAudios.length === 0) chosenAudios = Object.values(audioFiles['noTrait']['Late']);
		if (!triggered) {
			chosenAudios.forEach(sound => {
				const spriteid = sound.play('loop');
				currentSprite = spriteid;
				sound.seek(time, spriteid);
				sound.fade(sound.volume(), 1, 500, spriteid);
			});
			if (time * 1000 <= 154670) {
				const timeoutId = setTimeout(() => {
					triggered = false;
					this.latePlaySet10(0);
				}, 154670 - time * 1000);
				timeoutIds.push(timeoutId);
			}
			else {
				triggered = false;
				this.latePlaySet10(time - 154.67);
			}
		}
		triggered = true;
	}

	earlyPlaySet10(time, volume) {
		if (chosenAudios.length === 0) {
			chosenAudios = Object.values(audioFiles['noTrait']['Early']); // Extract the Howl objects from the Early property
		}
		chosenAudios.forEach(sound => {
			if (!sound.playing()) {
				sound.play('loop');
				sound.seek(time);
			}
			sound.fade(sound.volume(), volume, 500);
		});
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

	musicChangeSet10() {
		let last;
		let time = 10.67;
		let state = false;
		let volume = 0;
		if (chosenAudios != null) {
			last = chosenAudios.length - 1;
			time = chosenAudios[last].seek();
			if (time === 0) time = chosenAudios[last].seek(currentSprite);
			state = chosenAudios[last].playing();
			volume = chosenAudios[last].volume();
			chosenAudios.forEach(sound => {
				sound.fade(volume, 0, 500);
				sound.stop();
			});
		}
		chosenAudios = chosenParts;
		if (state) {
			if (isLate) this.latePlaySet10(time);
			else this.earlyPlaySet10(time, volume);
			// sound.fade(0, volume, 500);
			// sound.seek(time);
		}
	}

	handleSaveSet10 = (event) => {
		if (event && event.preventDefault) {
			event.preventDefault();
		}
		chosenParts = [];
		const buttons = document.getElementsByClassName('trait-button');
		Array.from(buttons).forEach(button => {
			if (button.classList.contains('gradient-text')) {
				const tmp = JSON.parse(button.value);
				console.log(tmp);
				if (isLate) chosenParts.push(audioFiles[tmp.trait]['Late'][tmp.type]);
				else chosenParts.push(audioFiles[tmp.trait]['Early'][tmp.type]);
			}
		});
		if (chosenParts.length === 0){
			if (isLate) chosenAudios = Object.values(audioFiles['noTrait']['Late']);
			else chosenAudios = Object.values(audioFiles['noTrait']['Early']);
		}
		this.musicChangeSet10();
		console.log(chosenParts);
	}
}