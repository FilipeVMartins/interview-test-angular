import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  Object = Object;
  public files: NgxFileDropEntry[] = [];
  public channels: any = [];
  public schedules: any = [];
  public schedulePeriod = null;
  public displayedColumns = ['type', 'status', 'image', 'channel', 'date'];

  public selectedChannel = null;
  
  public form: FormGroup;

  public constructor(private http: HttpClient) {
    this.form = new FormBuilder().group({
      channel: new FormControl(null, Validators.compose([Validators.required])),
      image: new FormControl(null, Validators.compose([Validators.required])),
      date: new FormControl(null, Validators.compose([Validators.required])),
      type: new FormControl('feed', Validators.compose([Validators.required]))
    });
  }

  public ngOnInit() {
    //this.form.patchValue({ type: 'feed' });
    this.http.get('api/channels').subscribe((channels) => {
      this.selectedChannel = channels[0];
      this.channels = channels;
      this.form.patchValue({ channel: channels[0] });
    });

    this.http.get('api/schedules').subscribe((scheduleResponse: any) => {
      this.schedulePeriod = {
        start_date: scheduleResponse.start_date,
        end_date: scheduleResponse.end_date,
      };
      this.schedules = scheduleResponse.data;
      console.log(this.schedules)
    });
  }

  public selectChannel(channel) {
    this.selectedChannel = channel;
    this.form.patchValue({ channel });
  }

  public schedule($event) {
    $event.preventDefault();
    if (!this.form.valid) return; // TODO: give feedback
    this.http
      .post('api/schedules', this.form.value, { responseType: 'json' })
      .subscribe((data) => {
        //this.form.reset();, since the UI state keeps itself, the only data that need to be reseted are inputed date and image.
        this.form.patchValue({ image: null, date: [new Date()] });
        this.files = [];
        this.http.get('api/schedules').subscribe((scheduleResponse: any) => {
          this.schedulePeriod = {
            start_date: scheduleResponse.start_date,
            end_date: scheduleResponse.end_date,
          };
          this.schedules = scheduleResponse.data;
          //
          //console.log(scheduleResponse)
        });
      });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.form.patchValue({ image: file });
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

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
