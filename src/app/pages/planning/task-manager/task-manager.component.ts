import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from "../../../services/task/task.service";
import {Observable} from "rxjs";
import {taskDTO} from "../../../models/taskDTO";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {PlanningService} from "../../../services/planning/planning.service";
import {planningDTO} from "../../../models/planningDTO";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
  providers: [DatePipe]
})
export class TaskManagerComponent implements OnInit {

  @Input()
  planningId: number = 0;

  @Input()
  userId: number = 0;


  managedTask$: Observable<taskDTO | null> = this.taskService.managedTask;
  planning$: Observable<planningDTO | null> = this.planningService.planning;
  isOwner$: Observable<boolean> = this.planningService.owner;

  task: taskDTO | null = null;
  isOwner: boolean = false;

  saveBtnStyle = {background: 'var(--fourth-bg-color)'};

  formTask!: FormGroup;

  checkDates: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get("taskDateStart");
    const endDate = group.get("taskDateEnd");
    const startTime = group.get("taskTimeStart");
    const endTime = group.get("taskTimeEnd");

    const dateStart = new Date(startDate?.value.toString());
    const [hStart, mStart] = startTime?.value.toString().split(":");
    dateStart.setHours(hStart);
    dateStart.setMinutes(mStart)

    const dateEnd = new Date(endDate?.value.toString());
    const [hEnd, mEnd] = endTime?.value.toString().split(":");
    dateEnd.setHours(hEnd);
    dateEnd.setMinutes(mEnd)

    return dateEnd >= dateStart ? null : {incorrectDates: true}
  }

  checkDifferences: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get("taskDateStart");
    const endDate = group.get("taskDateEnd");
    const startTime = group.get("taskTimeStart");
    const endTime = group.get("taskTimeEnd");

    const dateStart = new Date(startDate?.value.toString());
    const [hStart, mStart] = startTime?.value.toString().split(":");
    dateStart.setHours(hStart);
    dateStart.setMinutes(mStart)

    const dateEnd = new Date(endDate?.value.toString());
    const [hEnd, mEnd] = endTime?.value.toString().split(":");
    dateEnd.setHours(hEnd);
    dateEnd.setMinutes(mEnd)

    const description = group.get("taskDescription")?.value;
    const name = group.get("taskName")?.value;

    const dateStartFromDTO = new Date(this.task?.dateTaskStart as Date).toISOString()

    const dateEndFromDTO = new Date(this.task?.dateTaskEnd as Date).toISOString();

    return (dateEnd.toISOString() != dateEndFromDTO || dateStart.toISOString() != dateStartFromDTO || description != this.task?.description || name != this.task?.nameTask) ? null : {"noDifference": true}
  }

  constructor(private planningService: PlanningService, private taskService: TaskService, private toastr: ToastrService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.formTask = this.formBuilder.group({
      taskName: new FormControl("", [Validators.required]),
      taskDateStart: new FormControl(new Date(), [Validators.required]),
      taskDateEnd: new FormControl(new Date(), [Validators.required]),
      taskTimeStart: new FormControl("00:00", [Validators.required]),
      taskTimeEnd: new FormControl("23:59", [Validators.required]),
      taskDescription: new FormControl(""),
    }, {validators: this.checkDates})

    this.managedTask$.subscribe({
      next: (taskDto) => {
        if (taskDto) {
          this.task = taskDto;
          this.formTask.addValidators(this.checkDifferences)
          this.formTask.setValue({
            taskName: this.task.nameTask,
            taskDateStart: this.datePipe.transform(this.task.dateTaskStart, 'yyyy-MM-ddTHH:mm', '+0200'), /* new Date(this.task.dateTaskStart).toLocaleDateString(),*/
            taskDateEnd: this.datePipe.transform(this.task.dateTaskEnd, 'yyyy-MM-ddTHH:mm', '+0200'),
            taskDescription: this.task.description
          })
        }
      }
    });

    // this.planning$.subscribe({
    //   next: (val) => {
    //     if (val) {
    //       this.planningId = val.idPlanning;
    //     }
    //   }
    // });

    this.isOwner$.subscribe({
      next: (val) => {
        this.isOwner = val;
      }
    });
  }

  submitTask() {

    if (this.formTask.valid) {

      const dateStart = new Date(this.formTask.value.taskDateStart);
      const dateEnd = new Date(this.formTask.value.taskDateEnd);

      const newTask: taskDTO = {
        idPlanning: this.planningId,
        nameTask: this.formTask.value.taskName,
        description: this.formTask.value.taskDescription,
        dateTaskStart: dateStart,
        dateTaskEnd: dateEnd,
      }

      if (this.task == null) {
        this.taskService.addTask(newTask, this.isOwner).subscribe({
          next: (taskDto) => {
            this.toastr.success(`New Task with ID ${taskDto.idTask} added to the Planning ID ${taskDto.idPlanning}`);
            this.planningService.addNewTaskLocally(taskDto);
            this.formTask.reset();
          }
        })
      } else {
        newTask.idTask = this.task.idTask;
        this.taskService.updateTask(newTask, this.isOwner).subscribe({
          next: (taskDto) => {
            this.toastr.success(`Updated Task with ID ${taskDto.idTask} modified on the Planning ID ${taskDto.idPlanning}`);
            this.planningService.updateTaskLocally(taskDto);
            this.formTask.reset();
          }
        })
      }

      console.log(newTask);
    }
  }

  deleteTask() {
    this.formTask.clearValidators();
    this.formTask.reset();
    Object.keys(this.formTask.controls).forEach((key) => {
      const control = this.formTask.controls[key];
      control.markAsPristine();
      control.markAsUntouched();
    });
    if (this.isOwner) {
      this.taskService.deleteTask(this.task?.idTask!).subscribe({
        next: () => {
          this.planningService.deleteTaskLocally(this.task?.idTask!);
        }
      })
    } else {
      this.taskService.deleteTaskShared(this.task?.idTask!, this.userId, this.planningId).subscribe({
        next: () => {
          this.planningService.deleteTaskLocally(this.task?.idTask!);
        }
      })
    }
  }

  closeManager() {
    this.taskService.closeTask();
  }

}
