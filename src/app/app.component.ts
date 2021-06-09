import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { Subject, Observable } from 'rxjs';
import { ChannelsService } from './channels.service';
import { SchedulesService } from './schedules.service';

import { ToastService, AngularToastifyModule } from 'angular-toastify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Object = Object;
  JSON = JSON;
  //public files: NgxFileDropEntry[] = [];
  
  //public imageUrl: string | ArrayBuffer;

  ///public schedules: any = [];
  ///public schedulePeriod = null;
  public displayedColumns = ['type', 'status', 'image', 'channel', 'date'];

  //public selectedChannel = null;
  //public dataTeste: Observable<any>;

  // public dataTeste: any = [];
  // public asdasd: any = 'dddd';

  public day: string='';
  public hour: string='00:00';

  public form: FormGroup;

  public formSubmited: boolean = false;

  public stringteste: string = 'string teste asdasdasd';

  public selectedSchedule: any;
  public selectedScheduleDisplayModal: boolean = false;
  

  public constructor(private http: HttpClient, public channels: ChannelsService, public schedules: SchedulesService, private _toastService: ToastService) {
    this.form = new FormGroup({
      channel: new FormControl(null, Validators.compose([Validators.required])),
      image: new FormControl(null, Validators.compose([Validators.required])),
      imageUrl: new FormControl(null, Validators.compose([Validators.required])),
      date: new FormControl(null, Validators.compose([Validators.required, this.minDateValidator])),
      type: new FormControl(null, Validators.compose([Validators.required]))
    });

  };
  
  public trackItem (index: number, item: any) {
    return item.trackId;
  }

  public ngOnInit() {

    // subscribe to keep form channel value always updated with the service selectedChannel
    this.channels.selectedChannelObs.subscribe((channel) => {
      //console.log(channel);
      this.form.patchValue({ channel: channel });
    })

  }

  // function just to avoid the syntax of the service function call
  addInfoToast(message) {
    // function to send the user messages to the _toastService component to be displayed
    this._toastService.info(message);
  }

  // function to validade the prevent of schedules being made before the actual time date/hour.
  minDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    // it also checks if the date is a valid one to be validated
    if ((Object.prototype.toString.call(control.value) === '[object Date]') && (control.value !== undefined) && (isNaN(control.value) || control.value.getTime() <= new Date().getTime())) {
      //console.log('teste')
      return { 'minDate': true };
    }
    return null;
  }

  public schedule() {
    // schedules service function to create a new schedule, send a post request
    this.schedules.httpMakeSchedule(this.form.value);
  };

  public onSubmit ($event){
    $event.preventDefault();
    this.formSubmited = true;

    //console.log(Object.prototype.toString.call(this.form.controls.date.value), this.form.controls.date.value)
    //console.log('erros', this.form.controls.date)

    // form validation and feedback user messages
    if (!this.form.valid){

      // type cannot be empty
      if (this.form.controls.type.errors?.required){
        this.addInfoToast('Necessário Selecionar o Tipo do Agendamento!');
      }

      // date cannot be empty
      if (this.form.controls.date.errors?.required){
        this.addInfoToast('Necessário informar a Data/Hora do Agendamento!');
      }

      // date must be higher than actual date/hour
      if (this.form.controls.date.errors?.minDate){
        this.addInfoToast('A Data/Hora do agendamento precisa ser maior que a atual!');
      }

      // image cannot be empty
      if (this.form.controls.image.errors?.required){
        this.addInfoToast('Necessário Selecionar um Arquivo!');
      }

      return
    } else {
      // if form is valid, then submit it
      this.schedule();
      this.clearForm();
      return
    }
  };

  // function to clear the form after the submit event
  clearForm(){
    this.day='';
    this.hour='00:00';
    this.form.patchValue({ image: null })
    this.form.patchValue({ imageUrl: null })
    this.form.patchValue({ date: null })
    this.form.patchValue({ type: null });

    // manual clean because timepicker's [defaultTime] property doesn't work like a model.
    (<NodeListOf<HTMLInputElement>>document.querySelectorAll('input.ngx-timepicker-control__input'))[0].value = '00';
    (<NodeListOf<HTMLInputElement>>document.querySelectorAll('input.ngx-timepicker-control__input'))[1].value = '00';

    this.formSubmited = false;
  }

  public dropped(files: NgxFileDropEntry[]) {

    //for (const droppedFile of files) {
    if (files[0].fileEntry.isFile) {
      const fileEntry = files[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {

        if (file.type.includes('image')) {
          this.form.patchValue({ image: file });
          //console.log(this.form.controls['image'].value)

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.form.patchValue({ imageUrl: reader.result });
          };
        } else {
          this.addInfoToast('Apenas arquivos de imagem são permitidos!');
        }
      });
    } else {
      const fileEntry = files[0].fileEntry as FileSystemDirectoryEntry;
      console.log(files[0].relativePath, fileEntry);
      this.addInfoToast('Não é um arquivo válido!');
    }
    //}
  };

  // // public getImageUrl(file: NgxFileDropEntry) {
  
  // //   let imgUrl: string | ArrayBuffer;

  // //   const fileEntry = file.fileEntry as FileSystemFileEntry;
  // //   fileEntry.file((file: File) => {
      
  // //     const reader = new FileReader();
  // //     reader.readAsDataURL(file);
  // //     reader.onload = () => {
  // //       //this.imageUrlArray = reader.result;
  // //       //this.imageUrlArray.push(reader.result);
  // //       //console.log(this.imageUrlArray)
  // //       imgUrl = reader.result; 
  // //     };
  // //   });
  // //   return imgUrl;
  // // };

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  // function to change type field from form
  public changeType($event) {
    //this.form.patchValue({ type: $event.index === 0 ? 'feed' : 'story' });

    this.form.patchValue({ type: $event.target.value });
  }

  // function to change date field from form
  public changeDate($event, type){
    console.log($event)
    if (type == 'day'){
      this.day = $event.target.value;
    } else {
      this.hour = $event;
    }
    // way to prevent the bug of one day less: this.form.patchValue({ date: new Date($event.target.value.replace('-','/')) });
    // console.log(new Date(`${this.day} ${this.hour}`));

    this.form.patchValue({ date: new Date(`${this.day} ${this.hour}`) });
  }

  // function to call the Schedule modal, wich can delete/update a schedule
  public selectSchedule(selectedSchedule){
    console.log(selectedSchedule)
    // sets the schedule data to the modal
    this.selectedSchedule = selectedSchedule;
    // sets visibility
    this.selectedScheduleDisplayModal = true ;
  }

  // function to close the schedule modal
  public closeSelectedScheduleModal (){
    // empty the data from previous selected schedule
    this.selectedSchedule = null;
    // sets visibility
    this.selectedScheduleDisplayModal = false ;
  }


  //test only
  public printTeste(varr){
    console.log(varr)
  }
}
