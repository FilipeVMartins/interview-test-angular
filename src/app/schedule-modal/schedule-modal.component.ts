import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SchedulesService } from '../schedules.service';

import { ToastService, AngularToastifyModule } from 'angular-toastify';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss']
})
export class ScheduleModalComponent implements OnInit {

  @Input()
  selectedSchedule: any = null;

  @Input()
  display: boolean = true;

  
  @Output()
  printTeste = new EventEmitter<any>();

  @Output()
  displayNoneParent = new EventEmitter<any>();




  constructor(public schedules: SchedulesService, private _toastService: ToastService) { }

  public ngOnInit(): void {
  }

  // close modal
  public closeSelectedScheduleModal(){
    this.displayNoneParent.emit();
  }

  // delete schedule by sending its id to the service delete request method
  public deleteSelectedSchedule() {
    this.schedules.httpDeleteSchedule(this.selectedSchedule.id);
    this.closeSelectedScheduleModal();
  }

  // update the status and sent date/hour of a schedule by sending its whole data row to the service delete request method
  public updateSelectedSchedule (){

    // change Schedule data if it's still waiting
    if(this.selectedSchedule.status == 'waiting'){

      this.selectedSchedule.status = 'sent'
      this.selectedSchedule.date = new Date();
      this.schedules.httpUpdateSchedule(this.selectedSchedule);

    } else {
      //notify user the schedule has been alrdy sent
      this._toastService.info('Esse post já foi enviado!');
    }
    
    this.closeSelectedScheduleModal();
  }

  // define the height of the modal element, it's importante to block the whole content height and prevent user from interacting with other elements
  public getContentHeight() {
    let body = document.body;
    let html = document.documentElement;
    let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

    return `${height}px`;
  }




  //test only
  public printTesteInChild() {
    this.printTeste.emit()
  }

}
