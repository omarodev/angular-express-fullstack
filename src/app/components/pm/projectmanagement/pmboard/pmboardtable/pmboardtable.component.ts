import { Component, Input, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from '../../projectmanagement.service';
import { PmTasksService } from '../../../../../services/pmtasks.service';

@Component({
  selector: 'app-pmboardtable',
  templateUrl: './pmboardtable.component.html',
  styleUrls: [
    './pmboardtable.component.css',
  ]
})

export class PmBoardTableComponent implements OnInit {
  @ViewChild('panel', { read: ElementRef }) public panel: ElementRef;

  @Input() set pmBoardTableInfo(val) {
    this.pmBoardTableData = [];
    if (val !== undefined && val.length !== 0) {
      this.dataReady = true;
      this.pmBoardTableData = val;
      for (let i = 0; i < this.pmBoardTableData.length; i++) {
        //  color selection
        const pickColorId = i % 10;
        this.pmBoardTableData[i].color = this.colors[pickColorId];
        this.pmBoardTableData[i].editTitle = false;
        this.showTaskGroupDeleteConfirmModal[i] = false;
     }
    }
  }
  @Input() taskOwners;
  @Output() updatePmData: EventEmitter<any> = new EventEmitter;
  showDetailedTaskModal = false;
  newAddedTask: any;
  temp: number;
  leftReached = true;
  rightReached = false;
  pmBoardTableData: any;
  dataReady = false;
  showTaskGroupDeleteConfirmModal = [];
  //  private temp: number;
  //  private leftReached = true;
  //  private rightReached = false;
  //  private pmBoardTableData: any;
  //  private dataReady = false;

  constructor( private pmService: ProjectManagementService, private pmTasksService: PmTasksService ) {

    // close detailed task modal
    this.pmService.closeTaskModal.subscribe(
      data => {
        this.showDetailedTaskModal = false;
      }
    );
  }

  colors = ['#FFE5CC', '#EDF3BF', '#FFD7D7', '#CBE0ED', '#E0BBCC', '#C4BBE0', '#BBC0E0', '#BBE0CC', '#E0BBBB', '#E8E3A7'];

  ngOnInit() {
  }

  getTasksCount(owner, project) {
    if (project.tasks === undefined) { project.tasks = []; }
    const count = project.tasks.filter(t => t.assignee === owner.username).length;
    return count;
  }

  getTasksCompletion(owner, project) {
    let total = 0;
    if (project.tasks === undefined) { project.tasks = []; }
    const newArr = project.tasks.filter(t => t.assignee === owner.username);
    for (let i = 0; i < newArr.length; i++) {
      total = total + newArr[i].completion;
    }
    return total / newArr.length;
  }

  getDuration(owner, project) {
    let totalDuration = 0;
    if (project.tasks === undefined) { project.tasks = []; }
    // if total duration is smaller than 7 days, it will show by days and over 1 week, it will show by weeks
    const newArr = project.tasks.filter(t => t.assignee === owner.username);
    for (let i = 0; i < newArr.length; i++) {
      totalDuration = totalDuration + newArr[i].duration;
    }
    if (totalDuration < 7) {
      if (totalDuration === 1) {
        return totalDuration + ' day';
      } else {
        return totalDuration + ' days';
      }
    } else {
      const weekCount = Math.floor(totalDuration / 7);
      if (weekCount === 1) {
        return weekCount + ' week';
      } else {
        return weekCount + ' weeks';
      }
    }
  }

  getDependenciesCount(owner, project) {
    let total = 0;
    if (project.tasks === undefined) { project.tasks = []; }
    const newArr = project.tasks.filter(t => t.assignee === owner.username);
    for (let i = 0; i < newArr.length; i++) {
      total = total + newArr[i].dependency.length;
    }
    if (total < 2) {
      return total + ' dependency';
    } else {
      return total + ' dependencies';
    }
  }

  getOverDueTasksCount(owner, project) {
    let total = 0;
    const today = new Date();
    if (project.tasks === undefined) { project.tasks = []; }
    const newArr = project.tasks.filter(t => t.assignee === owner.username);
    for (let i = 0; i < newArr.length; i++) {
      if (this.calcualteDateDiff(newArr[i].startDate) > newArr[i].duration) {
        total ++;
      }
    }
    // console.log('pmdata:', this.updatePmData, total);

    return total;
  }

  calcualteDateDiff( startDateStr ) {
    const today = new Date();
    const startDate = new Date(startDateStr);
    const timeDiff = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  getCompletedTasksCount(owner, project) {
    let total = 0;
    if (project.tasks === undefined) { project.tasks = []; }
    const newArr = project.tasks.filter(t => t.assignee === owner.username);
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i].isComplete === true) {
        total ++;
      }
    }
    return total;
  }

  onPreviousSearchPosition() {
    this.rightReached = false;
    const stepCount = 20;
    const limit = 420 / 20;
    let i = 0;
    const flag = this.panel.nativeElement.scrollLeft;
    const interval = setInterval(() => {
      this.panel.nativeElement.scrollLeft -= stepCount;
      i ++;
      if (i > limit) {
        clearInterval(interval);
      }
      if (flag === this.panel.nativeElement.scrollLeft) {
        this.leftReached = true;
      }
    }, 1);
  }

  onNextSearchPosition() {
    this.leftReached = false;
    const stepCount = 20;
    const limit = 420 / 20;
    let i = 0;
    const flag = this.panel.nativeElement.scrollLeft;
    const interval = setInterval(() => {
      this.panel.nativeElement.scrollLeft += stepCount;
      i ++;
      if (i > limit) {
        clearInterval(interval);
      }
      if (flag === this.panel.nativeElement.scrollLeft) {
        this.rightReached = true;
      }
    }, 1);
    console.log('pmdata:', this.updatePmData);

  }

  getNewTask(event) {
    this.newAddedTask = event;
    console.log('new task', event);

    this.pmTasksService.createTask(this.temp, event).subscribe(res => {
      for (let i = 0; i < event.subTasks.length; i++) {
        this.pmTasksService.createSubTask(this.temp, res.data.id, event.subTasks[i]).subscribe();
      }
      this.updatePmData.emit(null);
    });
    // assign new id to new task
    // event.id = this.pmBoardTableData[this.temp].tasks.length + 1;
    // this.pmBoardTableData[this.temp].tasks.push(event);
    console.log('pmdata:', this.updatePmData);
  }
  updateProjectTitle(index, event) {
    if (event.key === 'Enter') {
      this.pmBoardTableData[index].editTitle = false;
      const body =  {
        owner: this.pmBoardTableData[index].owner,
        title: this.pmBoardTableData[index].title,
        order: this.pmBoardTableData[index].order,
        permission: this.pmBoardTableData[index].permission
      };
      this.pmTasksService.updateIndividualTaskGroup(this.pmBoardTableData[index].id, body).subscribe(res => {
        this.updatePmData.emit(null);
      });
    }
  }

  confirmDeleteTaskGroup(milestoneId) {
    // console.log('taskgroup deleted');
    this.pmTasksService.deleteIndividualTaskGroup(milestoneId).subscribe(res => {
      // console.log('taskgroup deleted:');
      this.updatePmData.emit(null);
    });
  }
}
