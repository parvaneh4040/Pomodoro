import { Routes } from '@angular/router';
import { Timer } from './timer/timer';
import { Setting } from './setting/setting';


export const routes: Routes = [


    {path:'',redirectTo:'timer',pathMatch:'full'},
    {path:'timer', component:Timer}, 
    {path:'setting', component:Setting},
];
