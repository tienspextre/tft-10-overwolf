import { InGameView } from '../../windows/in-game/in-game-view.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

let chosenAudios = ['heartsteelEarly1', 'heartsteelEarly2', 'heartsteelEarly3'];
let chosenLateAudios2 = ['heartsteelLate11', 'heartsteelLate22', 'heartsteelLate33'];
let isCarousel = false;
let isMatchEnd = false;
let isLate = false;
let isNoTraitEnded = false;
let audioNoTraitEarly = document.getElementById('noTraitEarly');
let startAudio = document.getElementById('gameStart'); //Audio game start
let winAudio = document.getElementById('matchEndWin');
let loseAudio = document.getElementById('matchEndLose');

export class InGameController {
  constructor() {
    this.inGameView = new InGameView();
    this.hotkeysService = new HotkeysService();
    this.runningGameService = new RunningGameService();
    // this.chosenAudios = ['heartsteelEarly1', 'heartsteelEarly2', 'heartsteelEarly3'];
    this._eventListenerBound = this._eventListener.bind(this);

    this.owEventBus = null;
    
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
        break;
      case 'matchEnd':
      case 'match_start':
        chosenAudios.forEach(i => { //Preplay chosen audios
          let audio = document.getElementById(i);
          audio.currentTime = 0;
          audio.volume = 0;
          audio.play();
          audio.addEventListener("timeupdate", () => {
              this._checkLoopEarly(audio);
          });
        })
        break;
      case 'match_end':
        isHighlight = true;
        isMatchEnd = true;
        this._pauseAllAudio();
        break;
    }

    this.inGameView.logEvent(JSON.stringify(event), isHighlight);
  }

  // Logs info updates
  _infoUpdateHandler(infoUpdate) {
    let isHighlight = false;
    // let playerStatus = JSON.parse(infoUpdate.info.roster.playerStatus);
    if (!isMatchEnd){
      if (infoUpdate.feature === 'match_info') {
        let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
        if (roundType.native_name == 'Carousel' || roundType.native_name == 'Encounter_Carousel' || roundType.native_name == 'Encounter_Group'){  //Carousel audio
          isCarousel = true;
          isHighlight = true;
          chosenAudios.forEach(i => {  //Reset chosen audios after carousel
            let audio = document.getElementById(i);
            audio.pause();
            audio.currentTime = 0;
          })
          let audioStartCar = document.getElementById('carouselStart'); //Carousel start audio
          let audioCar = document.getElementById('carousel'); //Carousel audio
          audioStartCar.play();
          audioStartCar.addEventListener("timeupdate", () => {
            if (audioStartCar.currentTime >= 0.9){ //End carousel start audio
              audioStartCar.pause();
              audioStartCar.currentTime = 0;
              audioCar.play(); //Start carousel audio
            }
          });
        }
        else {
          let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
          let stageNumber = roundType.stage;
          let stage = parseInt(stageNumber.split("-")[0]);
          if (isCarousel){ //Check if last round is carousel
            isCarousel = false;
            let audioCar = document.getElementById('carousel'); //Carousel audio
            let audioEndCar = document.getElementById('carouselEnd'); //Carousel end audio
            audioCar.pause();
            audioCar.currentTime = 0;
            audioEndCar.play(); // Start carousel end audio
            audioEndCar.addEventListener("timeupdate", () => {
              if (audioEndCar.currentTime >= 1.8){ //End carousel end audio
                audioEndCar.pause();
                audioEndCar.currentTime = 0;
                chosenAudios.forEach(i => { //Replay chosen audios after carousel
                  let audio = document.getElementById(i);
                  audio.play();
                })
              }
            });
          }
          else if (stage > 1){
            if (isNoTraitEnded == false){
              isNoTraitEnded = true; //Check if it isn't the first stage -> end no trait audio
              this._pauseAllAudio();
              chosenAudios.forEach(i => {
                let audio = document.getElementById(i);
                audio.play();
                audio.volume = 1;
                this._fadeInAudio(audio);
                audio.addEventListener("timeupdate", () => {
                  this._checkLoopEarly(audio);
                });
              });
            }
          }
          else {
            if (stageNumber == '1-1'){
              isHighlight = true;
              audioNoTraitEarly.volume = 0;
              startAudio.play();
              startAudio.addEventListener("timeupdate", () => {
                if (startAudio.currentTime >= 50.5){ //End audio game start
                  this._fadeOutAudio(startAudio);
                  startAudio.pause();
                  audioNoTraitEarly.currentTime = 56.5;
                  this._fadeInAudio(audioNoTraitEarly); //Start audio no trait early
                  audioNoTraitEarly.play();
                }
              });
            }
            else if (startAudio.paused){
              if (audioNoTraitEarly.paused){
                audioNoTraitEarly.currentTime = 56.5;
                this._fadeInAudio(audioNoTraitEarly); //Start audio no trait early
                audioNoTraitEarly.play();
              }
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
                if (player.health <= 20 && isLate == false) {
                  isLate = true;
                  this._pauseAllAudio();
                  chosenAudios = ['heartsteelLate1', 'heartsteelLate2', 'heartsteelLate3']; // At least one player has 0 health
                  chosenAudios.forEach(i => {
                    let audio = document.getElementById(i);
                    audio.currentTime = 10.62;
                    audio.play();
                    audio.addEventListener("timeupdate", () => {
                        this._checkLoopLate(audio);
                    });
                  });
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
      if (playerRank > 1) loseAudio.play();
      else if (playerRank == 1) winAudio.play();
    }
  }  

  _checkLoopEarly(audio) {
      if (audio.currentTime >= 191.77) {
        audio.pause();
        chosenAudios.forEach(i => {
          let audio1 = document.getElementById(i);
          audio1.pause();
          audio1.currentTime = 0;
          audio1.play();
        })
      }
  }

  _checkLoopLate(audio) {
    if (audio.currentTime >= 165.05) {
      audio.pause();
      chosenAudios.forEach(i => {
        let audio1 = document.getElementById(i);
        audio1.pause();
        audio1.currentTime = 10.62;
        audio1.play();
      })
    }
}

  _fadeInAudio(audioElement) {
    const duration = 2000; // Animation duration in milliseconds
    const startVolume = audioElement.volume;
    const targetVolume = 1.0;
    const volumeIncrement = (targetVolume - startVolume) / (duration / 20); // Adjust increment for smoother animation
    const volumeInterval = setInterval(() => {
        if (audioElement.volume < targetVolume) {
          audioElement.volume += volumeIncrement;
        } else {
            clearInterval(volumeInterval); // Stop interval when volume reaches target
        }
    }, 20);
  }

  _fadeOutAudio(audioElement) {
    const duration = 2000; // Animation duration in milliseconds
    const startVolume = audioElement.volume;
    const targetVolume = 0;
    const volumeDecrement = (startVolume - targetVolume) / (duration / 20); // Adjust increment for smoother animation
    const volumeInterval = setInterval(() => {
        if (audioElement.volume < targetVolume) {
          audioElement.volume -= volumeDecrement;
        } else {
            clearInterval(volumeInterval); // Stop interval when volume reaches target
        }
    }, 20);
  }

  _pauseAllAudio(){
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.pause();
    });
  }
}
