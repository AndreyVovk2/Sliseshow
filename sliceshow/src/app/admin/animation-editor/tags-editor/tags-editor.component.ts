import { Component, OnInit } from '@angular/core';
import { AnimationService } from '../animation.service';
import { Observable } from 'rxjs/Observable';
import { StylesPopupComponent } from '../styles-popup/styles-popup.component';
import { MatDialog } from '@angular/material';

interface Tag {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
  style: Array<any>;
}

@Component({
  selector: 'tags-editor',
  templateUrl: './tags-editor.component.html',
  styleUrls: ['./tags-editor.component.scss']
})

export class TagsEditorComponent implements OnInit {
  public halfState = false;
  public tags: Array<Tag>;
  public newTag: string;

  public selectedTag: Tag;

  constructor(public service: AnimationService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllTags();
  }

  getAllTags() {
    this.service.getTags().subscribe(data => this.tags = data);
    this.halfState = false;
    console.log(this.tags);
  }

  deleteTag(id: number) {
    this.service.deleteTag(id)
    .subscribe(() => this.tags = this.tags.filter(v => v.id !== id));
  }

  createNewTag() {
    // const selTag = {name: this.selectedTag.name, styles: this.selectedTag.style.map(v => v.id)};
    const selTag = {name: this.selectedTag.name};
    console.log(selTag);
    this.service.createTag(selTag)
    .subscribe(data => this.getAllTags());
  }

  openNewTag() {
    this.halfState = true;
    this.setEmptyTag();
  }

  changeTag(tag, $event) {
    this.halfState = true;
    this.selectedTag = tag;
    console.log(this.selectedTag);
    console.log(this.tags);
  }

  log() {
    console.log(this.tags);
  }

  openStylesPopup() {
        // console.log(this.selectedTag);
        if (this.selectedTag.style.length !== 0) {
          this.selectedTag.style.map(e => e.id);
        }
        const dialogRef = this.dialog.open(StylesPopupComponent, {
          data: {list : this.selectedTag.style || []},
        });
  }

  setEmptyTag() {
    const emptyTag = { id: null, name: '', updated_at: '', created_at: '', style: [] };
    this.selectedTag = emptyTag;
  }

  closeEditor() {
    this.halfState = false;
    this.setEmptyTag();
  }

  updateTag() {
    console.log(this.selectedTag);
    // const selTag = {name: this.selectedTag.name, styles: this.selectedTag.style.map(v => v.id)};
    const selTag = {name: this.selectedTag.name};
    console.log(selTag);
    this.service.updateTag(this.selectedTag.id, selTag)
    .subscribe(() => this.getAllTags());
  }


}
