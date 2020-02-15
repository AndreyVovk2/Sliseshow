
export class AppState {

    isAuthorized = false;
    maxStorageValue = 2147483648;


    authCredentials: {
        admin: number,
        confirmed: number,
        created_at: string,
        email: string,
        facebook_id: string,
        gender: string,
        id: number,
        last_name: string,
        name: string,
        tariff_id: number,
        token: string,
        updated_at: string,
        used: number,
    } = null;

    selectSlice: {
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
        min_video_legth: number,
        max_video_legth: number,
        text: number,
        video_quality: string,
        save: number,
        created_at: string,
        updated_at: string
    } = null;


    animationStyle: {
          pics: any,
          id: number,
          image_preview: string,
          video: string,
          name: string,
          clicked?: boolean,
          description?: string,
          likes: number,
          trending: number,
          favorites: boolean,
          including_video: boolean,
          select_pic?: number,
          tags: any,
          select_duration?: number,
          select_template_id?: number,
          select_template?: any,
          types?: any,
          templates?: any
    } = null;

           basket: this['animationStyle'][] = [];

    allTariffs: this['selectSlice'][] = [];

    animationStep3: this['animationStyle'][] = [];

    animationStyleState: boolean;

    listOfCategory: this['categoryId'][] = [];

    categoryId: number;

    basketDuration: number;

    basketPics: number;

    basketImages: number;

    basketImg: number;

    basketVideos: number;

    invoiceId: number;

    basketTotalPrice: number;

    addSliceData: {
      addSlice: boolean,
      selectedSlices: any,
      projectId: number
    } = null;
}
