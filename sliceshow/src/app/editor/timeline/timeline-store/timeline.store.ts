import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { TimelineState } from './timeline-state';
// import { EditingStore } from '../../modules/editing-system/editing.store';
import { EditingStore } from '../../store/editing.store';

@Injectable()
export class TimelineStore extends Store<TimelineState> {

    constructor(public editingStore: EditingStore) {
        super(new TimelineState());
        // this.subscribeStateUpdates();
    }

    updateTracks(track: TimelineState['audioTrack']): void {
        this.setState({
            ...this.state,
            audioTracks: this.state.audioTracks.map(v => {
                if (v.id === track.id) {
                    return track;
                }
                return v;
            })
        });
        this.editingStore.state.project.audioTracks = this.state.audioTracks;
    }

    addTrack = (track: TimelineState['musicItem'], trackPath: string): void => {
        console.log(track);
        const newTrack = {
            id: track.id,
            path: trackPath,
            startPosition: this._getStartPosiiton(),
            width: this.calculateTrackWidth(track.duration),
            container: 1,
            volume: 50,
            fadeIn: false,
            fadeOut: false,
            src: track.file,
            playFrom: 0,
            playTo: +track.duration,
            duration: +track.duration,
            parentTrackStart: this._getStartPosiiton(),

        };
        if (this.state.audioTracks.find(item => item.id === track.id)) {
          const generId = track.id + '' + this.state.randomId;
          this.genereteCropId();
          newTrack.id = +generId ;
        }

        this.state.audioTracks.push(newTrack);
        console.log(this.state.audioTracks);
      this.updateTotalAudioDuration(track, 'add');

    }

    updateTotalAudioDuration(track, task: string) {
    console.log(track);
    if (task === 'delete') {
        this.editingStore.state.project.total_audio_duration -= (+track.duration);
    } else if (task === 'add') {
      this.editingStore.state.project.total_audio_duration += (+track.duration);
    }
    // this.editingStore.state.project.total_audio_duration += track.duration;
      // this.editingStore.state.project.total_audio_duration
    }

    checkActiveTrackForCrop(): void {
        const linePos = this.state.scissorsPosition;
        console.log(this.state.scissorsPosition);
        this.state.audioTracks.map(v => {
            if (v.id === this.state.activeTrackId) {

                if (linePos > v.startPosition && linePos < v.startPosition + v.width) {
                    this.cropTrack(v);

                }
            }
        });
        // const v =  this.state.audioTracks[0];
        // if (linePos > v.startPosition && linePos < v.startPosition + v.width) {
        //     this.cropTrack(v);
        //     console.log('worked');
        // }
    }

    genereteCropId() {
        const newRandomId = this.state.randomId + 1;
        this.setState({
            ...this.state,
            randomId: newRandomId
        });
    }

    setTimelineWidth(value: number) {
        this.setState({
            ...this.state,
            timeineWidth: value
        });
    }

    cropTrack = (track: TimelineState['audioTrack']): void => {
        const oneSecondToPixel = 16;
        const linePos = this.state.scissorsPosition;
        const generId = track.id + '' + this.state.randomId;
        const secondWidth = track.width - (linePos - track.startPosition);
        this.genereteCropId();
        let selectTrack;
        let parentPosFirst;
        let parentPosSecond;
        const newTracks = this.state.audioTracks.map(v => {
            if (v.id === track.id) {
                selectTrack = v;


                parentPosFirst = selectTrack.playFrom * (linePos - selectTrack.startPosition) /
                (this.newplayTo(selectTrack, linePos - selectTrack.startPosition) - selectTrack.playFrom);

                console.log((linePos - selectTrack.startPosition) / 16);
                parentPosSecond = this.newplayTo(selectTrack, linePos - selectTrack.startPosition) * secondWidth /
                (selectTrack.playTo - this.newplayTo(selectTrack, linePos - selectTrack.startPosition));



                return { ...v,
                    duration: (linePos - selectTrack.startPosition) / oneSecondToPixel,
                    width: linePos - selectTrack.startPosition,
                    playTo: this.newplayTo(selectTrack, linePos - selectTrack.startPosition),
                    parentTrackStart: selectTrack.startPosition - parentPosFirst};
            } else {
                return v;
            }
        });
        const duplicateTrack = ({...track,
            id: +generId,
            duration: secondWidth / oneSecondToPixel,
            startPosition: linePos,
            width: secondWidth,
            playFrom: this.newplayTo(selectTrack, linePos - selectTrack.startPosition),
            parentTrackStart: linePos - parentPosSecond});
        console.log(duplicateTrack);

        newTracks.push(duplicateTrack);

        this.setState({
            ...this.state,
            audioTracks: newTracks
        });
      this.editingStore.saveProject(this.editingStore.state.project);
    }

    newplayTo = (track: TimelineState['audioTrack'], newWidth: number) => {
        const width = track.width;
        const duration = track.playTo;
        return duration * newWidth / width;
    }

