// const api = 'https://slice-show.grassbusinesslabs.tk/api/';
// const imageUrl = 'http://slice-show.grassbusinesslabs.tk/storage/images/';
export const api = 'https://slice.grassbusinesslabs.ml/api/';
const imageUrl = 'http://slice.grassbusinesslabs.ml/storage/images/';

export const nodeUrl = 'http://localhost:9000';


export const COMMON_URL = {
  image_url: imageUrl,
  auth: {
    login: `${api}login`,
    register: `${api}register`,
    send_mail_repassword: `${api}password/email`,
    password_reset: `${api}password/reset`,
    confirm_email: `${api}register/confirm`,
    facebook_login: `${api}facebook_login`,
    update_user: `${api}user/update`,
    // update_user: `${api}users`,
    resend_mail: `${api}resending`,
    subscribers: `${api}subscribers`,
    limit: `${api}/user/limit`
  },
  // TODO: Check the ID's of all categories. It's BACK.
  gallery: {
    selected_categories: `${api}category/styles`,
    all_categories: `${api}categories`,
    one_category: `${api}categories/`,         // Does not work
    // all_subcategories: `${api}categories/`,
    all_subcategories: `${api}subcategories/`,
    one_subcategory: `${api}categories/`,
    all_styles: `${api}styles`,
    admin_styles: `${api}styles-list`,
    one_style: `${api}subcategories/`,
    subcat: `${api}subcategories`,
    templates: `${api}templates`,
    tags: {
      get_all: `${api}tags`,
      filter_tags: `${api}tags`
    }
  },
  pay: {
    invoice: `${api}invoice`,
    check: `${api}check`,
    quality: `${api}projects`
  },
  // TODO: Check the functionality of static_pages requests. Page ID as a parameter
  static_pages: {
    main: `${api}pages/18`,
    about_us: `${api}pages/1`,
    how_it_works: `${api}pages/6`,
    privacy_policy: `${api}pages/9`,
    terms_conditions: `${api}pages/15`,
    pricing: `${api}pages/8`,
    faq: `${api}pages/10`,
    contact_us: `${api}pages/11`,
    blog: `${api}pages/16`,
    gallery: `${api}pages/17`
  },
  pricing: {
    all: `${api}tariffs`,
    one: `${api}tariffs/`
  },
  project: {
    one: `${api}projects`,
    all: `${api}projects`,
    my: `${api}my-projects`,
    change: `${api}projects/change`,
    watermark: `${api}watermark`,
    extended: `${api}expiration`,
    paid: `${api}project/not-paid`
  },
  // TODO Server does not response to requests 500 Internal Server Error. It's BACK.
  blog: {
    all: `${api}blogs`,
    one: `${api}blogs/`
  },
  // TODO There are only one record of FAQ in base. It's back.
  faq: {
    all: `${api}faq`,
    one: `${api}faq/`
  },
  admin: {
    update: `${api}translate`,
    all_users: `${api}users`,
    getValue: `${api}translate/AboutUs.OurTeam-p1 `
  },
  tags: {
    main: `${api}tags`
  },
  favorites: {
    all: `${api}favorites`,
    styles: `${api}styles`,
    add: `${api}style/favorites`
  },
  library: {
    photo: {
      one: `${api}library/photos/`,
      all_user: `${api}library/photos`,
      all_admin: `${api}library/photos_all`,
    },
    video: {
      one: `${api}library/videos`,
      all_user: `${api}library/videos`,
      all_admin: `${api}library/videos_all`,
    },
    music: {
      one: `${api}library/musics/`,
      all_user: `${api}library/musics`,
      all_admin: `${api}library/musics_all`,
      all_suggestion: `${api}suggestion_sounds`,
      last_track: `${api}library/last_track`
    }
  },
  subscribers: {
    all: `${api}subscribers`,
    add: `${api}subscribers/add`,
    send_mail: `${api}subscribers/letters_mailing`
  },
  node: {
    domain: `${api}domains`,
    upload: `${nodeUrl}`,
    render: `${nodeUrl}/renderers`
  },
  qualities: {
    all: `${api}/qualities`,

  }


};
