
export class TimelineState {
    zoomValue = 1;
    clickedTrackMousePosition: number;
    activeTrackId: number = null;
    isVolumePopupOpened = false;
    isVolumeContentOpened = false;
    isMediaOpened = false;

    audioTrack: {
        id: number,
        startPosition: number,
        width: number,
        container: number,
        volume: number,
        path: string,
        fadeIn: boolean,
        fadeOut: boolean,
        src: string,
        playFrom: number,
        playTo: number,
        parentTrackStart: number,
        duration?: any
    };

    videoScreen: {
        id: string,
        startPosition: number,
        width: number,
        name: string,
        img: string,
        timecode: string
    };

    // audioTracks: this['audioTrack'][] = [
    //     { id: 1, startPosition: 0, width: 320, container: 1, volume: 50, fadeIn: true, fadeOut: false },
    //     { id: 2, startPosition: 500, width: 320, container: 1, volume: 50, fadeIn: true, fadeOut: false },
    //     { id: 3, startPosition: 720, width: 320, container: 1, volume: 50, fadeIn: true, fadeOut: false },
    //     { id: 4, startPosition: 25, width: 350, container: 2, volume: 50, fadeIn: true, fadeOut: false },
    //     { id: 5, startPosition: 350, width: 400, container: 2, volume: 50, fadeIn: true, fadeOut: false },
    //     { id: 6, startPosition: 550, width: 270, container: 2, volume: 50, fadeIn: true, fadeOut: false },
    // ];

    audioTracks: this['audioTrack'][] = [];

    videoScreens: this['videoScreen'][] = [
        {
            id: 'screen-0',
            startPosition: 0,
            width: 479,
            name: 'Animation style 6#',
            img: '/assets/images/editing-system/video-card-thumbnail.png',
            timecode: '00:00:00'
        },
        {
            id: 'screen-1',
            startPosition: 479,
            width: 385,
            name: 'Animation style 6#',
            img: '/assets/images/editing-system/video-card-thumbnail.png',
            timecode: '00:00:00'
        },
        {
            id: 'screen-2',
            startPosition: 864,
            width: 464,
            name: 'Animation style 6#',
            img: '/assets/images/editing-system/video-card-thumbnail.png',
            timecode: '00:00:00'
        },
        {
            id: 'screen-3',
            startPosition: 1328,
            width: 230,
            name: 'Animation style 6#',
            img: '/assets/images/editing-system/video-card-thumbnail.png',
            timecode: '00:00:00'
        },
    ];

    draggingTrack: this['audioTrack'];

    draggingScreen: this['videoScreen'];

    musicItem: {
        id: number,
        belong_to: number,
        created_at: string,
        duration: number,
        file: string,
        name: string
        size: number,
        updated_at: string,
    };

    musicSuggestionItem: {
        id: number,
        duration: number,
        file: string,
        name: string
        size: number,
        style: string,
        created_at: string,
        updated_at: string,

    };

    musicLibrary: TimelineState['musicItem'][] = [];
    suggestionLibrary: TimelineState['musicSuggestionItem'][] = [];

    musicPending: {
        id: number,
        name: string,
    };

    pendingSongs: TimelineState['musicPending'][] = [];

    musicLibraryFilters = {
        libraryType: 1,
        search: '',
        style: '',
        duration: ''
    };

    renderTrack: {
        composition: string,
        path: string,
        startTime: number,
        inPoint: number,
        outPoint: number,
        audioLevel: number,
        fadeIn: boolean,
        fadeOut: boolean
    };

    songsForRendering: TimelineState['renderTrack'][] = [];
    scissorsPosition = 0;
    randomId = 2500;
    timeineWidth: number;
}
