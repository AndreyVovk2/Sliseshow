import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { SubcategoriesPopupComponent } from '../subcategories-popup/subcategories-popup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {

  allCategories = [];
  allSubCategories = [];
  // nameHe
  // name_hreb
  editingCategory = {
    nameEng: '',
    name_hreb: '',
    image: '',
    subCategories: []
  };

  editingSubcategory = {
    name: '',
    name_hreb: '',
    image: ''
  };

  toggleState = {
    checked: false,
    labelPosition: 'after',
    label: 'Show subcategory list'
  };

  halfState = false; // true for 50% of window for editor
  showingLink = false; // true when category have image link
  // subcatState = false;
  selectedId = 0;
  selectedSubcategoryId = 0;

  constructor(public categoryService: CategoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllCategory();
  }

  openSubCatPopup() {
    const dialogRef = this.dialog.open(SubcategoriesPopupComponent, {
      data: {list : this.editingCategory.subCategories},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(this.editingCategory.subCategories);
      
    });
  }

  slide(event) {
    this.halfState = false;
    console.log(event);
    console.log(this.toggleState);
    if (event.checked === true) {
      this.toggleState = {
        checked: true,
        labelPosition: 'before',
        label: 'Show category list'
      };
      this.showSubcategory();
    } else {
      this.toggleState = {
        checked: false,
        labelPosition: 'after',
        label: 'Show subcategory list'
      };
    }
  }

  closeEditor() {
    this.halfState = false;
    this.cleanCategory();
    this.cleanSubCategory();

    this.selectedId = 0;
    this.selectedSubcategoryId = 0;
  }

  getAllCategory() {
    this.categoryService.getAllCategories()
    .subscribe(data => {
      this.allCategories = data;
    });
  }

  cleanCategory() {
    this.editingCategory = {
      nameEng: '',      
      name_hreb: '',
      image: '',
      subCategories: []
    };
  }
  cleanSubCategory() {
    this.editingSubcategory = {
      name: '',
      name_hreb: '',
      image: ''
    };
  }

  openNewCategory() {
    this.cleanCategory();
    this.halfState = true;
    this.showingLink = false;
    this.selectedId = 0;
  }

  createNewCategory() {
    this.mapSubcategories();
    this.categoryService.addCategory(this.editingCategory)
    .then(data => {
      console.log(data);
      this.allCategories.push(data);
      this.halfState = false;
    });
  }

  updateCategory() {
    console.log(this.editingCategory);
    if (typeof this.editingCategory.image === 'string') {
      delete this.editingCategory.image;
    }
    console.log(typeof this.editingCategory.image);
    this.mapSubcategories();
    this.categoryService.updateCategory(this.editingCategory, this.selectedId)
    .then(data => {
      console.log(data);
      this.replaceCategoryAfterUpdate(data);
      this.halfState = false;
    });
  }

  changeCategory(category, $event) {
    console.log(category);
    this.selectedId = category.id;
    // this.editingCategory.nameEng = category.nameEng;
    this.editingCategory.nameEng = category.name;
    this.editingCategory.name_hreb = category.name_hreb;
    this.editingCategory.image = category.image;
    this.editingCategory.subCategories = category.subcategories;
    this.halfState = true;
    this.showingLink = true;
    console.log(this.editingCategory);
  }

  show(event) {
    this.editingCategory.image = event.target.files[0];
    this.showingLink = false;
    console.log(this.editingCategory);
  }

  addSubCatFile(event) {
    console.log(event);
    this.editingSubcategory.image = event.target.files[0];
    this.showingLink = false;
    console.log(this.editingSubcategory);

  }

  mapSubcategories() {
    this.editingCategory.subCategories = this.editingCategory.subCategories.map(e => {
      return e.id;
    });
    console.log(this.editingCategory);
  }

  replaceCategoryAfterUpdate(newCategory) {
    console.log(newCategory);
    this.allCategories = this.allCategories.map(e => {
      if (this.selectedId === e.id) {
        return {...e, name: newCategory.name, name_hreb: newCategory.name_hreb, image: newCategory.image, subcategories: newCategory.subcategories};
      }
      return e;
    });
  }

  deleteCategory(category , $event) {
    this.categoryService.deleteCategory(category.id)
    .subscribe(data => {
      console.log(data);
      this.closeEditor();
      this.allCategories = this.allCategories.filter(e => e.id !== category.id);
    });
  }

  // SUBCATEGORIES PART

  openNewSubcategory() {
    this.selectedId = 0;
    this.editingSubcategory.name = '';
    this.editingSubcategory.name_hreb = '';
    this.editingSubcategory.image = '';
    this.halfState = true;
  }

  showSubcategory() {
    this.categoryService.getAllSubcategories()
    .subscribe(data => {
      this.allSubCategories = data; 
    });
  }

  changeSubCategory(subcategory, event) {
    console.log(subcategory);
    console.log(this.allSubCategories);
    this.selectedId = subcategory.id;
    this.editingSubcategory.name = subcategory.name;
    this.editingSubcategory.name_hreb = subcategory.name_hreb;
    this.editingSubcategory.image = subcategory.image;
    this.selectedSubcategoryId = subcategory.id;
    this.showingLink = true;
    this.halfState = true;
    console.log(this.selectedId);
  }

  deleteSubCategory(subcategory , $event) {
    this.categoryService.deleteSubcategories(subcategory.id)
    .subscribe(data => {
      this.allSubCategories = this.allSubCategories.filter(s => s.id !== subcategory.id);
      this.closeEditor();
    });
  }

  createNewSubcategory() {
    console.log(this.editingSubcategory);
    this.categoryService.addSubCatWithImg(this.editingSubcategory).then( (result) => {
      this.allSubCategories.push(result);
      this.halfState = false;
    }, (error) => {
      console.log('createNewSubcategory ERROR');
    });
    // this.categoryService.addSubcategories(this.editingSubcategory)
    // .subscribe(data => {
    //   this.allSubCategories.push(data);
    //   this.halfState = false;
    // });
  }

  updateSubcategory() {
    if (typeof this.editingSubcategory.image === 'string') {
      delete this.editingSubcategory.image;
    }
    console.log(this.editingSubcategory);
    this.categoryService.updateSubCatWithImg(this.editingSubcategory, this.selectedSubcategoryId).then((result) => {
      this.halfState = false;
      this.replaceSubcategoryAfterUpdate(result);
    });
    // this.categoryService.updateSubcategories(this.editingSubcategory, this.selectedSubcategoryId)
    // .subscribe(data => {
    //   this.halfState = false;
    //   this.replaceSubcategoryAfterUpdate(data);
    // });
  }

  replaceSubcategoryAfterUpdate(newSubCategory) {
    console.log(newSubCategory);
    this.allSubCategories = this.allSubCategories.map(e => {
      if (this.selectedId === e.id) {
        return {id: newSubCategory.id, name_hreb: newSubCategory.name_hreb, name: newSubCategory.name, image: newSubCategory.image};
      }
      return e;
    });
  }

  editingCategoryValidation () {
    if (this.editingCategory.nameEng === '' ||
        this.editingCategory.name_hreb === '' ||
        this.editingCategory.image === '' ||
        this.editingCategory.subCategories.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  editingSubCategoryValidation() {
    if (this.editingSubcategory.name === '' ||
      this.editingSubcategory.name_hreb === '' ||
        this.editingSubcategory.image === '') {
      return true;
    } else {
      return false;
    }
  }

}
