import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  public channels: any = [];
  public selectedChannel = null;

  constructor(private http: HttpClient) {
    // get data from api
    this.getChannels ();

   };


  private getChannels () {
    this.http.get('api/channels').subscribe((channels) => {
      this.selectedChannel = channels[0];
      this.channels = channels;
    });
  };


  public setSelectedChannel (channel) {
    this.selectedChannel = channel;
  };
}
