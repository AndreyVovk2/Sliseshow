import { Injectable, OnInit } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { EditingState } from './editing-state';
import { ProjectService } from '../../shared/services/project.service';
import { NotifierService } from 'angular-notifier';
import { SocketService } from '../socket-service';
import { TimelineState } from '../timeline/timeline-store/timeline-state';
import { AppStore } from '../../shared/store/app.store';



@Injectable()
export class EditingStore extends Store<EditingState> {
    ioConnection: any;
    templateCompleted: boolean;
    changePosState = true;
    validArr: any;
    // disableAutoRender = true;
  // private timelineStore: TimelineStore,

    constructor(
        private projectService: ProjectService,
        private socketService: SocketService,
        private readonly notifier: NotifierService,
        private appStore: AppStore) {
        super(new EditingState());

    }



    saveProjectData(project: EditingState['project']): void {
        if (project.audio && project.audio.length > 0) {
          this.state.timelineState.audioTracks = project.audio;
          console.log(project.audio);
        }

        const changedState = {
            ...this.state,
            project,
            readyToMarge: false,
            allTemplatesAreRendering: false,
            activeAnimationStyle: project.animation[0],
            activeTemplate: project.animation[0].screens[0],
            disableAutoRender: false,
        };
        this._isAnimationStyleCompleted(changedState);
        // console.log(changedState);
        this.setState(changedState);
        this._countUsedScreens(changedState);
        this._isTemplateCompleted(changedState);
        this.checkReadyToMarge();
        console.log(this.state.project);
        console.log('UPDATED');
    }

    checkReadyToMarge() {
        // console.log(this.state.readyToMarge);
      this.state.readyToMarge = this.state.project.animation.every(v => v.rendered === true);
    }

    saveTimeline(timelineState: TimelineState): void {
        this.setState({
            ...this.state,
            timelineState
        });
    }

    setDomain(nodeDomain: string): void {
        this.setState({
            ...this.state,
            nodeDomain
        });
    }

    getProjectData = (): EditingState['project'] => this.state.project;

    getTemplates = (): any => this.state.project ? this.state.activeAnimationStyle.screens : [];

    getStyles = (): any => this.state.project ? this.state.project.animation : [];

    getMedias(): any {
        const { activeTemplate, project, activeAnimationStyle} = this.state;

        if (!!(project && project.animation && activeTemplate && activeAnimationStyle)) {
            return activeAnimationStyle.screens.find(el => el.id === activeTemplate.id).medias;
        }
        return [];
    }

    getText(): any {
        const { activeTemplate, project, activeAnimationStyle} = this.state;

        if (!!(project && project.animation && activeTemplate && activeAnimationStyle)) {
            return activeAnimationStyle.screens.find(el => el.id === activeTemplate.id).text;
        }
        return [];
    }

    storeMedia = (newMediaLink: string) => {
        const changedState = { ...this.state };
        this._addMedia(changedState, newMediaLink);
        this.updateStore(changedState);
    }

    storeText = (newText: string, textPosition: number) => {
        const changedState = { ...this.state };
        this._addText(changedState, newText, textPosition);
        this.updateStore(changedState);
    }

    updateStore(changedState) {
        this._isTemplateCompleted(changedState);
        this._countUsedScreens(changedState);
        this.setState(changedState);
        this.saveProject(changedState.project);
        console.log(this.state.activeMediaParam);

    }

    _addText = (state, text, pos) => {
        const index = state.activeAnimationStyle.screens
            .findIndex(x => x.id === this.state.activeTemplate.id);

        state.activeAnimationStyle.screens[index].text[pos].value = text;
        return;
    }

    _addMedia = (state, link) => {
        const activeMediaParam = state.activeMediaParam;
        const index = state.activeAnimationStyle.screens
            .findIndex(x => x.id === this.state.activeTemplate.id);

        state.activeAnimationStyle.screens[index].medias.map((media) => {
            if (media.layer === activeMediaParam.layer) {
                return media.link = link;
            }
            return media;
        });
        console.log(this.state);
        return;
    }

