import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { Subject, Observable } from 'rxjs';
import { ChannelsService } from './channels.service';
import { SchedulesService } from './schedules.service';

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

  public form: FormGroup;

  public constructor(private http: HttpClient, public channels: ChannelsService, public schedules: SchedulesService) {
    this.form = new FormGroup({
      channel: new FormControl(null, Validators.compose([Validators.required])),
      image: new FormControl(null, Validators.compose([Validators.required])),
      imageUrl: new FormControl(null, Validators.compose([Validators.required])),
      date: new FormControl(null, Validators.compose([Validators.required])),
      type: new FormControl('feed', Validators.compose([Validators.required]))
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

  // public selectChannel(channel) {
  //   this.channels.setSelectedChannel(channel);
  //   //this.form.patchValue({ channel });
  // }

  public schedule() {
    if (!this.form.valid) return; // TODO: give feedback

    console.log('aa')
    // send post request
    this.schedules.httpMakeSchedule(this.form.value)

    // this.http.post('api/schedules', this.form.value, { responseType: 'json' }).subscribe((data) => {
    //     //this.form.reset();, since the UI state keeps itself, the only data that need to be reseted are inputed date and image.
    //     //this.form.patchValue({ image: null, date: [new Date()] });
    //     //this.files = [];
    //     this.http.get('api/schedules').subscribe((scheduleResponse: any) => {
    //       this.schedulePeriod = {
    //         start_date: scheduleResponse.start_date,
    //         end_date: scheduleResponse.end_date,
    //       };
    //       this.schedules = scheduleResponse.data;
    //       //
    //       //console.log(scheduleResponse)
    //     });
    //   });
  };

  public onSubmit ($event){
    $event.preventDefault();

    this.schedule();
  };

  public dropped(files: NgxFileDropEntry[]) {
    //this.files = files;

    //for (const droppedFile of files) {
    if (files[0].fileEntry.isFile) {
      const fileEntry = files[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {

        if (file.type.includes('image')) {
          this.form.patchValue({ image: file });
          console.log(this.form.controls['image'].value)

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.form.patchValue({ imageUrl: reader.result });
          };
        };
      });
    } else {
      const fileEntry = files[0].fileEntry as FileSystemDirectoryEntry;
      console.log(files[0].relativePath, fileEntry);
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

  public changeDate($event){
    this.form.patchValue({ date: $event.target.value });
  }
}
