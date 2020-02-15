import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { AppState } from './app-state';
import { ProjectService} from '../services/project.service';

@Injectable()
export class AppStore extends Store<AppState> {
    constructor() {

        super(new AppState());
        this.checkAuth();
    }

    // USER PART

    saveUser(authCredentials: AppState['authCredentials']): void {
        this.setState({
            ...this.state,
            authCredentials,
            isAuthorized: true,

        });
    }

    getUserCredentials(): AppState['authCredentials'] {
        const localData = localStorage.getItem('currentUser');
        try {
            return JSON.parse(localData);
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    checkAuth(): void {
        const creds = this.getUserCredentials();
        if (creds) {
            this.saveUser(creds);
        }
    }

    removeUser(): void {
        this.setState({
            ...this.state,
            authCredentials: null,
            isAuthorized: false,
            addSliceData: null
        });
        localStorage.removeItem('currentUser');
    }

    // SLICE TARIFF PART

    saveSlice(selectSlice: AppState['selectSlice']): void {
        // console.log(selectSlice);
        this.setState({
            ...this.state,
            selectSlice
        });
    }

    removeSlice(): void {
        this.setState({
            ...this.state,
            selectSlice: null
        });
    }

    saveStyleForPlay(animationStyle: AppState['animationStyle']): void { // save style for preview
        this.setState({
            ...this.state,
            animationStyle
        });
    }

    cleanStyleForPlay(): void { // save style for preview
        this.setState({
            ...this.state,
            animationStyle: null
        });
    }

    // saveStyle(animationStyle: AppState['animationStyle']): void {
    //     const selectedStyle = {...animationStyle, clicked: true};
    //     this.setState({
    //         ...this.state,
    //         basket: [
    //             ...this.state.basket,
    //             selectedStyle,
    //         ]
    //     });
    //     this.checkCounters();
    //     this.reloadStyles();
    // }

    removeStyle(animationStyleId: AppState['animationStyle']['id']): void {
        const newAnimationStyle =  this.state.animationStep3.map(v => {
            if (v.id === animationStyleId ) {
                return {...v, clicked: false};
            }
            return v;
        });

        this.setState({
            ...this.state,
            basket: this.state.basket.filter(v => v.id !== animationStyleId),
            animationStep3: newAnimationStyle
        });
        this.countValues();
    }

    saveStyle(animationStyle: AppState['animationStyle']): void { // add style to basket
        const selectedStyle = {...animationStyle, clicked: true};
        const newAnimationStyle =  this.state.animationStep3.map(v => {
            if (v.id === animationStyle.id ) {
                return {
                    ...v,
                    clicked: true,
                    select_pic: +animationStyle.select_pic,
                    select_duration: +animationStyle.select_duration,
                };
            }
            return v;
        });
        // console.log(selectedStyle);
        this.setState({
            ...this.state,
            animationStep3: newAnimationStyle,
            basket: [
                ...this.state.basket,
                selectedStyle,
            ]
        });
        this.countValues();
    }


    saveTariffs(selectSlice: AppState['selectSlice']): void {
        this.setState({
        ...this.state,
            allTariffs: [
                ...this.state.allTariffs,
                selectSlice,
            ],
            selectSlice: null
        });
    }

    saveAllTariffs(allTariffs: AppState['selectSlice'][]): void {
        this.setState({
        ...this.state,
            allTariffs
        });
    }

    checkCounters(): void {
        let pic = 0;
        let duration = 0;
        this.state.basketPics = 0;
        this.state.basketDuration = 0;
        this.state.basket.map(v => pic += v.select_pic);
        this.state.basket.map(v => duration += v.select_duration);
        this.setState({
        ...this.state,
            basketPics: pic,
            basketDuration: duration
        });
    }


    loadAnimationStyles(animationStyle: AppState['animationStep3']): void {
        // console.log(animationStyle);
        const animationStep3 = this._mergeAnimationStyle(animationStyle);
        this.setState({
            ...this.state,
            animationStep3: animationStep3,
        });
    }


    countValues () {
      let images = 0;
      let videos = 0;
      console.log(this.state.basket);
      this.state.basket.map(v => images += v.types.images);
      this.state.basket.map(v => videos += v.types.videos);
      this.setState({
        ...this.state,
        basketImg: images,
        basketVideos: videos,
      });
      this.checkCounters();
      this.countPrice();
    }

    countSelectSlices () { return this.state.basket.length > this.state.selectSlice.slices; }

    countPrice () {
      let price = this.state.selectSlice.price;
      let slicesCount = this.state.selectSlice.slices;
      let maxPictures = this.state.selectSlice.max_pictures;
      let maxVideos = this.state.selectSlice.max_videos;
      while (this.state.basket.length > slicesCount) {
          price += this.state.allTariffs[0].price;
          maxPictures += this.state.allTariffs[0].max_pictures;
          maxVideos += this.state.allTariffs[0].max_videos;
          slicesCount++;
      }

      while (this.state.basketImg > maxPictures) {
          console.log('Lot of images');
          price += this.state.allTariffs[0].price;
          maxPictures += this.state.allTariffs[0].max_pictures;
      }

      while (this.state.basketVideos > maxVideos) {
          console.log('Lot of videos');
          price += this.state.allTariffs[0].price;
          maxVideos += this.state.allTariffs[0].max_videos;

      }
      console.log(price);
      this.setState({
        ...this.state,
        basketTotalPrice: price,
      });
    }

    removeAnimationStyles(): void {
        this.setState({
        ...this.state,
            animationStep3: []
        });
    }

    changeAnimationStyleState(animationStyleState: AppState['animationStyleState']): void {
        this.setState({
        ...this.state,
            animationStyleState
        });
    }


    // PART FOR STEP TWO

    saveCategory(categoryId: number): void {
        this.setState({
            ...this.state,
            listOfCategory: [
                ...this.state.listOfCategory,
                categoryId,
            ],
        });
    }

    deleteCategory(categoryId: number): void {
        this.setState({
            ...this.state,
            listOfCategory: this.state.listOfCategory.filter(v => v !== categoryId),
        });
    }

    clearCategories() {
        this.setState({
            ...this.state,
            listOfCategory: []
        });
    }

    isSelected(categoryId: number) {
        return this.state.listOfCategory.find(k => k === categoryId);
    }

    /**
     * @function merge animation style array from bluprint object with state inital data
     * @returns
     */
    // _mergeAnimationStyle2 = (animationStyle): AppState['animationStep3'] => {
    //     console.log(animationStyle);

    //     const bluprintAnimationStep3 = {
    //         name: '',
    //         clicked: false,
    //         select_pic: 0,
    //         select_duration: 0,
    //     };
    //     if (this.state.basket.length === 0) {
    //         return animationStyle.map(v => ({ ...bluprintAnimationStep3, ...v }));
    //     }

    // }

    _mergeAnimationStyle = (animationStyle): AppState['animationStep3'] => {
        // console.log(animationStyle);
        const bluprintAnimationStep3 = {
            name: '',
            clicked: false,
            select_pic: 0,
            select_duration: 0,
        };


        if (this.state.basket.length === 0) {
            return animationStyle.map(v => ({ ...bluprintAnimationStep3, ...v }));
        } else if (this.state.basket.length > 0) {
            const newAnimStyle = animationStyle.map(e => {
                let count = 0;
                const selectedAnimStyle = {
                    clicked: true,
                    select_pic: 0,
                    select_duration: 0
                };
                this.state.basket.forEach(el => {
                    if (el.id === e.id) {
                        count++;
                        selectedAnimStyle.select_pic = el.select_pic;
                        selectedAnimStyle.select_duration = el.select_duration;
                    }
                });
                if (count === 0) {
                    return {...bluprintAnimationStep3, ...e};
                } else if (count > 0) {
                    return {...selectedAnimStyle, ...e};
                }
            });
            return newAnimStyle;
        }

    }

    // add new slice

    saveAddSliceData(addSliceData: AppState['addSliceData']): void {
      this.setState({
          ...this.state,
          addSliceData: addSliceData
       });
      console.log(this.state.addSliceData);
    }

    getAddSliceData = (): any => this.state.addSliceData;

    setInvoice(invoiceId: AppState['invoiceId']): void {
        this.setState({
            ...this.state,
            invoiceId: invoiceId
        });
    }

    cleanBasket () {
        console.log(this.state);
        this.state.basket = [];
        this.state.basketPics = 0;
        this.state.basketVideos = 0;
        this.state.basketTotalPrice = 0;
    }

}