    _getStartPosiiton(): number {
        let endPosition = 0;
        console.log(this.state.audioTracks);
        console.log(this.state);
        this.state.audioTracks.map(track => {
            if (track.container === 1) {
                const currentPosition = track.startPosition + track.width;
                endPosition = currentPosition > endPosition ? currentPosition : endPosition;
            }
        });
        return endPosition;
    }

    calculateTrackWidth(songDuration: TimelineState['musicItem']['duration']): number {
        const ONE_SECOND_WIDTH = 16;
        return Number(songDuration) * ONE_SECOND_WIDTH;
    }

    updateScreens(screen: TimelineState['videoScreen']): void {
        this.setState({
            ...this.state,
            videoScreens: this.state.videoScreens.map(v => {
                if (v.id === screen.id) {
                    return screen;
                }
                return v;
            })
        });
    }

    saveDraggingTrack(draggingTrack: TimelineState['draggingTrack'], clickedTrackMousePosition: number): void {
        this.setState({
            ...this.state,
            draggingTrack,
            clickedTrackMousePosition,
        });
    }

    saveDraggingVideo(draggingScreen: TimelineState['draggingScreen']): void {
        this.setState({
            ...this.state,
            draggingScreen
        });
    }

    setScissorsPosition(scissorsPosition: TimelineState['scissorsPosition']): void {
        this.setState({
            ...this.state,
            scissorsPosition: scissorsPosition - 250
        });
    }

    // checkTrackInRange(start, end): void {
    //     console.log('-------------');
    //         this.removeRenderTracks();
    //         // let num = 0;
    //         if (this.state.audioTracks.length !== 0) {
    //             console.log('-------------');
    //             const renderSongs = this.state.audioTracks.map(v => {

    //                 if ((v.startPosition >= +start && v.startPosition < +end) ||
    //                 (v.startPosition < +start && v.startPosition + v.width > +start)) {
    //                     // return {name: `audio-0${num += 1}.mp3`, type: 'audio', src: v.src};
    //                     return {
    //                         composition: 'main_composition',
    //                         path: v.src,
    //                         startTime: v.parentTrackStart / 160 * 5,
    //                         inPoint: v.startPosition / 160 * 5,
    //                         outPoint: (v.startPosition + v.width) / 160 * 5,
    //                         audioLevel: v.volume,
    //                         fadeIn: v.fadeIn,
    //                         fadeOut: v.fadeOut
    //                     };
    //                     console.log('-------------');
    //                 }
    //             }).filter(i => i);
    //             console.log('-------------');

    //             this.setState({
    //                 ...this.state,
    //                 songsForRendering: renderSongs
    //             });
    //         }
    // }

//     renderTrackForProject(): void {
//         this.removeRenderTracks();
//         // let num = 0;
//         if (this.state.audioTracks.length !== 0) {
//             const renderSongs = this.state.audioTracks.map(v => {
//                 const trackDuration = v.width / 32 * 30;
//                     return {
//                         composition: 'main_composition',
//                         path: v.src,
//                         startTime: v.parentTrackStart / 160 * 5,
//                         inPoint: v.startPosition / 160 * 5,
//                         outPoint: (v.startPosition + v.width) / 160 * 5,
//                         audioLevel: v.volume,
//                         fadeIn: v.fadeIn,
//                         fadeOut: v.fadeOut
//                     };
//             });
//             console.log('-------------');

//             this.setState({
//                 ...this.state,
//                 songsForRendering: renderSongs
//             });
//         }
// }

    // removeRenderTracks(): void {
    //     this.setState({
    //         ...this.state,
    //         songsForRendering: null
    //     });
    // }

    updateActiveTrack(activeTrackId: number): void {
        this.setState({
            ...this.state,
            activeTrackId: Number(activeTrackId)
        });
    }

