import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AdminStore } from '../../admin/adminChange/admin.store';
// import { AdminStore } from '../../components/adminChange/admin.store';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  constructor(
    private router: Router,
    private adminStore: AdminStore
  ) { }

  ngOnInit() {
    this.setInitialRouting();
    this.adminStore.changeMetaKey('withoutMeta');
    this.adminStore.authService.getLimit();
  }

  setInitialRouting = (): void => {
    if (this.router.url === '/library') {
      this.router.navigate(['/library', 'my-photos']);
    }
  }

}
