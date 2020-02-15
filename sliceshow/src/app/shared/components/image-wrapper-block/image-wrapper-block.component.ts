import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { GalleryService } from '../../services/gallery.service';


@Component({
  selector: 'app-image-wrapper-block',
  templateUrl: './image-wrapper-block.component.html',
  styleUrls: ['./image-wrapper-block.component.scss']
})
export class ImageWrapperBlockComponent implements OnInit {
  @Input() image: any;
  @Output() getData = new EventEmitter<any>();
  // @Input() clicked: boolean;

  // clicked = false;
  // chosenPic: IChosenPic;
  chosenPic: any;
  hoveredTileId = '';


  constructor(public store: AppStore, public gallery: GalleryService) {
  }

  ngOnInit() {
  }

  returnThis(obj, event) {
    const eventType = event.type;
    this.hoveredTileId = (eventType === 'mouseleave') ? '' : obj.id;
  }

  templateDuration (template) {
     return (template.duration / 60).toFixed(2);
  }

  getPickInfo(id, duration, pics, template) {
    // console.log(template);
    // this.chosenPic = {
    //   select_duration: +duration,
    //   select_pic: +pics,
    //   pics: this.image.pics,
    //   id: +this.image.id,
    //   favorites: this.image.favorites,
    //   image: this.image.image,
    //   name: this.image.name,
    //   clicked: this.image.clicked
    // };
    // console.log(id);
    // this.chosenPic = {...this.image, select_duration: +duration, select_pic: +pics, select_template_id: +id, select_template: template, types: template.types};
    this.chosenPic = {...this.image, select_duration: +duration, select_pic: +pics, select_template_id: +id, types: template.types};
    // console.log(this.chosenPic);
    // this.image.clicked = true;
    // this.clicked = true;
    // console.log(this.chosenPic);
    this.getData.emit(this.chosenPic);

    // this.checkAnimationStyle();
  }

  dontClicked(id) {
    this.image.clicked = false;
    this.store.removeStyle(id);
  }

  checkAnimationStyle() {
    // this.store.checkAnimationStyle(this.image.id);
  }




  putFavorites(id: number, bool: boolean) {
    const changeFav = {'style': id, 'favorites': bool};
    this.gallery.changeFavorites(changeFav)
    .subscribe(data => {
      console.log(data);
      if (bool === true) {
        this.image.favorites = true;
      } else {
        this.image.favorites = false;
      }

    }, error => {
      console.log(error);
    });
  }

}
