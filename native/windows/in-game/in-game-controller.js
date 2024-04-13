import { InGameView } from '../../windows/in-game/in-game-view.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

let _heartsteelAudios = ['heartsteel1', 'heartsteel2', 'heartsteel3'];
let isCarousel = false;
const infoUpdateStructure = {
  info: {
    match_info: {
      round_type: {
        stage: "",
        name: "",
        type: "",
        native_name: "" // or "Encounter_Carousel" or some other value
        // other properties of round_type
      }
      // other properties of match_info
    }
    // other properties of info
  },
  feature: ""
  // other properties of infoUpdate
};

export class InGameController {
  constructor() {
    this.inGameView = new InGameView();
    this.hotkeysService = new HotkeysService();
    this.runningGameService = new RunningGameService();
    // this._heartsteelAudios = ['heartsteel1', 'heartsteel2', 'heartsteel3'];
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
        isHighlight = true;
        let audioStart1 = document.getElementById('start1');
        audioStart1.volume = 0;
        audioStart1.play();
        audioStart1.pause();
        _heartsteelAudios.forEach(i => {
          let audio = document.getElementById(i);
          audio.currentTime = 0;
          audio.volume = 0;
          audio.play();
          audio.addEventListener("timeupdate", () => {
              this._checkLoop(audio);
          });
        })
        let startAudio = document.getElementById('gameStart');
        startAudio.play();
        startAudio.addEventListener("timeupdate", () => {
          if (startAudio.currentTime >= 50.5){
            this._fadeOutAudio(startAudio);
            startAudio.pause();
            audioStart1.currentTime = 56.5;
            this._fadeInAudio(audioStart1);
            audioStart1.play();
          }
        });
        break;
      case 'match_end':
        isHighlight = true;
        break;
    }

    this.inGameView.logEvent(JSON.stringify(event), isHighlight);
  }

  // Logs info updates
  _infoUpdateHandler(infoUpdate) {
    let isHighlight = false;
  
    if (infoUpdate.feature === 'match_info') {
      // isHighlight = true;
      let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
      if (roundType.native_name == 'Carousel' || roundType.native_name == 'Encounter_Carousel'){
        isCarousel = true;
        isHighlight = true;
        _heartsteelAudios.forEach(i => {
          let audio = document.getElementById(i);
          audio.pause();
          audio.currentTime = 0;
        })
        let audioStartCar = document.getElementById('carouselStart');
        let audioCar = document.getElementById('carousel');
        // let audioEndCar = document.getElementById('carouselEnd');
        audioStartCar.play();
        audioStartCar.addEventListener("timeupdate", () => {
          if (audioStartCar.currentTime >= 0.9){
            audioStartCar.pause();
            audioStartCar.currentTime = 0;
            audioCar.play();
          }
        });
      }
      else {
        let roundType = JSON.parse(infoUpdate.info.match_info.round_type);
        let stageNumber = roundType.stage;
        let stage = parseInt(stageNumber.split("-")[0]);
        if (isCarousel){
          isCarousel = false;
          let audioCar = document.getElementById('carousel');
          let audioEndCar = document.getElementById('carouselEnd');
          audioCar.pause();
          audioCar.currentTime = 0;
          audioEndCar.play();
          audioEndCar.addEventListener("timeupdate", () => {
            if (audioEndCar.currentTime >= 1.8){
              audioEndCar.pause();
              audioEndCar.currentTime = 0;
              _heartsteelAudios.forEach(i => {
                let audio = document.getElementById(i);
                audio.play();
              })
            }
          });
        }
        // if (stage == 1 && stageNumber != '1-1'){
        //   let startAudio = document.getElementById('gameStart');
        //   if (startAudio.currentTime > 0) {
        //     startAudio.pause();
        //     startAudio.currentTime = 0;
        //   };
        // }
        else if (stage > 1){
          this._pauseAllAudio();
          _heartsteelAudios.forEach(i => {
            let audio = document.getElementById(i);
            audio.play();
            this._fadeInAudio(audio);
          });
        }
      }
      this.inGameView.logInfoUpdate(JSON.stringify(infoUpdate), isHighlight);
    }
  }  

  _checkLoop(audio) {
      if (audio.currentTime >= 191.77) { // 192 seconds = 3 minutes and 12 seconds
        audio.pause();
        _heartsteelAudios.forEach(i => {
          let audio1 = document.getElementById(i);
          audio1.pause();
          audio1.currentTime = 0;
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
