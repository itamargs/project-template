import { Request, Http, RequestOptions, RequestMethod } from '@angular/http';
import { Messages } from './../messages.model';
import { Hours } from './../hours.model';

import { DataStorageService } from './../../shared/data-storage.service';
import { FilterListPipe } from './filter-list.pipe';
import { UserService } from './../user.service';
import { User } from './../user.model';
import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[];
  selectedUser: User;
  @Input() type: any;
  deleteSelected = false;
  constructor(private userService: UserService,
              private router: Router,
              private dataStorageService: DataStorageService,
              private http: Http) { }

  ngOnInit() {
    this.userService.userSelected.subscribe(
      (user: User) => {
        this.selectedUser = user;
      }
    )
    //this.userService.getData();
    //this.dataStorageService.getd();
    //this.dataStorageService.storeUsers(this.users);
    this.users = this.filter(this.type);
    this.userService.usersChanged.subscribe(
      (users: User[]) => {
        this.users = this.filter(this.type);
      }
    )

  }

//================== filtered users by type and sort by last and first name ===================
  filter(type: any) {
    var pageType: number;
    if(type==='emek')
      pageType = 0;
    else
      pageType = 1;
    
    const filterArray = [];
    for(const user of this.userService.getUsers()) {
      if(pageType === user.type) {
        filterArray.push(user);
      }
    }
    filterArray.sort((a,b) => {
          if(a.lastName < b.lastName)
            return -1
          if(a.lastName > b.lastName)
            return 1;
          if(a.lastName === b.lastName) {
            if(a.firstName < b.firstName)
              return -1;
            if(a.firstName > b.firstName)
              return 1;
          }
          return 0;
        })  
    return filterArray;
  }
  //=============================================================================================


  openAddWindow() {
    /*const options = new RequestOptions({
      method: RequestMethod.Post
    });
    const req = new Request(options.merge({
      url: "https://us-central1-milestones-app.cloudfunctions.net/accountcleanup?key=19b8242abf28bf7e42bc8f38d15f8787b0ed022b&uid=3Ps8HNdjOahhs0KaSSy2eP4pIci1"
    }));
    let uid = String('ceQ0l04hw5cTeZU4o3hPJIocbxJ3');
    console.log('req.url:', req.url);
    let xml = new XMLHttpRequest();
    xml.open('Get',"https://us-central1-milestones-app.cloudfunctions.net/accountcleanup?key=19b8242abf28bf7e42bc8f38d15f8787b0ed022b&uid=" + uid) ;
    xml.send(null);
    return xml.responseText;*/
   
    this.userService.addSelected.emit();
    this.onUserSelected(null);
  }

  onDeleteUser(user: User) {
    
      
    
      this.userService.removeUser(this.userService.getIndex(user));
      this.onUserSelected(null);
      this.dataStorageService.setUser(user);
    
  }

  onUserSelected(user: User) {
    this.userService.userSelected.emit(this.userService.getUser(this.userService.getIndex(user)));
  }

  chooseDelete() {
     this.deleteSelected = !this.deleteSelected;
  }

  sendMessage(user: User) {
    this.onUserSelected(user);
    this.userService.msgSelected.emit();
    
  }
    
    onChartUser(user: User) {
     let limit;
      if(user.hours){
      if(user.type===1) {
        limit = 0;
        for(var i=0; i<user.hours.length;i++)
          limit+=(+user.hours[i].totalHours);
        limit = (limit/250)*100;
      }
      if(user.type===0)
        limit = (user.hours.length/100)*100;
        
      limit = parseFloat(limit).toFixed(2);
      }
      return limit;
    }
}
