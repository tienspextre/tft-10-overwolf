import { kWindowNames } from '../../scripts/constants/window-names.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { WindowsService } from '../../scripts/services/windows-service.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { GepService } from '../../scripts/services/gep-service.js';
import { EventBus } from '../../scripts/services/event-bus.js';
import { GoogleAnalytics } from '../../scripts/services/google-analytics.js';
import { kGameClassIds, kGamesFeatures } from '../../scripts/constants/games-features.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

const kdaEarlyFiles = ['../../music/set10/kda early drum.webm', '../../music/set10/kda early main.webm', '../../music/set10/kda early secondary.webm'];
const pentakillEarlyFiles = ['../../music/set10/pentakill early drum.webm', '../../music/set10/pentakill early main.webm', '../../music/set10/pentakill early secondary.webm'];
const trueDamageEarlyFiles = ['../../music/set10/true dmg early drum.webm', '../../music/set10/true dmg early main.webm', '../../music/set10/true dmg early secondary.webm'];
const heartsteelEarlyFiles = ['../../music/set10/heartsteel early drum.webm', '../../music/set10/heartsteel early main.webm', '../../music/set10/heartsteel early secondary.webm'];
const discoEarlyFiles = ['../../music/set10/disco early drum.webm', '../../music/set10/disco early main.webm'];
const bit8EarlyFiles = ['../../music/set10/8bit early drum.webm', '../../music/set10/8bit early main.webm'];
const emoEarlyFiles = ['../../music/set10/emo early drum.webm', '../../music/set10/emo early main.webm'];
const punkEarlyFiles = ['../../music/set10/punk early drum.webm', '../../music/set10/punk early main.webm'];
const countryEarlyFiles = ['../../music/set10/country early drum.webm', '../../music/set10/country early main.webm'];
const noTraitEarlyFiles = ['../../music/set10/no trait 1.webm'];
const jazzEarlyFiles = ['../../music/set10/jazz early.webm'];
const maestroEarlyFiles = ['../../music/set10/maestro early.webm'];
const mixmasterEarlyFiles = ['../../music/set10/mixmaster early.webm'];
const illbeatsEarlyFiles = ['../../music/set10/illbeats early.webm'];
const hyperpopEarlyFiles = ['../../music/set10/hyperpop early.webm'];

const kdaLateFiles = ['../../music/set10/late/kda late drum.webm', '../../music/set10/late/kda late main.webm', '../../music/set10/late/kda late secondary.webm'];
const pentakillLateFiles = ['../../music/set10/late/pentakill late drum.webm', '../../music/set10/late/pentakill late main.webm', '../../music/set10/late/pentakill late secondary.webm'];
const trueDamageLateFiles = ['../../music/set10/late/true dmg late drum.webm', '../../music/set10/late/true dmg late main.webm', '../../music/set10/late/true dmg late secondary.webm'];
const heartsteelLateFiles = ['../../music/set10/late/heartsteel late drum.webm', '../../music/set10/late/heartsteel late main.webm', '../../music/set10/late/heartsteel late secondary.webm'];
const discoLateFiles = ['../../music/set10/late/disco late drum.webm', '../../music/set10/late/disco late main.webm'];
const bit8LateFiles = ['../../music/set10/late/8bit late drum.webm', '../../music/set10/late/8bit late main.webm'];
const emoLateFiles = ['../../music/set10/late/emo late drum.webm', '../../music/set10/late/emo late main.webm'];
const punkLateFiles = ['../../music/set10/late/punk late drum.webm', '../../music/set10/late/punk late main.webm'];
const countryLateFiles = ['../../music/set10/late/country late drum.webm', '../../music/set10/late/country late main.webm'];
const noTraitLateFiles = ['../../music/set10/late/no trait 2.webm'];
const jazzLateFiles = ['../../music/set10/late/jazz late.webm'];
const maestroLateFiles = ['../../music/set10/late/maestro late.webm'];
const mixmasterLateFiles = ['../../music/set10/late/mixmaster late.webm'];
const illbeatsLateFiles = ['../../music/set10/late/illbeats late.webm'];
const hyperpopLateFiles = ['../../music/set10/late/hyperpop late.webm'];

var globalVolume = 1;