    _addCropMedia = () => {
        const changedState = { ...this.state };
        const activeMediaParam = changedState.activeMediaParam;
        const index = changedState.activeAnimationStyle.screens
             .findIndex(x => x.id === this.state.activeTemplate.id);

            changedState.activeAnimationStyle.screens[index].medias.map((media) => {
            if (media.layer === activeMediaParam.layer) {
                return media.crop = activeMediaParam.crop;
            }
            return media;
        });
        this.clearCropParam(changedState);
        this.updateStore(changedState);
        return;
    }

    clearCropParam(changedState) {
        changedState.activeMediaParam.crop = null;
    }

    _isTemplateCompleted = (state) => {
        let allCompleted = false;
        let isCompleted = false;
        let textCompleted = false;
        const index = state.activeAnimationStyle.screens
            .findIndex(x => x.id === state.activeTemplate.id);

        isCompleted = !state.activeAnimationStyle.screens[index].medias
        || state.activeAnimationStyle.screens[index].medias.every((media) => {
            return media.link;
        });


        textCompleted = !state.activeAnimationStyle.screens[index].text || state.activeAnimationStyle.screens[index].text.every((text) => {
            return text.value;
        });

        if (isCompleted && textCompleted) {
            state.activeAnimationStyle.screens[index].completed = true;
            allCompleted = true;
            if (this._isAnimationStyleCompleted(state) && this.state.disableAutoRender && !this.state.activeAnimationStyle.is_rendering) {

                this.projectRender(state);
            } else {
                this._setNextTemplateActive(state);
            }

        } else {
            state.activeAnimationStyle.screens[index].completed = false;
            allCompleted = false;
        }
        this._isAnimationStyleCompleted(this.state);
        this.state.readyToRemoveWatemark = allCompleted;
        return allCompleted;

    }

    _isAnimationStyleCompleted = (state) => {
        // console.log(state);
        this.templateCompleted = false;
        this.templateCompleted = state.activeAnimationStyle.screens.every((screen) => {
            return screen.completed;
        });

        return this.templateCompleted;
    }

    _setNextTemplateActive = (state) => {
        const index = state.activeAnimationStyle.screens
            .findIndex(x => x.id === this.state.activeTemplate.id);

        // console.log(index, state.activeAnimationStyle.screens[index + 1]);

        if (state.activeAnimationStyle.screens[index + 1]) {
            state.activeTemplate = state.activeAnimationStyle.screens[index + 1];
        }
        return;
    }

    _setNextAnimationActive(state) {
        const index = state.project.animation
            .findIndex(x => !x.is_rendering);
        if (index !== -1) {
            console.log('_setNextAnimationActive');
            // console.log(this.state.project.animation[index].id);
            this.setActiveStateStyle(state.project.animation[index], state);
            // console.log(state.activeAnimationStyle.id, this.state.activeAnimationStyle.id);
        }  else {
            console.log('_setNextAnimationActive_ELSE');
            state.allTemplatesAreRendering = true;
        }
    }



    clearTemplate(id: number): void {
        const changedState = { ...this.state };

        changedState.activeAnimationStyle.screens = this.state.activeAnimationStyle.screens.map(v =>
            v.id === id ? { ...v, medias: v.medias.map(e => ({ ...e, link: '' })) } : v);

        this.setState(changedState);
    }

    setRenderingStatusTemplate(status: boolean): void {
        const changedState = { ...this.state };
        changedState.activeAnimationStyle.is_rendering = status;
        // console.log(status);
        this.setState(changedState);
    }


      setActiveTemplate(activeTemplate: EditingState['activeTemplate']): void {
        this.setState({
          ...this.state,
          activeTemplate,
        });
        // console.log(activeTemplate);
      }

    setActiveStyle(activeAnimationStyle: EditingState['activeAnimationStyle']): void {
      console.log(activeAnimationStyle);
        this.setState({
            ...this.state,
            activeAnimationStyle,
        });

        this._countUsedScreens(this.state);
        this.setActiveTemplate(this.state.activeAnimationStyle.screens[0]);

    }

