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
  
  //debug
  public log(val) { console.log(val); }

  public trackItem (index: number, item: any) {
    return item.trackId;
  }

  public ngOnInit() {

    
    
    //this.form.patchValue({ type: 'feed' });
    // this.http.get('api/channels').subscribe((channels) => {
    //   this.selectedChannel = channels[0];
    //   this.channels = channels;
    //   this.form.patchValue({ channel: channels[0] });
    // });


    //console.log(this.channels.channels)

    
    // this.channels.channelsObs.subscribe((channels) => {
    //   console.log(channels);
    //   this.dataTeste = channels;
      
    //   console.log(this.dataTeste);

    // })


    // subscribe to keep form channel value always updated with the service selectedChannel
    this.channels.selectedChannelObs.subscribe((channel) => {
      //console.log(channel);
      this.form.patchValue({ channel: channel });
    })

    this.schedules.schedulePeriodObs.subscribe((schedules) => {
      console.log(schedules);
    })



    




    
    

    // this.http.get('api/schedules').subscribe((scheduleResponse: any) => {
    //   this.schedulePeriod = {
    //     start_date: scheduleResponse.start_date,
    //     end_date: scheduleResponse.end_date,
    //   };
    //   this.schedules = scheduleResponse.data;
    //   //console.log(this.schedules)
    // });
  }

  addInfoToast(message) {
    this._toastService.info(message);
  }

  minDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    //console.log('aafg')
    if ((Object.prototype.toString.call(control.value) === '[object Date]') && (control.value !== undefined) && (isNaN(control.value) || control.value.getTime() <= new Date().getTime())) {
      //console.log('teste')
      return { 'minDate': true };
    }
    return null;
  }

  public schedule() {
    // send post request
    this.schedules.httpMakeSchedule(this.form.value);
  };

  public onSubmit ($event){
    $event.preventDefault();
    this.formSubmited = true;


    //console.log(Object.prototype.toString.call(this.form.controls.date.value), this.form.controls.date.value)
    //console.log('erros', this.form.controls.date)

    // form validation and feedback user messages
    if (!this.form.valid){

      if (this.form.controls.type.errors?.required){
        this.addInfoToast('Necessário Selecionar o Tipo do Agendamento!');
      }

      if (this.form.controls.date.errors?.required){
        this.addInfoToast('Necessário informar a Data/Hora do Agendamento!');
      }

      if (this.form.controls.date.errors?.minDate){
        this.addInfoToast('A Data/Hora do agendamento precisa ser maior que a atual!');
      }

      if (this.form.controls.image.errors?.required){
        this.addInfoToast('Necessário Selecionar um Arquivo!');
      }

      

      

      return
    } else {
      this.schedule();
      this.clearForm();
      return
    }



    //date cannot be empty, date must be higher than actual date/hour
  };

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
    //this.files = files;

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

  public changeType($event) {

    //console.log($event.target.value)
    
    //this.form.patchValue({ type: $event.index === 0 ? 'feed' : 'story' });
    this.form.patchValue({ type: $event.target.value });
    //console.log(this.form.controls['type'].value);
  }

  public changeDate($event, type){
    console.log($event)
    if (type == 'day'){
      this.day = $event.target.value;
    } else {
      this.hour = $event;
    }

    // //console.log($event)
    // console.log('day',this.day)
    // console.log('hour',this.hour)
    // console.log(new Date(`${this.day} ${this.hour}`));
    //this.form.patchValue({ date: new Date($event.target.value.replace('-','/')) });
    this.form.patchValue({ date: new Date(`${this.day} ${this.hour}`) });
    //console.log(this.form.controls.date.value)
  }

  public selectSchedule(selectedSchedule){
    console.log(selectedSchedule)
    this.selectedSchedule = selectedSchedule;
    this.selectedScheduleDisplayModal = true ;
  }

  public closeSelectedScheduleModal (){
    this.selectedSchedule = null;
    this.selectedScheduleDisplayModal = false ;
  }


  //test only
  public printTeste(varr){
    console.log(varr)
  }
}