const audioNoTraitEarly = new Howl({
	src: ['../../music/set10/no trait 1.webm'],
	volume: 0, 
  sprite: {
    loop: [6840, 192000, true]
  },

});

const startAudio = new Howl({
	src: ['../../music/set10/start.webm'],
	volume: 1, 

});

const winAudio = new Howl({
	src: ['../../music/set10/win.webm'],
	volume: 1, 

});

const loseAudio = new Howl({
	src: ['../../music/set10/lose.webm'],
	volume: 1, 

});

const audioStartCar = new Howl({
	src: ['../../music/set10/carousel start.webm'],
	volume: 1, 

});

const audioCar = new Howl({
	src: ['../../music/set10/carousel kda + jazz.webm'],
	volume: 1, 

});

const audioEndCar = new Howl({
	src: ['../../music/set10/carousel end.webm'],
	volume: 1, 

});

var audioFiles = {
  noTrait: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/no trait 1.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/no trait 2.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
    }
  },
  kda: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/kda early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/kda early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/kda early secondary.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/kda late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/kda late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/kda late secondary.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  pentakill: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/pentakill early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/pentakill early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/pentakill early secondary.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/pentakill late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/pentakill late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/pentakill late secondary.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  trueDamage: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/true dmg early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/true dmg early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/true dmg early secondary.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/true dmg late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/true dmg late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/true dmg late secondary.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  heartsteel: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/heartsteel early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/heartsteel early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/heartsteel early secondary.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/heartsteel late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/heartsteel late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/heartsteel late secondary.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  disco: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/disco early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/disco early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/disco late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/disco late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  bit8: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/8bit early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/8bit early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/8bit late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/8bit late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  emo: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/emo early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/emo early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/emo late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/emo late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  edm: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/edm early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0,

      }),
      main: new Howl({
        src: ['../../music/set10/edm early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0,

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/edm late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0,

      }),
      main: new Howl({
        src: ['../../music/set10/late/edm late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0,

      })
    }
  },
  punk: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/punk early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/punk early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/punk late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/punk late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  country: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/country early drum.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/country early main.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/country late drum.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      }),
      main: new Howl({
        src: ['../../music/set10/late/country late main.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  jazz: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/jazz early.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/jazz late.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  maestro: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/maestro early.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/maestro late.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  mixmaster: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/mixmaster early.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/mixmaster late.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  illbeats: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/illbeats early.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/illbeats late.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  },
  hyperpop: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/hyperpop early.webm'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/hyperpop late.webm'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 

      })
    }
  }
};


var audioFilesSet12 = {
  bunny: {
    first: {
      init: new Howl({
        src: ['../../music/set12/start first.webm'],
        volume: 1, 

      }),
      combat: new Howl({
        src: ['../../music/set12/bunny first combat.webm'],
        volume: 1, 
        sprite: {
          loop: [0, 121840, true]
        },

      }),
      nonCombat: new Howl({
        src: ['../../music/set12/bunny first non-combat.webm'],
        volume: 1, 
        sprite: {
          loop: [0, 121840, true]
        },

      })
    },
    second: {
      init: new Howl({
        src: ['../../music/set12/start second.webm'],
        volume: 1, 

      }),
      combat: new Howl({
        src: ['../../music/set12/bunny second combat.webm'],
        volume: 1, 
        sprite: {
          loop: [0, 114000, true]
        },

      }),
      nonCombat: new Howl({
        src: ['../../music/set12/bunny second non-combat.webm'],
        volume: 1, 
        sprite: {
          loop: [0, 114000, true]
        },
        
      })
    }
  }
}

export class BackgroundController {
  constructor() {
    this.runningGameService = new RunningGameService();
    this.hotkeysService = new HotkeysService();
    this.owEventBus = new EventBus();
    this.owEventsStore = [];
    this.owInfoUpdatesStore = [];
    this.shutdownTimeout = null;
    this.hasMultipleMonitors = null;
    this.ga = new GoogleAnalytics();
  }


