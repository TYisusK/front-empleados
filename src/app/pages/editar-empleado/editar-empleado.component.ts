import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-editar-empleado',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.css'
})
export class EditarEmpleadoComponent implements OnInit {

  //Propiedades
  editarEmpleadoForm: FormGroup = new FormGroup({});
  enviado: boolean = false;
  empleadoDepartamentos: any = [
    'Administración',
    'Contabilidad',
    'Recursos Humanos',
    'TI',
    'Ventas',
    'All'
  ];
  empleadoData: Empleado[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private empleadoService: EmpleadoService,
    private actRoute: ActivatedRoute
  ){
    //this.mainForm();
  }

  ngOnInit(): void{
    this.mainForm();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getEmpleado(id);
  }

  //Método para definir el formulario
  mainForm(){
    this.editarEmpleadoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      email: ['', 
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      telefono: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
        ],
      ],
    });
  }

  //Método que asigna el departamento seleccionado a la propiedad del formulario.
  actualizarDepartamento(event:Event):void {
    const seleccionarElemento = event.target as HTMLSelectElement;
    const departamentoSeleccionado = seleccionarElemento.value;
    this.editarEmpleadoForm.get('departamento')?.setValue(departamentoSeleccionado);
  }

  //getter para acceder a los controles del formulario.
  get myForm() {
    return this.editarEmpleadoForm.controls;
  }

  //Método para buscar al empleado que vamos a modificar y asignarlo al formulario.
  getEmpleado(id:any){
    this.empleadoService.getEmpleado(id).subscribe((data) => {
      this.editarEmpleadoForm.setValue({
        nombre: data['nombre'],
        departamento: data['departamento'],
        email: data['email'],
        telefono: data['telefono'],
      });
    })
  }

  //Método que se ejecuta cuando se hace el submit
  onSubmit(){
    this.enviado = true;
    if(!this.editarEmpleadoForm.valid) {
      return false;
    } else {
      if (window.confirm('¿Esta seguro que lo desea modificar los datos?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.empleadoService.actualizarEmpleado(id, this.editarEmpleadoForm.value)
        .subscribe({
          complete: () => {
            this.router.navigateByUrl('/listar-empleados');
            console.log('Se actualizó correctamente');
          },
          error: (e) => {
            console.log(e);
          }
        })
      }
    }
    return;
  }

}

