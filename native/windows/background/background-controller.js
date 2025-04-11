import { kWindowNames } from '../../scripts/constants/window-names.js';
import { RunningGameService } from '../../scripts/services/running-game-service.js';
import { WindowsService } from '../../scripts/services/windows-service.js';
import { HotkeysService } from '../../scripts/services/hotkeys-service.js';
import { GepService } from '../../scripts/services/gep-service.js';
import { EventBus } from '../../scripts/services/event-bus.js';
import { GoogleAnalytics } from '../../scripts/services/google-analytics.js';
import { kGameClassIds, kGamesFeatures } from '../../scripts/constants/games-features.js';
import { kHotkeySecondScreen, kHotkeyToggle } from '../../scripts/constants/hotkeys-ids.js';

const kdaEarlyFiles = ['../../music/set10/kda early drum.ogg', '../../music/set10/kda early main.ogg', '../../music/set10/kda early secondary.ogg'];
const pentakillEarlyFiles = ['../../music/set10/pentakill early drum.ogg', '../../music/set10/pentakill early main.ogg', '../../music/set10/pentakill early secondary.ogg'];
const trueDamageEarlyFiles = ['../../music/set10/true dmg early drum.ogg', '../../music/set10/true dmg early main.ogg', '../../music/set10/true dmg early secondary.ogg'];
const heartsteelEarlyFiles = ['../../music/set10/heartsteel early drum.ogg', '../../music/set10/heartsteel early main.ogg', '../../music/set10/heartsteel early secondary.ogg'];
const discoEarlyFiles = ['../../music/set10/disco early drum.ogg', '../../music/set10/disco early main.ogg'];
const bit8EarlyFiles = ['../../music/set10/8bit early drum.ogg', '../../music/set10/8bit early main.ogg'];
const emoEarlyFiles = ['../../music/set10/emo early drum.ogg', '../../music/set10/emo early main.ogg'];
const punkEarlyFiles = ['../../music/set10/punk early drum.ogg', '../../music/set10/punk early main.ogg'];
const countryEarlyFiles = ['../../music/set10/country early drum.ogg', '../../music/set10/country early main.ogg'];
const noTraitEarlyFiles = ['../../music/set10/no trait 1.ogg'];
const jazzEarlyFiles = ['../../music/set10/jazz early.ogg'];
const maestroEarlyFiles = ['../../music/set10/maestro early.ogg'];
const mixmasterEarlyFiles = ['../../music/set10/mixmaster early.ogg'];
const illbeatsEarlyFiles = ['../../music/set10/illbeats early.ogg'];
const hyperpopEarlyFiles = ['../../music/set10/hyperpop early.ogg'];

const kdaLateFiles = ['../../music/set10/late/kda late drum.ogg', '../../music/set10/late/kda late main.ogg', '../../music/set10/late/kda late secondary.ogg'];
const pentakillLateFiles = ['../../music/set10/late/pentakill late drum.ogg', '../../music/set10/late/pentakill late main.ogg', '../../music/set10/late/pentakill late secondary.ogg'];
const trueDamageLateFiles = ['../../music/set10/late/true dmg late drum.ogg', '../../music/set10/late/true dmg late main.ogg', '../../music/set10/late/true dmg late secondary.ogg'];
const heartsteelLateFiles = ['../../music/set10/late/heartsteel late drum.ogg', '../../music/set10/late/heartsteel late main.ogg', '../../music/set10/late/heartsteel late secondary.ogg'];
const discoLateFiles = ['../../music/set10/late/disco late drum.ogg', '../../music/set10/late/disco late main.ogg'];
const bit8LateFiles = ['../../music/set10/late/8bit late drum.ogg', '../../music/set10/late/8bit late main.ogg'];
const emoLateFiles = ['../../music/set10/late/emo late drum.ogg', '../../music/set10/late/emo late main.ogg'];
const punkLateFiles = ['../../music/set10/late/punk late drum.ogg', '../../music/set10/late/punk late main.ogg'];
const countryLateFiles = ['../../music/set10/late/country late drum.ogg', '../../music/set10/late/country late main.ogg'];
const noTraitLateFiles = ['../../music/set10/late/no trait 2.ogg'];
const jazzLateFiles = ['../../music/set10/late/jazz late.ogg'];
const maestroLateFiles = ['../../music/set10/late/maestro late.ogg'];
const mixmasterLateFiles = ['../../music/set10/late/mixmaster late.ogg'];
const illbeatsLateFiles = ['../../music/set10/late/illbeats late.ogg'];
const hyperpopLateFiles = ['../../music/set10/late/hyperpop late.ogg'];

var globalVolume = 1;

const audioNoTraitEarly = new Howl({
	src: ['../../music/set10/no trait 1.webm'],
	volume: 0, 
  sprite: {
    loop: [6840, 192000, true]
  },

});

const startAudio = new Howl({
	src: ['../../music/set10/start.ogg'],
	volume: 1, 
  preload: true
});

const winAudio = new Howl({
	src: ['../../music/set10/win.ogg'],
	volume: 1, 

});

const loseAudio = new Howl({
	src: ['../../music/set10/lose.ogg'],
	volume: 1, 

});

const audioStartCar = new Howl({
	src: ['../../music/set10/carousel start.ogg'],
	volume: 1, 

});

const audioCar = new Howl({
	src: ['../../music/set10/carousel kda + jazz.mp3'],
	volume: 1, 

});

const audioEndCar = new Howl({
	src: ['../../music/set10/carousel end.ogg'],
	volume: 1, 

});

