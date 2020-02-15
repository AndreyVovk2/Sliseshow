export class EditingState {

    project: {
        name: string,
        user_id: number,
        total_video_duration: number,
        total_audio_duration: number,
        complete_url: string,
        audioTracks?: any,
        audio: any,
        updated_at: string,
        created_at: string,
        id: number,
        tariff_id?: number,
        final_price?: number,
        mergeStatus: boolean,
        renderAndMerge: boolean;
        animation: {
            id: number,
            name: string,
            ae_file_name: string,
            ae_file_path: string,
            preview_image: string,
            preview_video: string,
            pics: number,
            duration: number,
            including_video: number,
            video_stream: string,
            trending: number,
            likes: number,
            created_at: string,
            updated_at: string,
            is_rendering: boolean,
            render_progress: number,
            completed: boolean,
            rendered: boolean,
            types: {
                images: number,
                videos: number
            },
            format: {
                composition: string,
                quality: any
            }[],
            screens: {
                id: number,
                name: string,
                position: number,
                belongs_to: number,
                created_at: string,
                updated_at: string,
                // startFrame: number,
                // endFrame: number,
                // duration: number | string,
                preview_img: string,
                time_code?: number;
                crop?: any;
                cropPosition?: any;
                // preview_video: string,
                // video_stream: string,
                // start_frame: number,
                // end_frame: number,
                medias: {
                        layer: string,
                        composition: string,
                        type: string,
                        duration?: number | string,
                        link: string,
                        crop?: {
                            startTime: number,
                            inPoint: number,
                            outPoint: number,
                            audioLevel: number
                        }
                }[],
                text: {
                    layer: string,
                    composition: string,
                    value: string,
                    toggle: boolean,
                    color: string,
                    opacity: number
                }[],
                // is_rendering: boolean,
                // render_progress: number,
                completed: boolean,
            }[];
        }[],
    };

    activeVideoLink: string;

    activeMediaParam: {
        button: number, // 1 for crop || upload from media library,
                        // 2 for remove || upload from browse
        type: string,
        link: string,
        layer: string,
        composition: string,
        duration?: string;
        crop?: {
            startTime: number,
            inPoint: number,
            outPoint: number,
            audioLevel: number
        };  
    };

    allScreens: number;
    allMedia: number;
    usedScreens: number;
    usedMedia: number;

    activeAnimationStyle: EditingState['project']['animation'][0];
    activeTemplate: EditingState['activeAnimationStyle']['screens'][0];
    

    nodeDomain: string;
    readyToMarge: boolean;
    allTemplatesAreRendering: boolean;
    readyToRemoveWatemark: boolean;

    timelineState: any;
    disableAutoRender: boolean;
    cropOpened = false;
    uploadProgress = 0;

    // songsForRendering = [];
    
}
