import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  //public channels: any = [];
  //public selectedChannel = null;

  public channels: Subject<any> = new Subject<any>();    // consider putting the actual type of the data you will receive
  public channelsObs = this.channels.asObservable();

  public selectedChannel: Subject<any> = new Subject<any>();    // consider putting the actual type of the data you will receive
  public selectedChannelObs = this.selectedChannel.asObservable();

  

  constructor(private http: HttpClient) {
    // get data from api
    this.httpGetChannels();
   };


  private httpGetChannels() {
    this.http.get('api/channels').subscribe((channels) => {

      //this.channels = channels;
      this.channels.next(channels);

      // the selected channel starts as of index 0
      this.selectedChannel.next(channels[0]);
    });
  };

  // set new selected channel
  public setSelectedChannel(channel) {
    this.selectedChannel.next(channel);
  };

  // public getChannels() {
  //   return this.channels;
  // };
}
