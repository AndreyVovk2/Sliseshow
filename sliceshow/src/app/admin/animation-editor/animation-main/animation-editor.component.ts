import { Component, OnInit} from '@angular/core';
// import { SubcategoriesPopupComponent } from '../../components/subcategories-popup/subcategories-popup.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationService } from '../animation.service';

@Component({
  selector: 'app-animation-editor',
  templateUrl: './animation-editor.component.html',
  styleUrls: ['./animation-editor.component.scss']
})
export class AnimationEditorComponent implements OnInit {

  allAnimations = [];
  editState = false; // true for double screen(edit mode);
  addNewPicState = true; // false when pic amount == 3
  newStyleState = false; // true when new animation style button click
  screenState = false; // true for screen edit
  newScreenState = false; // true when new screen button click
  subCategoriesState = false; // false for showing id from cat with obj, true for show id from arr with id

  editStyle = {
    name: '',
    ae_file_name: '',
    ae_file_path: '',
    preview_image: '',
    preview_video: '',
    pics: [],
    likes: 0,
    trending: 0,
    including_video: false,
    duration: 0,
    sub_categories: []
  };

  checkedStyleMedia = {preview_image: '', preview_video: ''};
  checkedScreenMedia = {preview_img: '', preview_video: ''};

  // newStylePic = {amount: 0 , duration: 0};

  // allScreens = [];

  // editScreen = {
  //   belongs_to: '',
  //   created_at: '',
  //   duration: '',
  //   end_frame: '',
  //   id: '',
  //   medias: [],
  //   name: '',
  //   position: '',
  //   preview_img: '',
  //   preview_video: '',
  //   start_frame: '',
  //   text: [],
  //   updated_at: '',
  // };

  // newMedia = {
  //   duration: 0,
  //   name: '',
  //   type: '',
  //   link: null,
  // };

  // newText = {
  //   name: '',
  //   link: null,
  // };

  // styleIdBelongs;

  // listOfCat = [];


  constructor(
    public animationService: AnimationService, 
    public dialog: MatDialog,
    public rt: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.getAllStyles();
  }

  // getAllStyles() {
  //   this.animationService.getAllAnimationStyles()
  //   .subscribe(data => {
  //     console.log(data);
  //     this.allAnimations = data;
  //   }, error => {
  //     console.log(error);
  //   });
  // }


  // changeStyle(style) {
  //   this.editStyle = style;
  //   this.checkedStyleMedia.preview_image = style.preview_image;
  //   this.checkedStyleMedia.preview_video = style.preview_video;
  //   this.editState = true;
  //   this.rt.navigate([style.id], {relativeTo: this.route});

  //   // this.newStyleState = false;
  //   // this.subCategoriesState = false;
  // }

  // toogleStyle(vnt) {
  //   this.editState = vnt;
  // }

  // createNewStyle() {
  //   this.rt.navigate(['new'], {relativeTo: this.route,  queryParams: { creating: 'newStyle' }} );
  // }

  // closePreview() {
  //   this.clearStyle();
  //   this.editState = true;
  // }
  // closeScreenPreview() {
  //   this.editState = false;
  //   this.screenState = false;
  //   this.clearScreen();
  // }

  // openSubCatPopup(idStyle) {
  //   this.editStyle.sub_categories.map(e => {
  //     this.listOfCat.push(e.id);
  //   });
  //   const dialogRef = this.dialog.open(SubcategoriesPopupComponent, {
  //     data: {list : this.editStyle.sub_categories},
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     console.log(result);
      
  //   });
  // }

  // createNewStyle() {
  //   this.newStyleState = true;
  //   this.clearStyle();
  //   this.editState = true;
  //   this.addNewPicState = true;
  // }

  // addPic() {
  //     this.editStyle.pics.push({ ...this.newStylePic});
  //     if (this.editStyle.pics.length === 3) {
  //       this.addNewPicState = false;
  //   }
    
  // }

  // addMedia() {
  //   this.editScreen.medias.push({ ...this.newMedia});
  // }


  // addText() {
  //   this.editScreen.text.push({ ...this.newText});
  // }

  // clearStyle() {
  //   this.editStyle = {
  //     name: '',
  //     ae_file_name: '',
  //     ae_file_path: '',
  //     preview_image: '',
  //     preview_video: '',
  //     pics: [],
  //     including_video: false,
  //     duration: 0,
  //     likes: 0,
  //     trending: 0,
  //     sub_categories: []
  //   };
  // }

