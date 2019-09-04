import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RootComponent } from "./components/root.component";


const routes: Routes = [
  { path: ":url", component: RootComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
