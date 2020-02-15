import { EventEmitter } from '@angular/core';



export class AudioService {

    audio;
    public playedProgress = 0;
    public loadedProgress = 0; // Это инверсионное число (если загрузилось 12% то нужно записывать (100% - 12% = 88))
    public playStopSwitcher = false;
    public isTouched = false;
    private currentPosition = 0;
    constructor() {
        this.audio = new Audio();
    }


    ////////////////////////////////////////
    // # Audio controls
    ////////////////////////////////////////

        load = (url): void => {
            this.audio.src = url;
            this.audio.load();
          console.log(url);

        };

        play = (): void => {
            this.audio.currentTime = this.audio.duration * this.currentPosition || 0;
            this.audio.play();
        }

        pause = (): void => {
            this.audio.pause();
        }

        switchPlayStopControl = (id = 0): void => {
            if (this.playStopSwitcher) {
                this.pause();
                this.isTouched = false;
            } else {
                this.play();
                this.isTouched = true;
                this.watchProgress();
            }
            this.playStopSwitcher = !this.playStopSwitcher;
            // this.isTouched = true;
        }

        watchProgress = (): void => {
            this.audio.addEventListener('timeupdate', () => {
                if (this.audio.duration > 0) {
                    this.currentPosition = this.audio.currentTime / this.audio.duration;
                }
            });
        }

        handleSliderChange(event): void {
            this.currentPosition = event;
            this.handlePlayedProgressChange(event * 100);
            if (this.playStopSwitcher) {
              this.play();
            }
        }

        handlePlayedProgressChange(newProgress): void {
            this.playedProgress = newProgress;
        }

        handleLoadedProgressChange(newProgress): void {
            this.loadedProgress = newProgress;
        }

        formatTime(seconds) {
            let minutes: any = Math.floor(seconds / 60);
            minutes = (minutes >= 10) ? minutes : '0' + minutes;
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : '0' + seconds;
            return minutes + ':' + seconds;
        }


}
