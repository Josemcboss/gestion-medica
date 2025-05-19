// Base de datos simulada (en una aplicación real, esto vendría de un backend)
let db = {
    pacientes: [],
    citas: [],
    doctores: [],
    historiales: []
};

// Funciones de utilidad
function generarId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Funciones para mostrar/ocultar secciones
function mostrarSeccion(seccionId) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(seccionId).style.display = 'block';

    // Actualizar menú activo
    document.querySelectorAll('.menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="mostrarSeccion('${seccionId}')"]`).classList.add('active');

    // Cargar datos según la sección
    switch(seccionId) {
        case 'pacientes':
            cargarPacientes();
            break;
        case 'citas':
            cargarCitas();
            break;
        case 'doctores':
            cargarDoctores();
            break;
        case 'historiales':
            cargarHistoriales();
            break;
    }
}

// Funciones para el modal
function abrirModal(contenido) {
    document.getElementById('modal-contenido').innerHTML = contenido;
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Event listener para cerrar modal
document.querySelector('.close').addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        cerrarModal();
    }
});

// Funciones para Pacientes
function mostrarFormularioPaciente() {
    const formulario = `
        <h2>Nuevo Paciente</h2>
        <form onsubmit="guardarPaciente(event)">
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Teléfono:</label>
                <input type="tel" name="telefono" required>
            </div>
            <div class="form-group">
                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" required>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    abrirModal(formulario);
}

function guardarPaciente(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const paciente = {
        id: generarId(),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fechaNacimiento: formData.get('fechaNacimiento')
    };
    db.pacientes.push(paciente);
    cerrarModal();
    cargarPacientes();
}

function cargarPacientes() {
    const tabla = document.getElementById('tabla-pacientes');
    tabla.innerHTML = db.pacientes.map(paciente => `
        <tr>
            <td>${paciente.id}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.email}</td>
            <td>${paciente.telefono}</td>
            <td>
                <button onclick="editarPaciente('${paciente.id}')" class="btn-primary">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="eliminarPaciente('${paciente.id}')" class="btn-primary" style="background-color: #dc3545;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Funciones para Citas
function mostrarFormularioCita() {
    const formulario = `
        <h2>Nueva Cita</h2>
        <form onsubmit="guardarCita(event)">
            <div class="form-group">
                <label>Paciente:</label>
                <select name="pacienteId" required>
                    ${db.pacientes.map(p => `
                        <option value="${p.id}">${p.nombre}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Doctor:</label>
                <select name="doctorId" required>
                    ${db.doctores.map(d => `
                        <option value="${d.id}">${d.nombre}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Fecha:</label>
                <input type="datetime-local" name="fecha" required>
            </div>
            <div class="form-group">
                <label>Motivo:</label>
                <textarea name="motivo" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    abrirModal(formulario);
}

function guardarCita(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cita = {
        id: generarId(),
        pacienteId: formData.get('pacienteId'),
        doctorId: formData.get('doctorId'),
        fecha: formData.get('fecha'),
        motivo: formData.get('motivo')
    };
    db.citas.push(cita);
    cerrarModal();
    cargarCitas();
}

function cargarCitas() {
    // Aquí implementarías la lógica del calendario
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '<p>Calendario en desarrollo...</p>';
}

// Funciones para Doctores
function mostrarFormularioDoctor() {
    const formulario = `
        <h2>Nuevo Doctor</h2>
        <form onsubmit="guardarDoctor(event)">
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
                <label>Especialidad:</label>
                <input type="text" name="especialidad" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Teléfono:</label>
                <input type="tel" name="telefono" required>
            </div>
            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;
    abrirModal(formulario);
}

function guardarDoctor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const doctor = {
        id: generarId(),
        nombre: formData.get('nombre'),
        especialidad: formData.get('especialidad'),
        email: formData.get('email'),
        telefono: formData.get('telefono')
    };
    db.doctores.push(doctor);
    cerrarModal();
    cargarDoctores();
}

function cargarDoctores() {
    const grid = document.getElementById('lista-doctores');
    grid.innerHTML = db.doctores.map(doctor => `
        <div class="doctor-card">
            <img src="https://via.placeholder.com/100" alt="${doctor.nombre}">
            <h3>${doctor.nombre}</h3>
            <p>${doctor.especialidad}</p>
            <p>${doctor.email}</p>
            <p>${doctor.telefono}</p>
            <button onclick="editarDoctor('${doctor.id}')" class="btn-primary">
                <i class="fas fa-edit"></i> Editar
            </button>
        </div>
    `).join('');
}

// Funciones para Historiales
function cargarHistoriales() {
    const lista = document.getElementById('lista-historiales');
    lista.innerHTML = db.historiales.map(historial => `
        <div class="historial-item">
            <h3>Paciente: ${db.pacientes.find(p => p.id === historial.pacienteId)?.nombre}</h3>
            <p>Fecha: ${formatearFecha(historial.fecha)}</p>
            <p>Doctor: ${db.doctores.find(d => d.id === historial.doctorId)?.nombre}</p>
            <p>Diagnóstico: ${historial.diagnostico}</p>
        </div>
    `).join('');
}

// Funciones de edición y eliminación
function editarPaciente(id) {
    const paciente = db.pacientes.find(p => p.id === id);
    if (!paciente) return;

    const formulario = `
        <h2>Editar Paciente</h2>
        <form onsubmit="actualizarPaciente(event, '${id}')">
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value="${paciente.nombre}" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" value="${paciente.email}" required>
            </div>
            <div class="form-group">
                <label>Teléfono:</label>
                <input type="tel" name="telefono" value="${paciente.telefono}" required>
            </div>
            <div class="form-group">
                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" value="${paciente.fechaNacimiento}" required>
            </div>
            <button type="submit" class="btn-primary">Actualizar</button>
        </form>
    `;
    abrirModal(formulario);
}

function actualizarPaciente(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const index = db.pacientes.findIndex(p => p.id === id);
    if (index === -1) return;

    db.pacientes[index] = {
        ...db.pacientes[index],
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fechaNacimiento: formData.get('fechaNacimiento')
    };

    cerrarModal();
    cargarPacientes();
}

function eliminarPaciente(id) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
        db.pacientes = db.pacientes.filter(p => p.id !== id);
        cargarPacientes();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el dashboard por defecto
    mostrarSeccion('dashboard');

    // Agregar algunos datos de ejemplo
    if (db.pacientes.length === 0) {
        db.pacientes.push({
            id: generarId(),
            nombre: 'Juan Pérez',
            email: 'juan@ejemplo.com',
            telefono: '123456789',
            fechaNacimiento: '1990-01-01'
        });
    }

    if (db.doctores.length === 0) {
        db.doctores.push({
            id: generarId(),
            nombre: 'Dra. María García',
            especialidad: 'Medicina General',
            email: 'maria@ejemplo.com',
            telefono: '987654321'
        });
    }
}); 