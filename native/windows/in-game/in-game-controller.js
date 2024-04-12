import { InGameView } from '../../windows/in-game/in-game-view.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

let _heartsteelAudios = ['heartsteel1', 'heartsteel2', 'heartsteel3'];
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
            if (startAudio.currentTime >= 57){
              startAudio.pause();
              audioStart1.currentTime = 
              audioStart1.volume = 0.25;
              audioStart1.volume = 0.5;
              audioStart1.volume = 0.75;
              audioStart1.volume = 1;
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
      switch (roundType.name) {
        case 'Carousel':
          isHighlight = true;
          break;
        case 'Encounter_Carousel':
          isHighlight = true;
          break;
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

  _fadeInAudio(audioElement, duration) {
    let volume = 0;
    let interval = 50; // Adjust this value to control the smoothness of the fade-in
    let step = 1 / (duration / interval);
  
    let fadeInInterval = setInterval(function() {
      if (volume < 1) {
        volume += step;
        audioElement.volume = volume;
      } else {
        clearInterval(fadeInInterval);
      }
    }, interval);
  }
}