var audioFiles = {
  noTrait: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/no trait 1.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: true
      }),
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/no trait 2.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: true 

      }),
    }
  },
  kda: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/kda early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true 
      }),
      main: new Howl({
        src: ['../../music/set10/kda early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/kda early secondary.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/kda late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/kda late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/kda late secondary.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  pentakill: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/pentakill early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/pentakill early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/pentakill early secondary.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/pentakill late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/pentakill late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/pentakill late secondary.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  trueDamage: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/true dmg early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/true dmg early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/true dmg early secondary.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/true dmg late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/true dmg late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/true dmg late secondary.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  heartsteel: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/heartsteel early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/heartsteel early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/heartsteel early secondary.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/heartsteel late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/heartsteel late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      secondary: new Howl({
        src: ['../../music/set10/late/heartsteel late secondary.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  disco: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/disco early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/disco early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/disco late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/disco late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  bit8: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/8bit early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/8bit early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/8bit late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/8bit late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  emo: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/emo early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/emo early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/emo late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/emo late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  edm: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/edm early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true 

      }),
      main: new Howl({
        src: ['../../music/set10/edm early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true 

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/edm late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true 

      }),
      main: new Howl({
        src: ['../../music/set10/late/edm late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true 

      })
    }
  },
  punk: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/punk early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/punk early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/punk late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/punk late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  country: {
    Early: {
      drum: new Howl({
        src: ['../../music/set10/country early drum.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/country early main.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      drum: new Howl({
        src: ['../../music/set10/late/country late drum.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      }),
      main: new Howl({
        src: ['../../music/set10/late/country late main.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  jazz: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/jazz early.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/jazz late.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  maestro: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/maestro early.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/maestro late.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  mixmaster: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/mixmaster early.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/mixmaster late.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  illbeats: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/illbeats early.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/illbeats late.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  },
  hyperpop: {
    Early: {
      main: new Howl({
        src: ['../../music/set10/hyperpop early.ogg'],
        sprite: {
          loop: [6840, 192000, true]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    },
    Late: {
      main: new Howl({
        src: ['../../music/set10/late/hyperpop late.ogg'],
        sprite: {
          loop: [0, 167000]
        },
        volume: 0, 
        preload: false,
        html5: true  

      })
    }
  }
};


var audioFilesSet12 = {
  bunny: {
    first: {
      init: new Howl({
        src: ['../../music/set12/start first.ogg'],
        volume: 1, 

      }),
      combat: new Howl({
        src: ['../../music/set12/bunny first combat.ogg'],
        volume: 1, 
        sprite: {
          loop: [0, 121840, true]
        },

      }),
      nonCombat: new Howl({
        src: ['../../music/set12/bunny first non-combat.ogg'],
        volume: 1, 
        sprite: {
          loop: [0, 121840, true]
        },

      })
    },
    second: {
      init: new Howl({
        src: ['../../music/set12/start second.ogg'],
        volume: 1, 

      }),
      combat: new Howl({
        src: ['../../music/set12/bunny second combat.ogg'],
        volume: 1, 
        sprite: {
          loop: [0, 114000, true]
        },

      }),
      nonCombat: new Howl({
        src: ['../../music/set12/bunny second non-combat.ogg'],
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
      this.resetOriginalMusicState();
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
    WindowsService.bringToFront(kWindowNames.IN_GAME);

    // Close desktop window
    await WindowsService.close(kWindowNames.DESKTOP);
  }

  resetOriginalMusicState() {
    // Reset each Howl instance's volume to its original value
    Howler.stop();
    // Howler.unload();
    // startAudio.load();
    // audioFiles['noTrait']['Late']['main'].load();
    // audioFiles['noTrait']['Early']['main'].load();
    // audioCar.load();
    // audioEndCar.load();
    // audioStartCar.load();
    // winAudio.load();
    // loseAudio.load();
    // audioNoTraitEarly.load();
    // audioNoTraitEarly.volume(0);
    // startAudio.volume(1);
    // winAudio.volume(1);
    // loseAudio.volume(1);
    // audioStartCar.volume(1);
    // audioCar.volume(1);
    // audioEndCar.volume(1);
    // audioFiles.forEach(trait => {
    //   trait[Early].forEach(sound => {
    //     sound.volume(0);
    //   });
    //   trait[Late].forEach(sound => {
    //     sound.volume(0);
    //   });
    // });
    // audioFilesSet12.forEach(trait => {
    //   trait[first].forEach(sound => {
    //     sound.volume(1);
    //   })
    //   trait[second].forEach(sound => {
    //     sound.volume(1);
    //   })
    // })
  }

  /**
   * Open the relevant window on app launch
   * @private
   */
  async _restoreLaunchWindow() {
    const gameInfo = await this.runningGameService.getRunningGameInfo();

    if (!gameInfo || !gameInfo.isRunning) {
      await WindowsService.restore(kWindowNames.DESKTOP);
      this.resetOriginalMusicState();
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
      // WindowsService.bringToFront(kWindowNames.IN_GAME);
    } else {
      await WindowsService.restore(kWindowNames.DESKTOP);
      this.resetOriginalMusicState();
    }
  }

  /**
   * Restore the relevant game window, in-game or on second screen,
   * depending on whether the user has a second screen
   * @private
   */
  _restoreGameWindow() {
    // if (this.hasMultipleMonitors) {
    //   return WindowsService.restore(kWindowNames.SECOND);
    // } else {
      return WindowsService.restore(kWindowNames.IN_GAME);
    // }
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