  async run() {
    // These objects will be available via calling
    // overwolf.windows.getMainWindow() in other windows
    window.owEventBus = this.owEventBus;
    window.owEventsStore = this.owEventsStore;
    window.owInfoUpdatesStore = this.owInfoUpdatesStore;
    window.owAudioFiles = audioFiles;
    window.owstartAudio = startAudio;
    window.owwinAudio = winAudio;
    window.owloseAudio = loseAudio;
    window.owaudioStartCar = audioStartCar;
    window.owaudioCar = audioCar;
    window.owaudioEndCar = audioEndCar;
    window.ownoTraitEarly = audioNoTraitEarly;
    window.owAudioFilesSet12 = audioFilesSet12;

    this.hasMultipleMonitors = await BackgroundController._hasMultipleMonitors();

    // Register handlers to hotkey events
    this._registerHotkeys();

    await this._restoreLaunchWindow();

    // Switch between desktop/in-game windows when launching/closing game
    this.runningGameService.addGameRunningChangedListener(isRunning => {
      this._onRunningGameChanged(isRunning);
    });

    overwolf.extensions.onAppLaunchTriggered.addListener(e => {
      if (e && e.source !== 'gamelaunchevent') {
        this._restoreAppWindow();
      }
    });

    // Listen to changes in window states
    overwolf.windows.onStateChanged.addListener(() => {
      this._onWindowStateChanged();
    });

    this.ga.start();
    this.ga.ga('send', 'pageview');
  }

  /**
   * App was launched with game launch
   * @private
   */
  static _launchedWithGameEvent() {
    return location.href.includes('source=gamelaunchevent');
  }

  /**
   * This PC has multiple monitors
   * @private
   */
  static async _hasMultipleMonitors() {
    const monitors = await WindowsService.getMonitorsList();

    return (monitors.length > 1);
  }

  /**
   * Handle game opening/closing
   * @private
   */
  async _onRunningGameChanged(isGameRunning) {
    if (!isGameRunning) {
      // Open desktop window
      WindowsService.restore(kWindowNames.DESKTOP);
      Howler.stop();
      // Close game windows
      WindowsService.close(kWindowNames.IN_GAME);
      WindowsService.close(kWindowNames.SECOND);
      return;
    }

    const gameInfo = await this.runningGameService.getRunningGameInfo();

    if (
      !gameInfo ||
      !gameInfo.isRunning ||
      !gameInfo.classId ||
      !kGameClassIds.includes(gameInfo.classId)
    ) {
      return;
    }

    // Clear the stored data when a new game starts
    this.owEventsStore.length = 0;
    this.owInfoUpdatesStore.length = 0;

    const gameFeatures = kGamesFeatures.get(gameInfo.classId);

    if (gameFeatures && gameFeatures) {
      // Register to game events
      GepService.setRequiredFeatures(
        gameFeatures,
        e => this._onGameEvents(e),
        e => this._onInfoUpdate(e)
      );
    }

    // Open in-game window
    await this._restoreGameWindow();

    // Close desktop window
    await WindowsService.close(kWindowNames.DESKTOP);
  }

  resetOriginalVolume() {
    // Reset each Howl instance's volume to its original value
    audioNoTraitEarly.volume(0);
    startAudio.volume(1);
    winAudio.volume(1);
    loseAudio.volume(1);
    audioStartCar.volume(1);
    audioCar.volume(1);
    audioEndCar.volume(1);
    audioFiles.forEach(trait => {
      trait[Early].forEach(sound => {
        sound.volume(0);
      });
      trait[Late].forEach(sound => {
        sound.volume(0);
      });
    });
    audioFilesSet12.forEach(trait => {
      trait[first].forEach(sound => {
        sound.volume(1);
      })
      trait[second].forEach(sound => {
        sound.volume(1);
      })
    })
  }

  /**
   * Open the relevant window on app launch
   * @private
   */
  async _restoreLaunchWindow() {
    const gameInfo = await this.runningGameService.getRunningGameInfo();

    if (!gameInfo || !gameInfo.isRunning) {
      await WindowsService.restore(kWindowNames.DESKTOP);
      return;
    }

    if (!kGameClassIds.includes(gameInfo.classId)) {
      return;
    }

    const gameFeatures = kGamesFeatures.get(gameInfo.classId);

    if (gameFeatures && gameFeatures) {
      GepService.setRequiredFeatures(
        gameFeatures,
        e => this._onGameEvents(e),
        e => this._onInfoUpdate(e)
      );
    }

    // If app was not launched automatically, restore the a relevant game window
    if (!BackgroundController._launchedWithGameEvent()) {
      await this._restoreGameWindow();
    }
  }