    setActiveStateStyle(activeAnimationStyle: EditingState['activeAnimationStyle'], state: EditingState): void {
        state.activeAnimationStyle = activeAnimationStyle;
        state.activeTemplate = activeAnimationStyle.screens[0];


        this._countUsedScreens(state);
        // this.setActiveStyle(state.activeAnimationStyle);
        this.setState(state);
    }


    setActiveMedia(activeMediaParam: EditingState['activeMediaParam']): void {
        this.setState({
            ...this.state,
            activeMediaParam,
        });
    }


    removeMedias(): void {
        const changedState = { ...this.state };

        const index = changedState.activeAnimationStyle.screens
            .findIndex(x => x.id === this.state.activeTemplate.id);

        changedState.activeAnimationStyle.screens[index].medias.map(e =>
            e.layer === this.state.activeMediaParam.layer ? { ...e, link: '' } : e);

        this.setRenderingStatusTemplate(false);

        this.setState(changedState);
        this.saveProject(changedState.project);
    }

    removeMedia(name): void {
        const changedState = { ...this.state };

        this._clearMedia(changedState, changedState.activeTemplate.id, name);
        // this._isTemplateCompleted(changedState);
        this._countUsedScreens(changedState);

        this.setState(changedState);
        this.saveProject(changedState.project);
    }

    _clearMedia = (state, screen_id, name) => {
        const screen_index = state.activeAnimationStyle.screens
            .findIndex(x => x.id === screen_id);

        const media_index = state.activeAnimationStyle.screens[screen_index].medias
            .findIndex(x => x.name === name);

        this.setRenderingStatusTemplate(false);
        state.activeAnimationStyle.is_rendering = false;
        state.activeAnimationStyle.screens[screen_index].medias[media_index].link = '';
        state.activeAnimationStyle.screens[screen_index].completed = false;
        state.activeAnimationStyle.screens[screen_index].crop = null;
        state.activeAnimationStyle.screens[screen_index].cropPosition = null;
        this.setState(state);
    }



    _countUsedScreens(state): any {
        if (state.project) {
            const { screens } = state.activeAnimationStyle;
            const allScreen = [];
            state.project.animation.forEach(v => {
                v.screens.map(e => {
                    allScreen.push(e);
                });
            });
            // console.log(allScreen);
            // console.log(allScreen[0].medias.length);
            state.allMedia = 0;
            state.usedScreens = 0;
            state.usedMedia = 0;
            let tempUsedMedia = 0;

            state.allScreens = screens.length;

            allScreen.forEach(v => {
                if (v.medias !== null && v.medias.length !== 0) {
                    state.allMedia += v.medias.length;
                    v.medias.forEach(media => {
                        tempUsedMedia += media.link ? 1 : 0;
                    });
                    state.usedMedia += tempUsedMedia;
                    tempUsedMedia = 0;
                }
            });


            screens.map(screen => {
                state.usedScreens += screen.completed ? 1 : 0;
            });
        }
    }

