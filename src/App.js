import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos de react-datepicker
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InputMask from 'react-input-mask';



const url = "http://localhost:8080/estudiantes";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      estudianteId: '',
      nombres: '',
      apellidos: '',
      celular: '',
      correo: '',
      telefono: '',
      genero: '',
      fechaNacimiento: new Date(), 
      fechaIngreso: new Date(),
      direccion: '',
      nombrePadre: '',
      nombreMadre: '',
      encargado: '',
      tipoModal: ''
    },
    errors:{
      nombresError: '',
      apellidosError: '',
      celularError: '',
      telefonoError: '',
      correoError: '',
      nombrePadreError: '',
      nombreMadreError: '',
      encargadoError: ''
    },
    showTable: false,
    showSearchForm: false, // Estado para controlar la visibilidad del formulario de búsqueda
    showAddButton: false,
    activeView: 'estudiantes',
    modalOpen: false, // Estado para controlar si se está realizando la acción de agregar
    typeToAdd: null,
    showStudentView: false,
    showAddOptions: false
  }

  componentDidMount() {
    this.peticionGet();
  }

  peticionGet = () => {
    axios.get(url)
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      })
  }


  //funciona
  peticionPost = async () => {
    const { form } = this.state;
  
    // Verificar si algún campo está vacío
    if (
      !form.nombres ||
      !form.apellidos ||
      !form.celular ||
      !form.correo ||
      !form.telefono ||
      !form.genero ||
      !form.direccion ||
      !form.fechaNacimiento ||
      !form.fechaIngreso ||
      !form.encargado
    ) {
      // Mostrar un mensaje de error y detener la ejecución
      alert('Por favor completa todos los campos.');
      return;
    }
  
    // Realizar la petición POST
    delete form.estudianteId;
    await axios.post(`${url}/agregar1`, form)
      .then(response => {
        this.modalInsertar();
        this.peticionGet();
        window.alert('Estudiante agregado correctamente.');
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  
  peticionPut = () => {
    const { form} = this.state;
  
    // Verificar si algún campo está vacío
    if (
      !form.nombres ||
      !form.apellidos ||
      !form.celular ||
      !form.correo ||
      !form.telefono ||
      !form.genero ||
      !form.direccion ||
      !form.fechaNacimiento ||
      !form.fechaIngreso ||
      !form.encargado
    ) {
      // Mostrar un mensaje de error y detener la ejecución
      alert('Por favor completa todos los campos.');
      return;
    }
  
    // Realizar la petición PUT
    axios.put(`${url}/${form.estudianteId}`, form)
      .then(() => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  handleToggleTable = () => {
    this.setState({ showTable: true, showAddButton: true, showSearchButton: true });
  };
    
    handleChange = (e) => {
    const { name, value } = e.target;
    const { form, errors } = this.state;

   // const upperCase= value.toUpperCase();
   
     // Realizar validaciones según el nombre del campo
  switch (name) {
    case 'nombres':
    case 'apellidos':
    case 'nombrePadre':
    case 'nombreMadre':
    case 'encargado':
      // Validar que solo contenga letras y espacios
      const onlyLettersRegex = /^[A-Za-z\s]+$/;
      if (!onlyLettersRegex.test(value)) {
        this.setState({
          errors: {
            ...errors,
            [`${name}Error`]: `El campo ${name} solo debe contener letras y espacios.`,
          },
        });
      } else {
        this.setState({
          form: {
            ...form,
            [name]: value.toUpperCase(), // Convertir a mayúsculas
          },
          errors: {
            ...errors,
            [`${name}Error`]: '', // Limpiar mensaje de error
          },
        });
      }
      break;
    
    case 'celular':
    case 'telefono':
      // Validar que contenga exactamente 8 dígitos numéricos
      const digitsRegex = /^[0-9-]+$/;
      if (!digitsRegex.test(value)) {
        this.setState({
          errors: {
            ...errors,
            [`${name}Error`]: `El ${name === 'celular' ? 'celular' : 'teléfono'} debe contener exactamente 8 dígitos numéricos.`,
          },
        });
      } else {
        this.setState({
          form: {
            ...form,
            [name]: value,
          },
          errors: {
            ...errors,
            [`${name}Error`]: '', // Limpiar mensaje de error
          },
        });
      }
      break;

    case 'correo':
      // Validar formato de correo electrónico
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        this.setState({
          errors: {
            ...errors,
            correoError: 'El correo electrónico debe tener un formato válido.',
          },
        });
      } else {
        this.setState({
          form: {
            ...form,
            [name]: value,
          },
          errors: {
            ...errors,
            correoError: '', // Limpiar mensaje de error
          },
        });
      }
      break;

    // Agregar más casos según los campos que necesiten validación específica

    default:
      // Para otros campos, simplemente actualizar el estado del formulario
      this.setState({
        form: {
          ...form,
          [name]: value,
        },
      });
      break;
  }
};
    

  handleSearch = () => {
    // Cambiar el estado para mostrar el formulario de búsqueda
    this.setState({ showSearchForm: true });
  };


  peticionDelete = () => {
    axios.delete(`${url}/${this.state.form.estudianteId}`)
      .then(response => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
      })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarEstudiante = (estudiante) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        estudianteId: estudiante.estudianteId,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        celular: estudiante.celular,
        correo: estudiante.correo,
        telefono: estudiante.telefono,
        genero: estudiante.genero,
        fechaNacimiento: estudiante.fechaNacimiento,
        fechaIngreso: estudiante.fechaIngreso,
        direccion: estudiante.direccion,
        nombrePadre: estudiante.nombrePadre,
        nombreMadre: estudiante.nombreMadre,
        encargado: estudiante.encargado
      }
    })
  }

  
  handleDateChange = date => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        fechaNacimiento: date // Actualiza la fecha de nacimiento
      }
    }));
  };

  handleDateChanger = date => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        fechaIngreso: date // Actualiza la fecha de nacimiento
      }
    }));
  };

 
  render() {
    const { form, errors, showSearchButton, showTable, showAddButton,  modalOpen} = this.state;
    return (
      <div className="App">
       
        <h1 style={{ textAlign: 'center' }}>Colegio Divino Niño</h1>

           {/* Botones de navegación */}
      <div style={{ marginBottom: '20px' }}>
        {/* Botón para la vista de agregar */}
        <button
          className="btn btn-success"
          onClick={() => this.setState({ modalOpen: true })}
          style={{ marginRight: '10px' }}
        >
          Registro
        </button>

        {/* Botón para la vista de profesores */}
        <button
          className="btn btn-info"
          onClick={() => this.setState({ showStudentView: false })}
          style={{ marginRight: '10px' }}
        >
          Profesores
        </button>

        {/* Botón para la vista de estudiantes */}
        <button
          className="btn btn-primary"
          onClick={() => this.setState({ showStudentView: true })}
        >
          Estudiantes
        </button>
      </div>

      {/* Ventana modal para agregar */}
      <Modal isOpen={modalOpen} toggle={() => this.setState({ modalOpen: false })}>
        <ModalHeader toggle={() => this.setState({ modalOpen: false })}>
          ¿A quién desea agregar?
        </ModalHeader>
        <ModalBody>
          <button
            className="btn btn-primary"
            onClick={() => this.handleToggleTable({ typeToAdd: 'estudiante', modalOpen: false })}
            style={{ marginRight: '10px' }}
          >
            Estudiantes
          </button>
          <button
            className="btn btn-info"
            onClick={() => this.setState({ typeToAdd: 'profesor', modalOpen: false })}
          >
            Profesores
          </button>
        </ModalBody>
      </Modal>
      
        {/* Botones de navegación */}
      {showAddButton && (
        <button
          className="btn btn-success"
          onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}
          style={{ marginRight: '10px' }}
        >
          Agregar Estudiante
        </button>
      )}
      
      {showSearchButton && (
        <div>
        <button
          className="btn btn-primary"
          onClick={() => this.setState({ showSearchForm: true })}
        >
          Buscar Estudiante
        </button>
        <input
              type="text"
              className="form-control"
              placeholder="Ingrese el nombre o carnet del estudiante"
            />
          </div>
      )}
        
        <img className="imagen-contenedor"
        src={require("./imagenes/f74477cd-0ef0-4da3-8e49-a7beef08cce7.jpg")}
        alt="imagen de la institucion" 
        /> 
  
  {showTable && (
        <table className="table">
          <thead>
            <tr>
              <th>Estudiante ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Celular</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Género</th>
              <th>Fecha Nacimiento</th>
              <th>Fecha Ingreso</th>
              <th>Dirección</th>
              <th>Nombre del Padre</th>
              <th>Nombre de la Madre</th>
              <th>Encargado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderizar la lista de estudiantes aquí */}
            {this.state.data.map(estudiante => (
              <tr key={estudiante.estudianteId}>
                <td>{estudiante.estudianteId}</td>
                <td>{estudiante.nombres}</td>
                <td>{estudiante.apellidos}</td>
                <td>{estudiante.celular}</td>
                <td>{estudiante.correo}</td>
                <td>{estudiante.telefono}</td>
                <td>{estudiante.genero}</td>
                <td>{estudiante.fechaNacimiento}</td>
                <td>{estudiante.fechaIngreso}</td>
                <td>{estudiante.direccion}</td>
                <td>{estudiante.nombrePadre}</td>
                <td>{estudiante.nombreMadre}</td>
                <td>{estudiante.encargado}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => { this.seleccionarEstudiante(estudiante); this.modalInsertar() }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {"   "}
                  <button className="btn btn-danger" onClick={() => { this.seleccionarEstudiante(estudiante); this.setState({ modalEliminar: true }) }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
           
           <div className="my-custom-form">

           <h1>Formulario de inscripcion alumno</h1>

           <div className="form-group">
           </div>
            
            <div className="form-row"> 

            <div className="form-group col-md-6">
              <label htmlFor="nombres" >Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombres"
                id="nombres"
                textTransform="uppercase"
                placeholder="Ej: Carlos Ivan"
                onChange={this.handleChange}
                value={form ? form.nombres : ''}
              />
               {errors.nombresError && (
               <div className="text-danger">{errors.nombresError}</div>
               )}
              </div>
              
              
              <div className="form-group col-md-6">
              <label htmlFor="apellidos">Apellido</label>
              
              <input
                className="form-control"
                type="text"
                name="apellidos"
                id="apellidos"
                placeholder="Ej: Torres Cañas"
                onChange={this.handleChange}
                value={form ? form.apellidos : ''}
              />
              {errors.apellidosError && (
            <div className="text-danger">{errors.apellidosError}</div>
          )}
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="celular" >Celular</label>
              
              <InputMask 
                mask= "9999-9999"
                required = "true"
                className="form-control"
                type="tel"
                name="celular"
                id="celular"
                placeholder="7XXX-XXXX"
                onChange={this.handleChange}
                value={form ? form.celular : ''}
              />
              {errors.celularError && (
            <div className="text-danger">{errors.celularError}</div>
          )}
              </div>

              <div className="form-group col-md-6">
              <label htmlFor="correo">Correo</label>
              <input
                className="form-control"
                type="email"
                name="correo"
                id="correo"
                placeholder="DeatString@gmail.com"
                onChange={this.handleChange}
                value={form ? form.correo : ''}
              />
               {errors.correoError && (
            <div className="text-danger">{errors.correoError}</div>
          )}
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="telefono">Teléfono</label>
              <InputMask
                mask="9999-9999"
                className="form-control"
                type="tel"
                name="telefono"
                id="telefono"
                placeholder="2XXX-XXXX"
                onChange={this.handleChange}
                value={form ? form.telefono : ''}
              />
               {errors.telefonoError && (
               <div className="text-danger">{errors.telefonoError}</div>
               )}
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="genero">Género</label>
              <select
                className="form-control"
                name="genero"
                id="genero"
                onChange={this.handleChange}
                value={form ? form.genero : ''}
              >
                <option value="">Seleccionar género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="direccion">Dirección</label>
              <input
                className="form-control"
                type="text"
                name="direccion"
                id="direccion"
                onChange={this.handleChange}
                value={form ? form.direccion : ''}
              />
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <br />
              <DatePicker
                className="form-control"
                placeholderText="dd/MM/yyyy"
                selected={this.state.form ? this.state.form.fechaNacimiento : null}
                onChange={this.handleDateChange}
                dateFormat="dd/MM/yyyy"
              />
             
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
              <DatePicker
                className="form-control"
                placeholderText="dd/MM/yyyy"
                selected={this.state.form ? this.state.form.fechaIngreso : null}
                onChange={this.handleDateChanger}
                dateFormat="dd/MM/yyyy"
              />
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="nombrePadre">Nombre del Padre</label>
              <input
                className="form-control"
                type="text"
                name="nombrePadre"
                id="nombrePadre"
                placeholder="Nombre completo"
                onChange={this.handleChange}
                value={form ? form.nombrePadre : ''}
              />
               {errors.nombrePadreError && (
            <div className="text-danger">{errors.nombrePadreError}</div>
          )}
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="nombreMadre">Nombre de la Madre</label>
              <input
                className="form-control"
                type="text"
                name="nombreMadre"
                id="nombreMadre"
                placeholder="Nombre completo"
                onChange={this.handleChange}
                value={form ? form.nombreMadre : ''}
              />
               {errors.nombreMadreError && (
            <div className="text-danger">{errors.nombreMadreError}</div>
          )}
              </div>
              
              <div className="form-group col-md-6">
              <label htmlFor="encargado">Encargado</label>
              <input
                className="form-control"
                type="text"
                name="encargado"
                id="encargado"
                placeholder="Nombre completo"
                onChange={this.handleChange}
                value={form ? form.encargado : ''}
              />
                {errors.encargadoError && (
            <div className="text-danger">{errors.encargadoError}</div>
          )} </div>
              </div>
              </div>
              
            
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModal === 'insertar' ? (
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Verificar
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            )}
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
             Estás seguro que deseas eliminar al estudiante {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default App;
