import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { AdminState } from './admin-state';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
// import { AdminService } from '../../shared/services/Admin.service';

@Injectable()
export class AdminStore extends Store<AdminState> {


  @Output() newLang = new EventEmitter<string>();

    constructor(public authService: AuthService) {

        super(new AdminState());

        // this.updatePhoto();
    }

    // EDITING CONTENT PART

    saveTranslate(reTranslate: AdminState['reTranslate']): void {
        this.setState({
            ...this.state,
            reTranslate
        });
    }
    saveElemText(elementText: AdminState['elementText']): void {
        this.setState({
            ...this.state,
            elementText,
            elementImg: null,
            elementBackground: null
        });
    }

    saveElemImg(elementImg: AdminState['elementImg']): void {
        this.setState({
            ...this.state,
            elementImg,
            elementText: null,
            elementBackground: null
        });
    }

    saveElemBackground(elementBackground: AdminState['elementBackground']): void {
        this.setState({
            ...this.state,
            elementBackground,
            elementText: null,
            elementImg: null
        });
    }

    saveKey(jsonId: AdminState['jsonId']): void {
        // JSONID - KEY FOR EDITING DIRECTIVES
        this.setState({
            ...this.state,
            jsonId
        });
    }

    savePageId(currentPageId: AdminState['currentPageId']): void {
        // ALL STATIC PAGE HAVE UNIC ID FOR EDITING
        this.setState({
            ...this.state,
            currentPageId
        });
    }

    // ONLY FOR PRICING
    
    saveSlice(editSlice: AdminState['editSlice']): void {
        this.setState({
            ...this.state,
            editSlice
        });
    }

    // USER PART

    saveUserEdit(editUser: AdminState['editUser']): void {
        this.setState({
            ...this.state,
            editUser
        });
    }

    changeUserState(userState: AdminState['userState']): void {
        this.setState({
            ...this.state,
            userState
        });
    }


    saveAllUsers(editUser: AdminState['editUser']): void {
        this.setState({
        ...this.state,
            userList: [
                ...this.state.userList,
                editUser,
            ],
        });
    }

    deleteUser(userId: AdminState['editUser']['id']): void {
        this.setState({
            ...this.state,
            userList: this.state.userList.filter(v => v.id !== userId)
        });
    }

    updateUserRole(userId: AdminState['editUser']['id']): void {
        const newUserList =  this.state.userList.map(v => {
            if (v.id === userId ) {
                if (v.admin === 1) {
                    return {...v, admin: 0};
                } else if (v.admin === 0) {
                    return {...v, admin: 1};
                }
            }
            return v;
        });

        this.setState({
            ...this.state,
            // basket: this.state.basket.filter(v => v.id !== animationStyleId),
            userList: newUserList
        });
    }

    // BLOG PART

    saveBlogEdit(editBlog: AdminState['editBlog']): void {
        this.setState({
            ...this.state,
            editBlog,
            blogAddState: false
        });
    }

    updateBlog(editBlog: AdminState['editBlog']): void {
        const newBlogList = this.state.blogList.map(e => {
            if (e.id === undefined) {
                return editBlog;
            } else {
                return e;
            }
        });
        this.setState({
            ...this.state,
            blogList: newBlogList,
        });
    }

    saveAllBlogs(editBlog: AdminState['editBlog']): void {
        this.setState({
        ...this.state,
            blogList: [
                ...this.state.blogList,
                editBlog,
            ],
        });
    }

    deleteBlog(blogId: AdminState['editBlog']['id']): void {
        this.setState({
            ...this.state,
            blogList: this.state.blogList.filter(v => v.id !== blogId)
        });
    }

    createNewBlog(): void {
        this.setState({
            ...this.state,
            blogAddState: true,
            editBlog: null
        });
    }

    saveNewBlog(editBlog: AdminState['editBlog']): void {
        this.setState({
        ...this.state,
            blogList: [
                ...this.state.blogList,
                editBlog,
            ],
        });
    }

    changeMetaKey(metaKey: AdminState['metaKey']): void {
        this.setState({
            ...this.state,
            metaKey
        });
    }

    updateLang(currentLang: AdminState['currentLang']): void {
        console.log(currentLang);
        this.setState({
            ...this.state,
            currentLang
        });
        this.newLang.emit(`${currentLang}`);
    }

    getCurrentLang() {
        return this.state.currentLang;
    }

    
   

}
