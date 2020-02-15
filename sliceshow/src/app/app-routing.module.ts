import {NgModule} from '@angular/core';
import {RouterModule, Routes, CanActivate, PreloadAllModules} from '@angular/router';

import {MainPageComponent} from './main/main-page/main-page.component';
import {ConfirmEmailComponent} from './main/confirm-email/confirm-email.component';
import {ResetComponent} from './main/reset/reset.component';
import {PageNotFoundComponent} from './main/page-not-found/page-not-found.component';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {AdminGuard} from './shared/guards/admin-guard.service';


const appRoutes: Routes = [
  {path: '', component: MainPageComponent, data: {title: 'Home'}},

  {path: 'about-us', loadChildren: 'app/about-us/about-us.module#AboutUsModule'},
  {path: 'how-it-works', loadChildren: 'app/how-it-works/how-it-works.module#HowItWorksModule'},
  {path: 'pricing', loadChildren: 'app/pricing/pricing.module#PricingModule'},
  {path: 'blog', loadChildren: 'app/blog/blog.module#BlogModule'},
  {path: 'contact-us', loadChildren: 'app/contact-us/contact-us.module#ContactUsModule'},
  {path: 'faq', loadChildren: 'app/faq/faq.module#FaqModule'},
  {path: 'privacy-policy', loadChildren: 'app/privacy-policy/privacy-policy.module#PrivacyPolicyModule'},
  {
    path: 'terms-and-conditions',
    loadChildren: 'app/terms-and-conditions/terms-and-condition.module#TermsAndConditionsModule'
  },
  {path: 'library', loadChildren: 'app/my-library/library.module#LibraryModule', canActivate: [AuthGuard]},
  {path: 'my-profile', loadChildren: 'app/my-profile/my-profile.module#MyProfileModule', canActivate: [AuthGuard]},
  {path: 'gallery', loadChildren: './gallery/gallery.module#GalleryModule'},
  {path: 'favorites', loadChildren: './my-favorites/my-favorites.module#MyFavoritesModule', canActivate: [AuthGuard]},
  {path: 'editing-system', loadChildren: './editor/editor.module#EditorModule'},
  {path: 'my-project', loadChildren: 'app/my-project/my-project.module#MyProjectModule', canActivate: [AuthGuard]},
  {path: 'create-project', loadChildren: './create-project/create-project.module#CreateProjectModule'},
  {
    path: 'admin',
    loadChildren: './admin/animation-editor/animatiot-editor.module#AnimationEditorModule',
    canActivate: [AdminGuard]
  },

  // , canActivate: [UserIdGuard]
  {path: 'confirm-email', component: ConfirmEmailComponent, data: {title: 'Confirm email'}},
  {path: 'reset', component: ResetComponent, data: {title: 'Reset'}},
  // Любой роут ставить выше страницы 404, потому что не будет работать нихера!!!
  {path: '**', component: PageNotFoundComponent, data: {title: '404'}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {preloadingStrategy: PreloadAllModules},
      // { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
