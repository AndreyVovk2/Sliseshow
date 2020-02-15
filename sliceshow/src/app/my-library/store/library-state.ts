export class LibraryState {
    currentPage: string;
    acceptFile: string;

    musicLoaded = false;
    photoLoaded = false;
    videoLoaded = false;

    song: {
        id: number,
        name: string,
        file: string,
        belong_to: number,
        duration: number,
        size: number,
        updated_at: string,
        created_at: string,
    };
    video: {
        id: number,
        name: string,
        file: string,
        belong_to: number,
        size: number,
        updated_at: string,
        created_at: string,
        duration?: any,
    };
    photo: {
        id: number,
        name: string,
        file: string,
        belong_to: number,
        size: number,
        updated_at: string,
        created_at: string,
    };

    pendingSong: {
        id: number,
        name: string,
    };

    pendingPhoto: {
        id: number,
        name: string,
    };

    myMusic: this['song'][] = [];
    myVideo: this['video'][] = [];
    myPhoto: this['photo'][] = [];

    pendingSongs: this['pendingSong'][] = [];
    pendingPhotos: this['pendingPhoto'][] = [];


}
