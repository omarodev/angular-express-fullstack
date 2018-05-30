import { Component, ChangeDetectorRef, Input, OnInit, HostListener, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
  ],
  providers: []
})

export class HomeComponent implements OnInit {

  menuCollapsed = true;
  currentDate = moment().format('MMMM DD, YYYY');
  currentDay = moment().format('dddd');
  currentHr = new Date().getHours();
  greeting: string;
  userInfo = {
    name: 'Sepehr',
    tasksCount: 10,
    eventsCount: 4
  };
  agendaInfo = [
    {
      day: 11,
      month: 'May',
      year: 2018,
      title: 'Meeting',
      details: 'Meeting with Rockwood Homes',
      address: '123 6th St. Melbourne, FL 32904'
    },
    {
      day: 11,
      month: 'May',
      year: 2018,
      title: 'Meeting',
      details: 'Meeting with Rockwood Homes',
      address: 'Nu Automations'
    },
    {
      day: 11,
      month: 'May',
      year: 2018,
      title: 'Meeting with Rockwood Homes',
      details: 'Meeting with Rockwood Homes',
      address: '123 6th St. Melbourne, FL 32904'
    }
  ];

  tasksInfo = [
    {
      day: 11,
      month: 'Jan',
      year: 2018,
      title: 'Edit proposal for John',
      details: 'Meeting with Rockwood Homes',
      address: '123 6th St. Melbourne, FL 32904',
      like: false,
      fileUploaded: true,
      alert: false,
    },
    {
      day: 11,
      month: 'May',
      year: 2018,
      title: 'Meeting with Rockwood Homes',
      details: 'Meeting with Rockwood Homes',
      address: 'Nu Automations',
      like: false,
      fileUploaded: true,
      alert: false,
      followerImg: 'assets/users/user1.png'
    },
    {
      day: 11,
      month: 'May',
      year: 2018,
      title: 'Meeting with Rockwood Homes',
      details: 'Meeting with Rockwood Homes',
      address: '123 6th St. Melbourne, FL 32904',
      like: false,
      fileUploaded: true,
      alert: false,
      followerImg: 'assets/users/user1.png'
    }
  ];

  activitiesInfo = [
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new acticle in knowledgebase',
      createdTimeAt: '5:28 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new acticle in knowledgebase',
      createdTimeAt: '5:28 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    },
    {
      imgUrl: 'assets/users/user1.png',
      userName: 'Michael Yue',
      description: 'posted a new ticket',
      createdTimeAt: '5:30 pm',
      createdDateAt: '27.05.2018',
      passedDays: 'Yesterday'
    }
  ];

  morrisBarChartInfo = [{
      y: 'January',
      revenue: 80
    }, {
      y: 'February',
      revenue: 70
    }, {
      y: 'March',
      revenue: 90
    }, {
      y: 'April',
      revenue: 60
    }, {
      y: 'May',
      revenue: 70
    }, {
      y: 'June',
      revenue: 90
    }, {
      y: 'July',
      revenue: 80
    }, {
      y: 'August',
      revenue: 60
    }, {
      y: 'September',
      revenue: 70
    }, {
      y: 'October',
      revenue: 90
    }, {
      y: 'November',
      revenue: 85
    }, {
      y: 'December',
      revenue: 60
    }];

  ngOnInit() {
    if (this.currentHr < 4) {
      this.greeting = 'Good Night';
    } else if (this.currentHr < 12) {
      this.greeting = 'Good Morning';
    } else if (this.currentHr < 19) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Night';
    }
  }

  toggleMenubar(data: boolean) {
    this.menuCollapsed  = data;
  }

}
