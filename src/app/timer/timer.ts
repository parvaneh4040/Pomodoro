import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
type TaskStatus = 'ToDo' | 'Done';

interface Task {
  id: number;
  title: string;
  description: string;
  expectedPomodoros: number;
  currentPomodoros: number;
  status: TaskStatus;
}

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss']
})
export class Timer implements OnDestroy {
  mode: TimerMode = 'pomodoro';
  selectedTaskId: number | null = null;

  pomodoroMinutes = 25;
  shortBreakMinutes = 5;
  longBreakMinutes = 15;

  remainingSeconds = 25 * 60;
  progress = 100;
  isRunning = false;
  pomodoroCount = 0;

  private intervalId: any = null;

  tasks: Task[] = [
    {
      id: 1,
      title: 'Project 2',
      description: '',
      expectedPomodoros: 4,
      currentPomodoros: 3,
      status: 'ToDo'
    },
    {
      id: 2,
      title: 'Project 3',
      description: '',
      expectedPomodoros: 4,
      currentPomodoros: 4,
      status: 'Done'
    }
  ];

  showTaskForm = false;
  isEditMode = false;

  formTask: Task = this.createEmptyTask();

  constructor(private cdr: ChangeDetectorRef) {}
  selectTask(task: Task) {
  this.selectedTaskId = task.id;
}

getSelectedTaskName(): string {
  const selectedTask = this.tasks.find(t => t.id === this.selectedTaskId);
  return selectedTask ? selectedTask.title : 'No task selected';
}

  createEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      expectedPomodoros: 1,
      currentPomodoros: 0,
      status: 'ToDo'
    };
  }

  start() {
  if (this.isRunning) return;

  this.isRunning = true;

  this.intervalId = setInterval(() => {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds= this.remainingSeconds-1;
      this.updateProgress();
      this.updatePageTitle();
      this.cdr.detectChanges();
    } else {
      this.pause();
      alert('Time is up!');
    }
  }, 1000);
}

pause() {
  this.isRunning = false;

  if (this.intervalId !== null) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  this.cdr.detectChanges();
}
  setMode(newMode: TimerMode) {
    this.pause();
    this.mode = newMode;
    this.remainingSeconds = this.getModeSeconds(newMode);
    this.updateProgress();
    this.updatePageTitle();
    this.cdr.detectChanges();
  }

  getModeSeconds(mode: TimerMode): number {
    if (mode === 'pomodoro') return this.pomodoroMinutes * 60;
    if (mode === 'shortBreak') return this.shortBreakMinutes * 60;
    return this.longBreakMinutes * 60;
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  updateProgress() {
    const total = this.getModeSeconds(this.mode);
    this.progress = (this.remainingSeconds / total) * 100;
  }

  updatePageTitle() {
    document.title = `${this.formatTime(this.remainingSeconds)} - Pomodoro`;
  }

  openAddTaskForm() {
    this.isEditMode = false;
    this.formTask = this.createEmptyTask();
    this.showTaskForm = true;
  }

  openEditTaskForm(task: Task) {
    this.isEditMode = true;
    this.formTask = { ...task };
    this.showTaskForm = true;
  }

  saveTask() {
    if (!this.formTask.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (this.isEditMode) {
      const index = this.tasks.findIndex(t => t.id === this.formTask.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.formTask };
      }
    } else {
      const newTask: Task = {
        ...this.formTask,
        id: Date.now()
      };
      this.tasks.push(newTask);
    }

    this.closeTaskForm();
    this.cdr.detectChanges();
  }

  closeTaskForm() {
    this.showTaskForm = false;
    this.formTask = this.createEmptyTask();
    this.isEditMode = false;
  }

  deleteTask() {
    if (!this.isEditMode) return;

    this.tasks = this.tasks.filter(t => t.id !== this.formTask.id);
    this.closeTaskForm();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.pause();
  }
}