    covertText(textObj, index) {
    const obj = {
      composition: textObj.composition, layer: textObj.layer, value: textObj.value, color: [], opacity: 1, colorNative: true
    };
    if (textObj.color) {
        const pp = textObj.color.match(/\(([^)]+)\)/)[1];
        const tt = pp.split(',');
        const vv = tt.map(v => +v);
        if (vv.length === 3) {
          obj.color = vv;
          obj.opacity = 1;
        } else if (vv.length === 4) {
          obj.color = vv.slice(0, -1);
          obj.opacity = vv[3];
        }
    } else {
        obj.color = [0, 0, 0];
    }
    return obj;
    }


    countAnimationPositions (animationId) {
        let position;
        let start = 0;
        let end = 0;
        let previousEnd = 0;

        for (let i = 0; i < this.state.project.animation.length; i++) {
            const animation = this.state.project.animation[i];

            end += animation.duration;
          // if (this.state.activeAnimationStyle.id === animation.id) {
            if (animationId === animation.id) {
                if (i === 0) {
                    start = 0;
                } else {
                  previousEnd += this.state.project.animation[--i].duration;
                  // start = +((Math.round(end * 100) / 100) - (Math.round(animation.duration * 100) / 100));
                    // start = test.toFixed(2);
                  // start = end - animation.duration;
                  start = previousEnd;
                }
                break;
            }
        }

        position = {start, end};
        return position;
    }

    projectRender = (state) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const lastIndex = state.activeAnimationStyle.screens.length - 1;
        const currentAnimEnd = state.activeAnimationStyle.duration;
        let position;
        state.activeAnimationStyle.rendered = false;
        // console.log(state.activeAnimationStyle.rendered);
        let audioArray = [];
        if (state.timelineState.audioTracks.length !== 0) {
            position = this.countAnimationPositions(this.state.activeAnimationStyle.id);

          audioArray = this.checkTrackInRange(position.start,
            position.end);
        }

        const videoArray = [];
        const textArray = [];
        const imagesArray = [];

        this.renderTrackForProject();
        state.activeAnimationStyle.screens.map((v, index) => {
            if (v.text) {
                v.text.map(e => {
                    textArray.push(this.covertText(e, index));
                });
            }
        });
        if (state.activeAnimationStyle.screens) {
            state.activeAnimationStyle.screens.map((e, inx) => {
                // console.log(e);
                if (e.medias) {
                    e.medias.map(v => {
                        if (v.type === 'video') {
                            if (v.crop) {
                                videoArray.push({
                                    composition: v.composition,
                                    layer: v.layer,
                                    path: v.link.slice(v.link.indexOf('library')),
                                    audioLevel : v.crop.audioLevel,
                                    inPoint: v.crop.inPoint,
                                    outPoint: v.crop.outPoint,
                                    startTime: v.crop.startTime
                                });
                            } else {
                                videoArray.push({layer: v.layer,
                                    path: v.link.slice(v.link.indexOf('library')), composition: v.composition});
                            }
                        } else if (v.type === 'image') {
                            imagesArray.push({layer: v.layer, path: v.link.slice(v.link.indexOf('library')), composition: v.composition, crop: e.crop});
                        }
                    });
                }

             });
        }



        const renderTemplate = {
            data: {
                user_id: user.id,
                project_id: this.state.project.id,
                animation_id: state.activeAnimationStyle.id,
                token: user.token,
            },
            project: {
                template: state.activeAnimationStyle.ae_file_name,
                // composition: 'main_composition',
                composition: state.activeAnimationStyle.format[0].composition,
                type: 'composition',
                assets: [
                    {
                        name: state.activeAnimationStyle.ae_file_name,
                        type: 'project',
                        src:  `${state.activeAnimationStyle.ae_file_path}`
                    },
                    // ...screenArray,
                ],
                // watermark: {composition: state.activeAnimationStyle.format[0].composition},
                texts: [
                    ...textArray
                ],
                audios: [
                    ...audioArray
                ],
                videos: [
                    ...videoArray
                ],
                images: [
                    ...imagesArray
                ]
            },
        };

        state.activeAnimationStyle.is_rendering = true;
        this.setState({
          ...state
        });
        const id = this.state.project.animation.findIndex(x => x.id === this.state.activeAnimationStyle.id);
        this.state.project.animation[id].is_rendering = true;
        this._setNextAnimationActive(state);
        // this.state.activeAnimationStyle.is_rendering = true;
        this.notifier.notify('success', 'Screen rendering started!');
        this.socketService.sendEvent('start-render', renderTemplate);

        // console.log(renderTemplate);


    }

    saveRenderedTemplate(data): void {
        this.isActiveTemplate(data.animation_id, data.link);
        let link;
        if (data.project_id === this.state.project.id) {
            console.log('HERE', data.animation_id, this.state);



            this.state.project.animation = this.state.project.animation.map(v => {
                if (v.id === data.animation_id) {
                    this.state.allTemplatesAreRendering = false;
                    const ret = {
                        ...v, is_rendering: false, rendered: true, video_stream: this.state.nodeDomain + data.link
                    };
                    link = this.state.nodeDomain + data.link;

                    // console.log(v.id, ret);
                    return ret;
                } else {
                    return v;
                }
            });

            if (this.state.project.animation.length === 1) {
                this.state.project.complete_url = link;
            }

            // console.log(this.state.project.animation);
            this.state.readyToMarge = this.state.project.animation.every(v => v.rendered === true);
            // this.state.readyToRemoveWatemark =
          // this.state.project.animation.every(v => v.screens.every(screen => screen.completed === true));
            console.log(this.state.readyToMarge);
            this.setState(this.state);
            this.storeProjectData(this.state.project);
        }
    }


    isActiveTemplate(id: number, link: string): void {
        if (this.state.activeAnimationStyle.id === id) {
            const t = {...this.state.activeAnimationStyle,
                rendered: true,
                is_rendering: false,
                video_stream: this.state.nodeDomain + link
            };
        this.state.activeAnimationStyle = t;
        this.setState(this.state);
        }
    }


    templateRenderError(data): void {
        if (data.project_id === this.state.project.id) {
            // const changedState = { ...this.state };
            console.log('HERE', data.animation_id, this.state);


            this.state.project.animation = this.state.project.animation.map(v => {
                if (v.id === data.animation_id) {
                    this.state.allTemplatesAreRendering = false;
                    const ret = {
                        ...v, is_rendering: false, rendered: false
                    };

                    // console.log(v.id, ret);
                    return ret;
                } else {
                    return v;
                }
            });

            // console.log(this.state.project.animation);
            this.setState(this.state);
        }
    }

    getCurrentVideoLink() {
        const idx = this.state.project.animation
            .findIndex(x => x.id === this.state.activeAnimationStyle.id);

        if ('video_stream' in this.state.activeAnimationStyle) {
            return this.state.activeAnimationStyle.video_stream;
        } else if (this.state.project.animation[idx].preview_video) {
            return this.state.project.animation[idx].preview_video;
        } else {
            return '';
        }
    }


    saveProject = (project: EditingState['project']): void => {
        // console.log(project);
        const changedState = {
            ...this.state,
            project
        };
        changedState.project.audio = this.state.timelineState.audioTracks;
        this._countUsedScreens(changedState);
        this.storeProjectData(changedState.project);
        this.setState(changedState);
        console.log(this.state.project);
        // console.log(changedState);
    }

    storeProjectData = (data = this.state.project) => {
      this.changePosState = false;
        // console.log(data);
        this.projectService.updateProject(data)
            .subscribe(response => {
              this.changePosState = true;
                this.notifier.notify('success', 'Project autosaved');
                console.log(response);
                console.log(this.state.activeTemplate);
            }, (error) => {
              this.changePosState = true;
              console.log(error);
            });
    }

    // WORKING WITH AUDIO

  checkTrackInRange(start, end) {
    // console.log(start, end);
    // console.log(this.state.timelineState);
    this.removeRenderTracks();
    if (this.state.timelineState.audioTracks.length !== 0) {
      const renderSongs = this.state.timelineState.audioTracks.map(v => {
        // ЗМІНЕНО ТУТ
        // console.log(+start, +end);
        // console.log(v.startPosition / 16, v.width / 16);

        const startPositionSecond =  v.startPosition / 16;
        const endPositionSecond =  (v.startPosition + v.width) / 16;
        const parentStartPositionSecond = v.parentTrackStart / 16;

        // startPosition >= +start && startPosition < +end


        // if ((v.startPosition >= +start && v.startPosition < +end) ||
        //   (v.startPosition < +start && v.startPosition + v.width > +start))


        if ((startPositionSecond >= +start && startPositionSecond <= +end) ||
          (startPositionSecond < +start && endPositionSecond >= +start)) {
          return {
            path: v.src.slice(v.src.indexOf('library')),
            startTime: parentStartPositionSecond - start,
            inPoint: startPositionSecond - start,
            outPoint: endPositionSecond - start,
            audioLevel: v.volume,
            fadeIn: v.fadeIn,
            fadeOut: v.fadeOut
          };
        }
                }).filter(i => i);

               return renderSongs;

            }
    }

    renderTrackForProject(): void {
        this.removeRenderTracks();
        if (this.state.timelineState.audioTracks.length !== 0) {
            const renderSongs = this.state.timelineState.audioTracks.map(v => {
                const trackDuration = v.width / 32 * 30;
                    // ЗМІНЕНО ТУТ
                    return {
                        composition: 'main_composition',
                        path: v.src.slice(v.src.indexOf('library')),
                        startTime: v.parentTrackStart / 16,
                        inPoint: v.startPosition / 16,
                        outPoint: (v.startPosition + v.width) / 16,
                        // startTime: v.parentTrackStart / 160 * 5,
                        // inPoint: v.startPosition / 160 * 5,
                        // outPoint: (v.startPosition + v.width) / 160 * 5,
                        audioLevel: v.volume,
                        fadeIn: v.fadeIn,
                        fadeOut: v.fadeOut
                    };
            });

            this.state.timelineState.songsForRendering = renderSongs;
        }
    }

    removeRenderTracks(): void {
        this.state.timelineState.songsForRendering = [];
    }

    fullTemplateForTesting() {
        console.log('fullTEMPLATEFORTESTING');
        const imageUrl = 'https://slice.grassbusinesslabs.ml/storage/library/photos/photo_25951542708286.png';
        const videoUrl = 'https://slice.grassbusinesslabs.ml/storage/library/videos/video_13641540395652.mp4';
        const videoDuration = 9;
        const newTemplate = this.state.activeAnimationStyle;
        console.log(newTemplate);
        let med;
        let text;
        newTemplate.screens = newTemplate.screens.map(v => {
            if (v.medias) {
            med = v.medias.map(i => {
                if (i.type === 'image') {
                    const newImage = {...i, link: imageUrl};
                    return newImage;
                }
                if (i.type === 'video') {
                    const newVideo = {...i, link: videoUrl, duration: videoDuration};
                    return newVideo;
                }
            });
            } else { med = []; }
            if (v.text) {
            text = v.text.map(t => {
                    const newText = {...t, value: 'Test text'};
                    return newText;
            });
            } else { text = []; }
            const screen = {...v, medias: med, text: text};
            return screen;
        });

        this.setActiveStyle(newTemplate);
        newTemplate.screens.forEach(item => this._isTemplateCompleted(this.state));
    }


    startMargeTemplates() {
        const data = this.getMergeData();
        // {
        //     user_id: this.state.project.user_id,
        //     project_id: this.state.project.id,
        //     duration: +this.state.project.total_video_duration,
        //     videos: []
        // };
        // this.state.project.animation.forEach(item => data.videos.push(item.id));

        this.socketService.sendEvent('merge-start', (data));
        this.statusCheckResult(true, this.state.project.renderAndMerge);
        console.log(this.state.project);
        console.log(data);
        this.notifier.notify('success', 'Template marge started!');
    }

    getMergeData() {
        const data = {
            user_id: this.state.project.user_id,
            project_id: this.state.project.id,
            duration: +this.state.project.total_video_duration,
            videos: []
        };
        this.state.project.animation.forEach(item => data.videos.push(item.id));
        return data;
    }

    saveMerged(data) {
        const {user_id, project_id, path} = data;
        console.log(user_id, project_id, path);
        if (this.state.project.id === project_id && this.state.project.user_id === user_id) {
            this.state.project.complete_url = this.state.nodeDomain + path;
        }
        console.log(path);
        this.setState(this.state);
        this.storeProjectData(this.state.project);
        console.log(path);
    }

    testFunc() {
      this.state.project.animation.map(v => {
        this.countAnimationPositions(v.id);
      });
    }

    getRenderDataForMerge(payedQuality = '') {
        console.log('YOUAREHERE');
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const lastIndex = this.state.activeAnimationStyle.screens.length - 1;

        const projects = this.state.project.animation.map(v => {
            // const currComposition = this.setComposition(v, payedQuality);

            const videoArray = [];
            const textArray = [];
            const imagesArray = [];
            let audioArray = [];

            // if (this.state.timelineState.audioTracks.length !== 0) {
            //   const position = this.countAnimationPositions();
            //   console.log(position);
            //   audioArray = this.checkTrackInRange(position.start, position.end);
            // }
          if (this.state.timelineState.audioTracks.length !== 0) {
              // const position = this.countAnimationPositions();
              const position = this.countAnimationPositions(v.id);
              // console.log(position);
              audioArray = this.checkTrackInRange(position.start, position.end);
            }

          v.screens.forEach((i, index) => {
                if (i.text) {
                    i.text.forEach(e => {
                        textArray.push(this.covertText(e, index));
                    });
                }
                if (i.medias) {
                    i.medias.forEach(e => {
                        if (e.type === 'video') {
                            if (e.crop) {
                                videoArray.push({
                                    composition: e.composition,
                                    layer: e.layer,
                                    path: e.link.slice(e.link.indexOf('library')),
                                    audioLevel : e.crop.audioLevel,
                                    inPoint: e.crop.inPoint,
                                    outPoint: e.crop.outPoint,
                                    startTime: e.crop.startTime
                                });
                            } else {
                                // ЗМІНЕНО ТУТ
                                videoArray.push({layer: e.layer, path: e.link.slice(e.link.indexOf('library')),
                                    composition: e.composition});
                                // console.log(videoArray);
                            }

                        } else if (e.type === 'image') {

                            imagesArray.push({layer: e.layer, path: e.link.slice(e.link.indexOf('library')), composition: e.composition});
                            // console.log(imagesArray);
                        }
                    });
                }
            });

            // console.log(currComposition);
            const renderTemplate = {
                data: {
                    user_id: user.id,
                    project_id: this.state.project.id,
                    animation_id: v.id,
                    token: user.token,
                },
                project: {
                    template: v.ae_file_name,
                    // composition: 'main_composition',
                    composition: this.setComposition(v, payedQuality),
                    type: 'composition',
                    settings: {
                        // outputModule: 'Lossless',
                        // outputModule: 'Render240p',
                        // startFrame: state.activeAnimationStyle.screens[0].start_frame,
                        // endFrame: state.activeAnimationStyle.screens[lastIndex].end_frame,
                        // outputExt: 'avi'
                        // outputExt: 'mov'
                    },
                    assets: [
                        {
                            name: v.ae_file_name,
                            type: 'project',
                            src:  `${v.ae_file_path}`
                        },
                        // ...screenArray,
                    ],
                    // watermark: {composition: v.format[0].composition},
                    texts: [
                        ...textArray
                    ],
                    audios: [
                        ...audioArray
                    ],
                    videos: [
                        ...videoArray
                    ],
                    images: [
                        ...imagesArray
                    ]
                }
            };
            console.log(renderTemplate.project);
            return {...renderTemplate};

        });

        console.log(projects);
        return projects;

    }

    setComposition(currentAnimation, payedQuality = '') {
        let composition = '';
        console.log(payedQuality);
        console.log(currentAnimation);
        currentAnimation.format.forEach(format => {
           if (format.quality === payedQuality) {
               console.log(format.composition);
               composition = format.composition;
           }
        });

        return composition;
    }

    startRenderAndMerge(payedQuality = '') {
        const body = {};
        body['merge'] = this.getMergeData();
        body['renders'] = this.getRenderDataForMerge(payedQuality);
        this.socketService.sendEvent('renderAndMerge-start', body);
        this.statusCheckResult(this.state.project.mergeStatus, true);
        this.notifier.notify('success', 'Screen render and merge started!');
        console.log(body);
        this.socketService.onEvent('renderAndMerge-error').subscribe( () => {
           this.statusCheckResult(this.state.project.mergeStatus, false);
           this.notifier.notify('error', 'Render and merge error');
        });
    }

    async getCurrentTariff(id: number) {
        console.log(id);
        const currTariff = await this.projectService.getOneTariff(id).toPromise();
        const defTariff = await this.projectService.getOneTariff(1).toPromise();
        const currTar = {'currTariff': currTariff};
        const defTar = {'defTariff': defTariff};
        const allTariffs = Object.assign(currTar, defTar);
        return allTariffs;
    }

    countTypes() {
        const types = {images: 0, videos: 0};
        this.state.project.animation.forEach(animation => {
            types.images += animation.types.images;
            types.videos += animation.types.videos;
        });
        console.log(types);
        return types;
    }


    countPrice () {
      let allTariffs;
      const typesObj = this.countTypes();
      this.getCurrentTariff(this.state.project.tariff_id).then(
        (result) => {
          allTariffs = result;
          this.countDifferent(typesObj, allTariffs);
      }, (error) => {
          console.log(error);
      });

    }

    countDifferent (currTypes, allTariffs)  {
        // console.log(allTariffs);
        // console.log(currTypes);
        let final_price = allTariffs.currTariff.price;
        let imagesCount = allTariffs.currTariff.max_pictures;
        let videoCount = allTariffs.currTariff.max_videos;
        let slicesCount = allTariffs.currTariff.slices;
        while (this.state.project.animation.length > slicesCount) {
            final_price += allTariffs.defTariff.price;
            imagesCount += allTariffs.defTariff.max_pictures;
            videoCount += allTariffs.defTariff.max_videos;
            slicesCount++;

        }
        while (currTypes.images > imagesCount) {
            imagesCount += allTariffs.defTariff.max_pictures;
            final_price += allTariffs.defTariff.price;
        }
        while (currTypes.videos > videoCount) {
            videoCount += allTariffs.defTariff.max_videos;
            final_price += allTariffs.defTariff.price;
        }
         this.state.project.final_price = final_price;
         console.log(this.state.project.final_price);
        // console.log(price);
    }

    getAllQualities () {
        this.projectService.getQualities().subscribe( (result) => {
            // console.log(result);
        }, (error) => {
            console.log('getAllQualities ERROR');
            console.log(error);
        });
    }

    waterMarkValid () {
        if (this.state.project) {
          return this.state.project.animation.every(e =>
            (e.screens.every(screen => screen.completed === true)));
        } else {
            return false;
        }
    }

    freePreviewValid () {
        if (this.state.project) {
            return this.state.project.animation.every( e => e.is_rendering === false) &&
              !this.state.project.renderAndMerge;
        } else {
            return false;
        }
    }

    statusCheckResult (merge = false, renderAndMerge = false) {
        this.state.project.mergeStatus = merge;
        this.state.project.renderAndMerge = renderAndMerge;
        // console.log(this.state.project);
    }

    mediaButtonsValid () {
        if (this.state.project) {
          return this.state.activeAnimationStyle.is_rendering || this.state.project.mergeStatus || this.state.project.renderAndMerge;
        } else {
            return true;
        }
    }


    changeTemplatesDirection(direction: string, index): void {
      const animationArr = this.state.project.animation;
      if (direction === 'left' && index > 0 && this.changePosState) {
        const temporary = JSON.parse(JSON.stringify(animationArr[index - 1]));
        animationArr[index - 1] = JSON.parse(JSON.stringify(animationArr[index]));
        animationArr[index] = JSON.parse(JSON.stringify(temporary));
        this.storeProjectData();
      } else if (direction === 'right' && index < animationArr.length - 1 && this.changePosState) {
        const temporary = JSON.parse(JSON.stringify(animationArr[index + 1]));
        animationArr[index + 1] = JSON.parse(JSON.stringify(animationArr[index]));
        animationArr[index] = JSON.parse(JSON.stringify(temporary));
        this.storeProjectData();
      }

    }

    deleteProjectPart(slicePos) {
      console.log(slicePos);
      const prAnimation = this.state.project.animation;
      const activeAnimId = this.state.activeAnimationStyle.id;
      console.log(this.state.project.animation);
      if (prAnimation.length > 1) {
        console.log(this.state.project.animation);
        if (slicePos === prAnimation.length - 1 && activeAnimId === prAnimation[slicePos].id) {
          this.setActiveStyle(prAnimation[slicePos - 1]);
        } else if (activeAnimId === prAnimation[slicePos].id) {
          this.setActiveStyle(prAnimation[slicePos + 1]);
        }
        prAnimation.splice(slicePos, 1);
        this.storeProjectData();
      }

      // this.setActiveStyle(this.state.project.animation[slicePos]);
    }


}
