import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {


  public schedules: Subject<any> = new Subject<any>();
  public schedulesObs = this.schedules.asObservable();

  public schedulePeriod: Subject<any> = new Subject<any>();
  public schedulePeriodObs = this.schedulePeriod.asObservable();




  constructor(private http: HttpClient) {
    // get initial data from api
    this.httpGetSchedules();
  }




  // gets all Schedules from API
  private httpGetSchedules() {
    this.http.get('api/schedules').subscribe((scheduleResponse: any) => {

      
      this.schedules.next(scheduleResponse.data);

      let schedulePeriod = {
        start_date: scheduleResponse.start_date,
        end_date: scheduleResponse.end_date
      };
      this.schedulePeriod.next(schedulePeriod);

      this.sortSchedulesByDate(scheduleResponse.data);
    });
  };

  private sortSchedulesByDate(schedules){
    console.log('not-sorted',schedules)
    
    schedules.sort((a,b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);

      if (dateA.getTime() > dateB.getTime()){
        return -1
      } else
      if (dateB.getTime() > dateA.getTime()){
        return 1
      } else {
        return 0
      }
    })
    console.log('sorted',schedules)
  };

  // send a post request to create a Schedule
  public httpMakeSchedule(formValue) {
    this.http.post('api/schedules', formValue, { responseType: 'json' }).subscribe((data) => {
      // update Schedules
      this.httpGetSchedules();
    });
  }















}
