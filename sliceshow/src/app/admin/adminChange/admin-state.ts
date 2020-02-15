
export class AdminState {
    reTranslate: {
        en: string,
        he: string
    } = null;

    elementText: {
        nativeElement: HTMLElement
    } = null;

    elementImg: {
        nativeElement: HTMLImageElement
    } = null;

    elementBackground: {
        nativeElement: HTMLElement
    } = null;

    // for admin editing

    jsonId: string;

    currentPageId: number;

    editSlice: {
        id: number,
        price: number,
        design_style: number,
        slices: number,
        min_pictures: number,
        max_pictures: number,
        min_videos: number,
        max_videos: number,
        min_songs: number,
        max_songs: number,
        min_video_length: number,
        max_video_length: number,
        text: number,
        video_quality: string,
        save: number,
        created_at: string,
        updated_at: string,
        pizza_image: any,
        save_image: any
    } = null;

    editUser: {
        id: number,
        facebook_id: string,
        name: string,
        last_name: string,
        email: string,
        confirm_token: string,
        gender: string,
        confirmed: number,
        admin: number,
        tariff_id: number,
        used: number,
        created_at: string,
        updated_at: string
    } = null;

    userState: number;
    // 0 for edit, 1 for delete, 2 for create, 3 for add admin role, 4 for delete admin role, 5 for send mail to users 

    userList: this['editUser'][] = [];

    editBlog: {
        id: number,
        title: string,
        text_blog: {
            p1: string,
            p2: string,
            p3: string,
            p4: string,
        },
        image: string,
        creator: string,
        created_at: string,
        updated_at: string
    } = null;

    blogAddState: boolean;
    // true for creating, false for editing

    blogList: this['editBlog'][] = [];

    metaKey: string;

    currentLang: string;

    uploadProgress = 0;
    

}