  /**
   * Open the relevant window on user request
   * @private
   */
  async _restoreAppWindow() {
    const isGameRunning = await this.runningGameService.isGameRunning();

    if (isGameRunning) {
      await this._restoreGameWindow();
    } else {
      await WindowsService.restore(kWindowNames.DESKTOP);
    }
  }

  /**
   * Restore the relevant game window, in-game or on second screen,
   * depending on whether the user has a second screen
   * @private
   */
  _restoreGameWindow() {
    if (this.hasMultipleMonitors) {
      return WindowsService.restore(kWindowNames.SECOND);
    } else {
      return WindowsService.restore(kWindowNames.IN_GAME);
    }
  }

  /**
   * Listen to window state changes,
   * and close the app when all UI windows are closed
   * @private
   */
  async _onWindowStateChanged() {
    if (await this._canShutdown()) {
      this._startShutdownTimeout();
    } else {
      this._stopShutdownTimeout();
    }
  }

  /**
   * Check whether we can safely close the app
   * @private
   */
  async _canShutdown() {
    const isGameRunning = await this.runningGameService.isGameRunning();

    // Never shut down the app when a game is running,
    // so we won't miss any events
    if (isGameRunning) {
      return false;
    }

    const states = await WindowsService.getWindowsStates();

    // If all UI (non-background) windows are closed, we can close the app
    return Object.entries(states)
      .filter(([windowName]) => (windowName !== kWindowNames.BACKGROUND))
      .every(([windowName, windowState]) => (windowState === 'closed'));
  }

  /**
   * Start shutdown timeout, and close after 10 if possible
   * @private
   */
  _startShutdownTimeout() {
    this._stopShutdownTimeout();

    this.shutdownTimeout = setTimeout(async () => {
      if (await this._canShutdown()) {
        window.close(); // Close the whole app
      }
    }, 10000);
  }

  /**
   * Stop shutdown timeout
   * @private
   */
  _stopShutdownTimeout() {
    if (this.shutdownTimeout !== null) {
      clearTimeout(this.shutdownTimeout);
      this.shutdownTimeout = null;
    }
  }

  /**
   * Set custom hotkey behavior
   * @private
   */
  _registerHotkeys() {
    this.hotkeysService.setToggleHotkeyListener(kHotkeyToggle, () => {
      this._onHotkeyTogglePressed();
    });

    this.hotkeysService.setToggleHotkeyListener(kHotkeySecondScreen, () => {
      this._onHotkeySecondScreenPressed();
    });
  }

  /**
   * Handle toggle hotkey press
   * @private
   */
  async _onHotkeyTogglePressed() {
    const states = await WindowsService.getWindowsStates();

    if (WindowsService.windowStateIsOpen(states[kWindowNames.SECOND])) {
      WindowsService.close(kWindowNames.SECOND);
      return;
    }

    if (WindowsService.windowStateIsOpen(states[kWindowNames.IN_GAME])) {
      WindowsService.close(kWindowNames.IN_GAME);
    } else {
      WindowsService.restore(kWindowNames.IN_GAME);
    }
  }

  /**
   * Handle second screen hotkey press
   * @private
   */
  async _onHotkeySecondScreenPressed() {
    const states = await WindowsService.getWindowsStates();

    if (WindowsService.windowStateIsOpen(states[kWindowNames.SECOND])) {
      WindowsService.close(kWindowNames.SECOND);
      WindowsService.restore(kWindowNames.IN_GAME);
    } else {
      WindowsService.restore(kWindowNames.SECOND);
      WindowsService.close(kWindowNames.IN_GAME);
    }
  }

  /**
   * Pass events to windows that are listening to them
   * @private
   */
  _onGameEvents(data) {
    data.events.forEach(event => {
      this.owEventsStore.push(event);

      this.owEventBus.trigger('event', event);

      if (event.name === 'matchStart') {
        this._restoreGameWindow();
      }
    });
  }

  /**
   * Pass info updates to windows that are listening to them
   * @private
   */
  _onInfoUpdate(infoUpdate) {
    this.owInfoUpdatesStore.push(infoUpdate);

    this.owEventBus.trigger('info', infoUpdate);
  }
}
