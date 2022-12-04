import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado ';

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      owner: ['', Validators.required],
      pais: ['', Validators.required],
      clienteNegocio: ['', Validators.required],
      cliente: ['', Validators.required],
      clienteFeedback: ['', Validators.required],
      nombre: ['', Validators.required],
      cargo: ['', Validators.required],
      comentario: ['', Validators.required],
      certificaciones: ['', Validators.required],
      herramientas: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id') ?? "";
  }

  ngOnInit(): void {
    this.editCampos();
  }

  agregarEditarEmpleado() {
    this.submitted = true;

    if(this.createEmpleado.invalid){
      return;
    };

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }

  };

  agregarEmpleado() {
    const empleado: any = {
      owner: this.createEmpleado.value.owner,
      pais: this.createEmpleado.value.pais,
      clienteNegocio: this.createEmpleado.value.clienteNegocio,
      cliente: this.createEmpleado.value.cliente,
      clienteFeedback: this.createEmpleado.value.clienteFeedback,
      nombre: this.createEmpleado.value.nombre,
      cargo: this.createEmpleado.value.cargo,
      comentario: this.createEmpleado.value.comentario,
      herramientas: this.createEmpleado.value.herramientas,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('¡Registro Exitoso!', 'Empleado Registrado');
      this.loading = false;
      this.router.navigate(['/list-empleados'])
    }).catch(error => {
      console.log(error)
      this.loading = false;
    });
  };

  editarEmpleado(id: string) {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }

    this.loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado).then(()=> {
      this.loading = false;
      this.toastr.info('El Empleado fue Actualizado Correctamente', '¡Empleado Actualizado!');
      this.router.navigate(['/list-empleados']);
    })
  }

  editCampos(){
    this.titulo = 'Editar Empleado'
    if(this.id !== null){
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        this.loading = false;
        console.log(data.payload.data()['nombre']);
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      })
    }
  }

}
