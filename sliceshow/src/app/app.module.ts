import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {MatDialogModule, MatProgressSpinnerModule} from '@angular/material';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
// --------STORES ----------------
import {AppStore} from './shared/store/app.store';
import {LibraryStore} from './my-library/store/library.store';
import {TimelineStore} from './editor/timeline/timeline-store/timeline.store';
import {AdminStore} from './admin/adminChange/admin.store';
import {EditingStore} from './editor/store/editing.store';
import {MatProgressBarModule} from '@angular/material/progress-bar';

// --------------3RD PARTY LIBRARY-------------------
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import { FacebookModule } from 'ngx-facebook';
import {AgmCoreModule} from '@agm/core';
// import { NgxCarouselModule } from 'ngx-carousel';
// import { OrderModule } from 'ngx-order-pipe';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {AngularEditorService} from '@kolkov/angular-editor';
import {NotifierModule} from 'angular-notifier';
// import { ColorPickerModule } from 'ngx-color-picker';


// --------PAGES---------------
import {MainPageComponent} from './main/main-page/main-page.component';
import {ConfirmEmailComponent} from './main/confirm-email/confirm-email.component';
import {ResetComponent} from './main/reset/reset.component';
import {PageNotFoundComponent} from './main/page-not-found/page-not-found.component';
// --------SERVICES------------
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './shared/services/token.interceptor';
import {AuthService} from './shared/services/auth.service';
import {Utility} from './shared/services/utility.service';
import {LibraryService} from './shared/services/library.service';
import {LogService} from './shared/services/log.service';
import {RequestService} from './shared/services/request.service';
import {ProjectService} from './shared/services/project.service';
import {FacebookAuthService} from './shared/services/facebook.service';
// import { TitleService } from './shared/services/title.service';
import {GalleryService} from './shared/services/gallery.service';
import {PricingService} from './pricing/pricing.service';
import {HelperService} from './shared/services/helper.service';
import {CategoryService} from './shared/services/category.service';
import {AdminService} from './shared/services/admin.service';
import {SocketService} from './editor/socket-service';
import {MainPageService} from './main/main-page.service';

// --- GUARDS ---
import {AdminGuard} from './shared/guards/admin-guard.service';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {UserIdGuard} from './shared/guards/userId-guard.service';

// -----------SHARED MODULE----------
import {AdminChangeComponent} from './admin/adminChange/main/admin-change';
import {BlogChangeComponent} from './admin/adminChange/blog-change/blog-change.component';
import {MetaChangeComponent} from './admin/adminChange/meta-change/meta-change.component';
import {PricingChangeComponent} from './admin/adminChange/pricing-change/pricing-change.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {NgxCarouselModule} from 'ngx-carousel';

// -----------------hammerJs--------------------
import {GestureConfig} from '@angular/material';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [

    AppComponent,
    AdminChangeComponent,
    BlogChangeComponent,
    MetaChangeComponent,
    MainPageComponent,
    ConfirmEmailComponent,
    ResetComponent,
    PageNotFoundComponent,
    PricingChangeComponent,


  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    HttpClientModule,
    BrowserModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBBizRlB79eJpbnrlstj2NPoqadhKTRqh8'
      // apiKey: 'AIzaSyAtLj6CVl7Ty6IxCek2E1Hu2cw3tx3AlH8'

    }),
    NgxCarouselModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10
        }
      }
    }),
    MatProgressSpinnerModule
  ],
  entryComponents: [AdminChangeComponent, PricingChangeComponent, MetaChangeComponent, BlogChangeComponent],

  providers: [
    AuthService,
    LibraryService,
    RequestService,
    MainPageService,
    LogService,
    FacebookAuthService,
    // TitleService,
    AppStore,
    AdminService,
    ProjectService,
    CategoryService,
    LibraryStore,
    PricingService,
    TimelineStore,
    AdminStore,
    EditingStore,
    AngularEditorService,
    GalleryService,
    SocketService,
    AdminGuard,
    AuthGuard,
    UserIdGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    Utility,
    HelperService,
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
