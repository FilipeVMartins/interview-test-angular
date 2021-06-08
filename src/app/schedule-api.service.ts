import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
  STATUS,
} from 'angular-in-memory-web-api';
import { schedules, channels } from './fake-api';

export class ScheduleAPIService implements InMemoryDbService {
  private schedules: any = [];

  constructor() {
    this.schedules = schedules;
  }

  createDb() {
    return {
      schedules: this.schedules,
      channels,
    };
  }

  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    console.log('post::', collectionName);
    //console.log('post::', reqInfo);
    console.log(body)

    // create schedule
    if (collectionName === 'schedules' && !body.action) {
      return this.createSchedule(reqInfo, body);
    }

    // delete schedule
    if (collectionName === 'schedules' && body.action && body.action == 'delete') {
      return this.deleteSchedule(reqInfo, body);
    }

    // update schedule
    if (collectionName === 'schedules' && body.action && body.action == 'update') {
      return this.updateSchedule(reqInfo, body);
    }



    return undefined;
  }

  private createSchedule(reqInfo, body) {
    //const body = reqInfo.utils.getJsonBody(reqInfo.req);
    console.log( body );

    this.schedules.data.push(scheduleFactory(body));

    const options: ResponseOptions = {
      body: { data: body },
      status: STATUS.OK,
      headers: reqInfo.headers,
      url: reqInfo.url,
    };

    return reqInfo.utils.createResponse$(() => options);
  }

  private deleteSchedule(reqInfo, body) { 
    console.log({ body });
    
    for (let i=0 ; i<this.schedules.data.length ; i++){
      //console.log(this.schedules.data[i])
      if (this.schedules.data[i].id == body.id){
        this.schedules.data.splice(i, 1);
      }
    }

    const options: ResponseOptions = {
      body: { data: body },
      status: STATUS.OK,
      headers: reqInfo.headers,
      url: reqInfo.url,
    };

    return reqInfo.utils.createResponse$(() => options);
  }

  // body (form) of this should contain id 
  private updateSchedule(reqInfo, body) { 
    console.log({ body });

    // delete
    for (let i=0 ; i<this.schedules.data.length ; i++){
      if (this.schedules.data[i].id == body.schedule.id){
        //update
        //console.log(this.schedules.data);
        this.schedules.data[i]=body.schedule;

        //this.schedules.data.splice(i, 1);
        //create a new one with the same id
        //this.schedules.data.push(scheduleFactory(body));
      }
    }

    const options: ResponseOptions = {
      body: { data: body },
      status: STATUS.OK,
      headers: reqInfo.headers,
      url: reqInfo.url,
    };

    return reqInfo.utils.createResponse$(() => options);
  }




}

  

export const scheduleFactory = (data) => ({
  // this should be treated to ensure that each id is unique, if incoming data alrdy has an id, then use it otherwise create a new one
  id: data.id ? data.id : Math.floor(Math.random() * 1000),
  created_at: new Date(),
  status: (data.date >= new Date().getTime()) ? 'waiting' : 'sent',
  now: false,
  date: data.date,
  caption: 'Lorem ipsom',
  ig_code: null,
  is_history: false,
  is_album: false,
  is_igtv: false,
  is_reels: false,
  ig_image_url: null,
  type: data.type,
  media_type: 'photo',
  image: {
    id: Math.floor(Math.random() * 1000),
    filename: data.image.name,
    is_album: false,
    url:
      //`https://picsum.photos/id/${Math.floor(Math.random() * 400)}/160/200`,
      data.imageUrl,
    type: null,
  },
  channel: {
    id: data.channel.id,
    username: data.channel.user.username,
    profile_pic: data.channel.user.profile_pic,
  },
  socials: [],
});
