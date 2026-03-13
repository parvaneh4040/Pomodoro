import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink,RouterModule } from '@angular/router';
import { Timer } from './timer/timer';
import { Setting } from './setting/setting';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,RouterModule,Timer,Setting],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Pomodoro');
}
