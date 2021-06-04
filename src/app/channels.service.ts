import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  //public channels: any = [];
  public selectedChannel = null;

  public channels: Subject<any> = new Subject<any>();    // consider putting the actual type of the data you will receive
  public channelsObs = this.channels.asObservable();

  

  constructor(private http: HttpClient) {
    // get data from api
    this.httpGetChannels();

   };


  private httpGetChannels() {
    this.http.get('api/channels').subscribe((channels) => {
      this.selectedChannel = channels[0];

      //this.channels = channels;

      this.channels.next(channels);
      // console.log(res);
    });
  };


  public setSelectedChannel(channel) {
    this.selectedChannel = channel;
  };

  public getChannels() {
    return this.channels;
  };
}