    toggleVolumePopup(): void {
        this.setState({
            ...this.state,
            isVolumePopupOpened: !this.state.isVolumePopupOpened
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                isVolumeContentOpened: !this.state.isVolumeContentOpened,
            });
        }, 300);
    }

    closeVolumePopup(): void {
        this.setState({
            ...this.state,
            isVolumePopupOpened: false,
            isVolumeContentOpened: false,
        });

    }

    updateTrackVolume(trackId: string, volume: number): void {
        this.setState({
            ...this.state,
            audioTracks: this.state.audioTracks.map(v => {
                if (v.id === Number(trackId)) {
                    return { ...v, volume };
                }
                console.log(v);
                return v;
            })
        });
    }

    getTrackById(trackId: string): TimelineState['audioTrack'] {
        const filteredTracks = this.state.audioTracks.filter(v => v.id === Number(trackId));
        return filteredTracks[0] || null;
    }

    updateZoomValue(zoomValue: number): void {
        this.setState({
            ...this.state,
            zoomValue,
        });
    }

    toggleFadeIn(trackId): void {
        this.setState({
            ...this.state,
            audioTracks: this.state.audioTracks.map(v => {
                if (v.id === trackId) {
                    console.log(v);
                    return { ...v, fadeIn: !v.fadeIn };
                }
                return v;
            })
        });
        // console.log(this.state.audioTracks);
    }

    toggleFadeOut(trackId): void {
        this.setState({
            ...this.state,
            audioTracks: this.state.audioTracks.map(v => {
                if (v.id === trackId) {
                    console.log(v);
                    return { ...v, fadeOut: !v.fadeOut };
                }
                return v;
            })
        });
      // console.log(this.state.audioTracks);
    }

    deleteTrack(trackId, path, width): void {
        console.log(this.editingStore.state.project.audio);
        this.state.audioTracks.map(v => {
           if (v.id === trackId) {
               this.updateTotalAudioDuration(v, 'delete');
           }
        });
        this.setState({
            ...this.state,
            audioTracks: this.state.audioTracks.filter(v => (v.id !== trackId || (v.id === trackId && v.path !== path)))
        });
        console.log(this.state);
        this.editingStore.saveProject(this.editingStore.state.project);
        // this.editingStore.test();
    }

    resetTracksStart(trackId, width) {

        const trackIndex = this.state.audioTracks.findIndex(x =>  x.id === trackId );
        const trackStartPosition = this.state.audioTracks[trackIndex].startPosition;
        if (this.state.audioTracks.length <= 1) {
            return;
        } else {

            for (let i = trackIndex; i < this.state.audioTracks.length; i++) {
            // && this.checkDeletedPosition(trackIndex, width)
                if ((this.state.audioTracks[i].startPosition > trackStartPosition)) {
                  this.state.audioTracks[i].startPosition -= width;
                  this.state.audioTracks[i].parentTrackStart -= width;
                }
            }
        }
    }

    checkDeletedPosition (trackIndex, width) {
        if (trackIndex > 0 && trackIndex < this.state.audioTracks.length) {
          const totalLengthPrevious = this.state.audioTracks[trackIndex - 1].startPosition + this.state.audioTracks[trackIndex - 1].width;
          const totalLengthCurrent = this.state.audioTracks[trackIndex].startPosition + this.state.audioTracks[trackIndex].width;
          const LengthResult = totalLengthCurrent - totalLengthPrevious;
          console.log(LengthResult);
          console.log(width);
          if (LengthResult >= width) {
              return true;
          }
        } else {
            return false;
        }


    }


    toggleMediaState(): void {
        this.setState({
            ...this.state,
            isMediaOpened: !this.state.isMediaOpened,
        });
    }

    getSongs(): any {
        if (this.state.musicLibraryFilters.libraryType === 1) {
            return this.state.musicLibrary.filter((value) => {
                return value.name.search(new RegExp(this.state.musicLibraryFilters.search, 'i')) === 0;
            });
        } else {
            const filteredData = this.state.suggestionLibrary.filter((value) => {
                return value.name.search(new RegExp(this.state.musicLibraryFilters.search, 'i')) === 0
                    && this._sortByStyle(value.style);
            });
            return this._sortByDuration(filteredData);
        }
    }

    _sortByStyle(value): boolean {
        if (this.state.musicLibraryFilters.style === '') {
            return true;
        } else {
            return value === this.state.musicLibraryFilters.style;
        }
    }

    _sortByDuration(data: TimelineState['suggestionLibrary']): TimelineState['suggestionLibrary'] {
        if (this.state.musicLibraryFilters.duration === '') {
            return data;
        } else {
            return data.filter(this._filterDuration);
        }
    }

    _filterDuration = (song): boolean => {
        const { duration } = this.state.musicLibraryFilters;
        const size = Number(song.duration);
        if (duration === '0-1 min') {
            return size < 60;
        } else if (duration === '1-3 min') {
            return size > 60 && size < 180;
        } else {
            return size > 180;
        }
    }

    storeSongs(musicLibrary: TimelineState['musicLibrary']): void {
        this.setState({
            ...this.state,
            musicLibrary,
        });
    }

    storeSuggestionSongs(suggestionLibrary: TimelineState['suggestionLibrary']): void {
        this.setState({
            ...this.state,
            suggestionLibrary,
        });
    }

    updateSongs(musicItem: TimelineState['musicItem']): void {
        this.setState({
            ...this.state,
            musicLibrary: [
                ...this.state.musicLibrary,
                musicItem,
            ],
        });
    }

    addPendingSong(musicPending: TimelineState['musicPending']): void {
        this.setState({
            ...this.state,
            pendingSongs: [
                ...this.state.pendingSongs,
                musicPending,
            ],
        });
    }

    removePendingSong(musicPendingId: TimelineState['musicPending']['id']): void {
        this.setState({
            ...this.state,
            pendingSongs: this.state.pendingSongs.filter(v => v.id !== musicPendingId)
        });
    }

    updateLibraryFilters(musicLibraryFilters: any): void {
        this.setState({
            ...this.state,
            musicLibraryFilters: {
                ...this.state.musicLibraryFilters,
                ...musicLibraryFilters
            },
        });
    }

    // subscribeStateUpdates = (): void => {
    //     this.editingStore.state$.subscribe(state => {
    //       console.log('---------');
    //       console.log(state);
    //       console.log('---------');
    //     });
    //   }


}
