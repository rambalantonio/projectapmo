import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit, OnDestroy {
  empleados: any[] = [];
  subscriptions: any;

  constructor(private empleadoService: EmpleadoService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getEmpleados()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getEmpleados() {
    this.subscriptions = this.empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element:any) => {
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  };

  eliminarEmpleado(id: string) {
    this.empleadoService.eliminarEmpleado(id).then(() => {
      console.log('empleado eliminado con exito');
      this.toastr.error('El Empleado fue eliminado Correctamente', '¡Empleado Eliminado!');
    }).catch(error => {
      console.log(error);
    });
  };

}
