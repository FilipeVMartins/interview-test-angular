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

      // weird thing, value is beeing filtered before start filtering
      let schedulePeriod = {
        start_date: scheduleResponse.start_date,
        end_date: scheduleResponse.end_date
      };
      this.schedulePeriod.next(schedulePeriod);


      // start filtering dates out of the specified range
      let start_date = new Date(scheduleResponse.start_date).getTime();
      let end_date = new Date(scheduleResponse.end_date).getTime();
      let scheduleDate;

      for (let i=0; i<scheduleResponse.data.length ; i++) {
        scheduleDate = new Date (scheduleResponse.data[i].date).getTime();
        // if date is within the filter
        if((scheduleDate < start_date) || (scheduleDate > end_date)){
          // then remove it
          scheduleResponse.data.splice(i, 1);
        }
      }

      // send the filtered array to the subscribers
      this.schedules.next(this.sortSchedulesByDate(scheduleResponse.data));
      
    });
  };

  // function to sort the schedules array response by descending date
  private sortSchedulesByDate(schedules){
    //console.log('not-sorted',schedules)
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
    });
    //console.log('sorted',schedules)
    return schedules;
  };

  // send a post request to create a Schedule
  public httpMakeSchedule(formValue) {
    this.http.post('api/schedules', formValue, { responseType: 'json' }).subscribe((data) => {
      // update Schedules
      this.httpGetSchedules();
    });
  }

  // send a post request to create a Schedule
  public httpDeleteSchedule(scheduleID) {
    this.http.post('api/schedules', {action: 'delete', id: scheduleID}, { responseType: 'json' }).subscribe((data) => {
      // update Schedules
      this.httpGetSchedules();
    });
  }

  // send a post request to update a Schedule
  public httpUpdateSchedule(schedule) {
    this.http.post('api/schedules', {action: 'update', schedule: schedule}, { responseType: 'json' }).subscribe((data) => {
      // update Schedules
      this.httpGetSchedules();
    });
  }















}