  // clearScreen() {
  //   this.editScreen = {
  //     id: '',
  //     belongs_to: '',
  //     created_at: '',
  //     duration: '',
  //     end_frame: '',
  //     medias: [],
  //     name: '',
  //     position: '',
  //     preview_img: '',
  //     preview_video: '',
  //     start_frame: '',
  //     text: [],
  //     updated_at: '',
  //   };
  // }

  // show(event, num) {
  //   this.uploadFile(event.target.files[0], num);
  // }

  // uploadFile(file, num) {
  //   if ( num === 1 ) {
  //     this.editStyle.preview_image = file;
  //   } else if ( num === 2 ) {
  //     this.editStyle.preview_video = file;
  //   } else if ( num === 3 ) {
  //     this.editScreen.preview_img = file;
  //   } else if ( num === 4) {
  //     this.editScreen.preview_video = file;
  //   }

  // }

  // createStyle() {
  //   this.animationService.createNewStyles(this.editStyle)
  //   .then(data => {
  //     console.log(data);
  //     this.getAllStyles();
  //     this.closePreview();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // updateStyle(id) {
  //   console.log(this.checkedStyleMedia);
  //   console.log(this.editStyle);
  //   if (this.checkedStyleMedia.preview_image === this.editStyle.preview_image) {
  //     delete this.editStyle.preview_image;
  //   }
  //   if (this.checkedStyleMedia.preview_video === this.editStyle.preview_video) {
  //     delete this.editStyle.preview_video;
  //   }
  //   this.animationService.updateStyle(this.editStyle, id)
  //   //  subscribe
  //   .then(data => {
  //     console.log(data);
  //     this.getAllStyles();
  //     this.closePreview();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // deleteStyle(style, event) {
  //   event.stopPropagation();
  //   this.animationService.removeStyle(style.id)
  //   .subscribe(data => {
  //     console.log(data);
  //     this.getAllStyles();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // getAllScreen(style , event) {
  //   if (style.id !== this.editScreen.belongs_to ) {
  //     this.clearScreen();
  //   }
  //   event.stopPropagation();
  //   this.animationService.getStyleScreens(style.id)
  //   .subscribe(data => {
  //     if (data.screens.length === 0) {
  //       console.log('you a here');
  //       this.createScreen(style.id);
  //     } else {
  //       this.newScreenState = false;
  //       this.allScreens = data.screens;
  //       this.editScreen = this.allScreens[0];
  //       this.updtScreenLink();
  //       console.log(this.allScreens);
  //     }
      
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // updtScreenLink() {
  //   this.checkedScreenMedia.preview_video = this.editScreen.preview_video;
  //   this.checkedScreenMedia.preview_img = this.editScreen.preview_img;
  //   console.log(this.checkedScreenMedia.preview_img);
  //   // this.editScreen = screen;
  // }

  // updateScreen(screen) {
  //   console.log(this.checkedScreenMedia);
  //   console.log(this.editScreen);
  //   if (this.checkedScreenMedia.preview_img === this.editScreen.preview_img) {
  //     delete this.editScreen.preview_img;
  //   }
  //   if (this.checkedScreenMedia.preview_video === this.editScreen.preview_video) {
  //     delete this.editScreen.preview_video;
  //   }
  //   this.animationService.updateScreen(screen, screen.belongs_to, screen.id)
  //   .then(data => {
  //     console.log(data);
  //     this.closeScreenPreview();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // deleteScreen() {
  //   const screen = this.editScreen;
  //   this.animationService.deleteScreen(screen.belongs_to, screen.id)
  //   .subscribe(data => {
  //     console.log(data);
  //     this.closeScreenPreview();
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // createScreen(idStyle) {
  //   this.clearScreen();
  //   this.newScreenState = true;
  //   this.styleIdBelongs = idStyle;

  // }

  // newScreen(screen) {
  //   this.animationService.createNewScreen(screen, this.styleIdBelongs)
  //   .then(data => {
  //     console.log(data);
  //     this.closeScreenPreview();
  //   }, error => {
  //     console.log(error);
  //   });

  // }

  // changeScreens(style , event) {
  //   this.getAllScreen(style, event);
  //   this.editState = true;
  //   this.screenState = true;
  // }

}
