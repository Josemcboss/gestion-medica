// Base de datos simulada (en una aplicación real, esto vendría de un backend)
let db = {
    pacientes: [],
    citas: [],
    doctores: [],
    historiales: [],
    facturas: []
};

// Sistema de Notificaciones
const notificaciones = {
    items: [],
    
    agregar(tipo, mensaje) {
        const notificacion = {
            id: generarId(),
            tipo, // 'info', 'exito', 'advertencia', 'error'
            mensaje,
            fecha: new Date(),
            leida: false
        };
        this.items.unshift(notificacion);
        this.actualizar();
        this.mostrarToast(notificacion);
    },

    marcarComoLeida(id) {
        const notificacion = this.items.find(n => n.id === id);
        if (notificacion) {
            notificacion.leida = true;
            this.actualizar();
        }
    },

    actualizar() {
        const contador = this.items.filter(n => !n.leida).length;
        const indicador = document.querySelector('.notificacion-indicador');
        if (contador > 0) {
            indicador.textContent = contador;
            indicador.style.display = 'block';
        } else {
            indicador.style.display = 'none';
        }
    },

    mostrarToast(notificacion) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notificacion.tipo}`;
        toast.innerHTML = `
            <i class="fas ${this.obtenerIcono(notificacion.tipo)}"></i>
            <span>${notificacion.mensaje}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('mostrar'), 100);
        setTimeout(() => {
            toast.classList.remove('mostrar');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    obtenerIcono(tipo) {
        switch(tipo) {
            case 'exito': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'advertencia': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    },

    mostrarPanel() {
        const panelHTML = `
            <div class="panel-notificaciones">
                <h3>Notificaciones</h3>
                ${this.items.length === 0 ? '<p class="sin-notificaciones">No hay notificaciones</p>' :
                this.items.map(n => `
                    <div class="notificacion-item ${n.leida ? 'leida' : ''}" onclick="notificaciones.marcarComoLeida('${n.id}')">
                        <i class="fas ${this.obtenerIcono(n.tipo)}"></i>
                        <div class="notificacion-contenido">
                            <p>${n.mensaje}</p>
                            <small>${this.formatearTiempo(n.fecha)}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        abrirModal(panelHTML);
    },

    formatearTiempo(fecha) {
        const ahora = new Date();
        const diff = ahora - new Date(fecha);
        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
        if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
        if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        return 'hace un momento';
    }
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
        case 'facturacion':
            cargarFacturas();
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
        fechaNacimiento: formData.get('fechaNacimiento'),
        fechaRegistro: new Date().toISOString()
    };
    db.pacientes.push(paciente);
    cerrarModal();
    cargarPacientes();
    actualizarDashboard();
    notificaciones.agregar('exito', `Paciente ${paciente.nombre} registrado correctamente`);
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
    const paciente = db.pacientes.find(p => p.id === formData.get('pacienteId'));
    const doctor = db.doctores.find(d => d.id === formData.get('doctorId'));
    
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
    actualizarDashboard();
    
    // Notificar sobre la nueva cita
    notificaciones.agregar('info', `Nueva cita programada: ${paciente.nombre} con ${doctor.nombre}`);
    
    // Programar recordatorio
    const fechaCita = new Date(cita.fecha);
    const ahora = new Date();
    const tiempoHastaCita = fechaCita - ahora;
    
    if (tiempoHastaCita > 0) {
        setTimeout(() => {
            notificaciones.agregar('advertencia', `Recordatorio: Cita en 30 minutos - ${paciente.nombre} con ${doctor.nombre}`);
        }, tiempoHastaCita - 1800000); // Notificar 30 minutos antes
    }
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
        telefono: formData.get('telefono'),
        fechaRegistro: new Date().toISOString()
    };
    db.doctores.push(doctor);
    cerrarModal();
    cargarDoctores();
    actualizarDashboard();
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

// Funciones para Facturación
function mostrarFormularioFactura() {
    const formulario = `
        <h2>Nueva Factura</h2>
        <form onsubmit="guardarFactura(event)">
            <div class="form-group">
                <label>Paciente:</label>
                <select name="pacienteId" required>
                    ${db.pacientes.map(p => `
                        <option value="${p.id}">${p.nombre}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Fecha:</label>
                <input type="date" name="fecha" required value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div id="items-factura">
                <h3>Conceptos</h3>
                <div class="item-factura">
                    <input type="text" name="conceptos[]" placeholder="Descripción" required>
                    <input type="number" name="montos[]" placeholder="Monto" step="0.01" required>
                    <button type="button" class="btn-primary" onclick="agregarItemFactura()">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label>Método de Pago:</label>
                <select name="metodoPago" required>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                </select>
            </div>
            <div class="form-group">
                <label>Estado:</label>
                <select name="estado" required>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagada">Pagada</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">Guardar Factura</button>
        </form>
    `;
    abrirModal(formulario);
}

function agregarItemFactura() {
    const itemsContainer = document.getElementById('items-factura');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'item-factura';
    nuevoItem.innerHTML = `
        <input type="text" name="conceptos[]" placeholder="Descripción" required>
        <input type="number" name="montos[]" placeholder="Monto" step="0.01" required>
        <button type="button" class="btn-primary" style="background-color: #dc3545;" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    itemsContainer.appendChild(nuevoItem);
}

function guardarFactura(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const conceptos = formData.getAll('conceptos[]');
    const montos = formData.getAll('montos[]');
    const items = conceptos.map((concepto, index) => ({
        concepto,
        monto: parseFloat(montos[index])
    }));

    const factura = {
        id: generarId(),
        numero: `F-${new Date().getFullYear()}-${String(db.facturas.length + 1).padStart(4, '0')}`,
        pacienteId: formData.get('pacienteId'),
        fecha: formData.get('fecha'),
        items: items,
        metodoPago: formData.get('metodoPago'),
        estado: formData.get('estado'),
        total: items.reduce((sum, item) => sum + item.monto, 0)
    };

    db.facturas.push(factura);
    cerrarModal();
    cargarFacturas();
}

function cargarFacturas() {
    const tabla = document.getElementById('tabla-facturas');
    tabla.innerHTML = db.facturas.map(factura => {
        const paciente = db.pacientes.find(p => p.id === factura.pacienteId);
        return `
            <tr>
                <td>${factura.numero}</td>
                <td>${paciente ? paciente.nombre : 'N/A'}</td>
                <td>${formatearFecha(factura.fecha)}</td>
                <td>$${factura.total.toFixed(2)}</td>
                <td>
                    <span class="estado-factura ${factura.estado}">
                        ${factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                    </span>
                </td>
                <td>
                    <button onclick="verDetalleFactura('${factura.id}')" class="btn-primary">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="imprimirFactura('${factura.id}')" class="btn-primary">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function verDetalleFactura(id) {
    const factura = db.facturas.find(f => f.id === id);
    if (!factura) return;

    const paciente = db.pacientes.find(p => p.id === factura.pacienteId);
    const detalleHTML = `
        <h2>Detalle de Factura ${factura.numero}</h2>
        <div class="detalle-factura">
            <div class="info-factura">
                <p><strong>Paciente:</strong> ${paciente ? paciente.nombre : 'N/A'}</p>
                <p><strong>Fecha:</strong> ${formatearFecha(factura.fecha)}</p>
                <p><strong>Estado:</strong> ${factura.estado}</p>
                <p><strong>Método de Pago:</strong> ${factura.metodoPago}</p>
            </div>
            <table class="tabla-datos">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${factura.items.map(item => `
                        <tr>
                            <td>${item.concepto}</td>
                            <td>$${item.monto.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>$${factura.total.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    abrirModal(detalleHTML);
}

function imprimirFactura(id) {
    const factura = db.facturas.find(f => f.id === id);
    if (!factura) return;
    
    const paciente = db.pacientes.find(p => p.id === factura.pacienteId);
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Factura ${factura.numero}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .info-factura { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    .total { font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Factura ${factura.numero}</h1>
                </div>
                <div class="info-factura">
                    <p><strong>Paciente:</strong> ${paciente ? paciente.nombre : 'N/A'}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(factura.fecha)}</p>
                    <p><strong>Método de Pago:</strong> ${factura.metodoPago}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${factura.items.map(item => `
                            <tr>
                                <td>${item.concepto}</td>
                                <td>$${item.monto.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total">
                            <td>Total</td>
                            <td>$${factura.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
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

// Función para actualizar el dashboard
function actualizarDashboard() {
    // Actualizar contadores
    const totalPacientes = db.pacientes.length;
    const citasHoy = obtenerCitasHoy();
    const totalDoctores = db.doctores.length;

    // Calcular tendencias
    const tendenciaPacientes = calcularTendencia('pacientes');
    const proximaCita = obtenerProximaCita();
    const doctoresNuevos = calcularDoctoresNuevos();

    // Actualizar números en el dashboard
    document.querySelector('.card:nth-child(1) .numero').textContent = totalPacientes;
    document.querySelector('.card:nth-child(2) .numero').textContent = citasHoy.length;
    document.querySelector('.card:nth-child(3) .numero').textContent = totalDoctores;

    // Actualizar tendencias
    document.querySelector('.card:nth-child(1) .tendencia').innerHTML = 
        `<i class="fas fa-arrow-${tendenciaPacientes.direccion}"></i> ${tendenciaPacientes.porcentaje}% este mes`;
    document.querySelector('.card:nth-child(2) .tendencia').innerHTML = 
        `<i class="fas fa-clock"></i> Próxima: ${proximaCita ? formatearHora(proximaCita.fecha) : 'No hay citas'}`;
    document.querySelector('.card:nth-child(3) .tendencia').innerHTML = 
        `<i class="fas fa-user-plus"></i> ${doctoresNuevos} nuevos este mes`;

    // Actualizar gráficos
    actualizarGraficoCitas();
    actualizarGraficoEspecialidades();
}

// Funciones auxiliares para el dashboard
function obtenerCitasHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return db.citas.filter(cita => {
        const fechaCita = new Date(cita.fecha);
        fechaCita.setHours(0, 0, 0, 0);
        return fechaCita.getTime() === hoy.getTime();
    });
}

function calcularTendencia(tipo) {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);

    let cantidadActual = 0;
    let cantidadAnterior = 0;

    switch(tipo) {
        case 'pacientes':
            cantidadActual = db.pacientes.filter(p => new Date(p.fechaRegistro) >= inicioMes).length;
            cantidadAnterior = db.pacientes.filter(p => 
                new Date(p.fechaRegistro) >= inicioMesAnterior && 
                new Date(p.fechaRegistro) < inicioMes
            ).length;
            break;
        // Agregar más casos según necesidad
    }

    const diferencia = cantidadAnterior === 0 ? 100 : 
        ((cantidadActual - cantidadAnterior) / cantidadAnterior) * 100;

    return {
        direccion: diferencia >= 0 ? 'up' : 'down',
        porcentaje: Math.abs(Math.round(diferencia))
    };
}

function obtenerProximaCita() {
    const ahora = new Date();
    return db.citas
        .filter(cita => new Date(cita.fecha) > ahora)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];
}

function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function calcularDoctoresNuevos() {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return db.doctores.filter(d => new Date(d.fechaRegistro) >= inicioMes).length;
}

// Funciones para los gráficos
function actualizarGraficoCitas() {
    const chartPlaceholder = document.querySelector('.chart-container:nth-child(1) .chart-placeholder');
    // Aquí implementarías la lógica del gráfico real
    // Por ahora, mostraremos datos simulados
    chartPlaceholder.innerHTML = `
        <div class="chart-data">
            <div class="chart-bar" style="height: 60%;" title="Enero: 45 citas"></div>
            <div class="chart-bar" style="height: 80%;" title="Febrero: 60 citas"></div>
            <div class="chart-bar" style="height: 70%;" title="Marzo: 52 citas"></div>
            <div class="chart-bar active" style="height: 90%;" title="Abril: 68 citas"></div>
        </div>
    `;
}

function actualizarGraficoEspecialidades() {
    const chartPlaceholder = document.querySelector('.chart-container:nth-child(2) .chart-placeholder');
    // Aquí implementarías la lógica del gráfico real
    // Por ahora, mostraremos datos simulados
    chartPlaceholder.innerHTML = `
        <div class="chart-pie">
            <div class="pie-segment" style="--percentage: 35%" title="Medicina General: 35%"></div>
            <div class="pie-segment" style="--percentage: 25%" title="Pediatría: 25%"></div>
            <div class="pie-segment" style="--percentage: 20%" title="Cardiología: 20%"></div>
            <div class="pie-segment" style="--percentage: 20%" title="Otros: 20%"></div>
        </div>
    `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el dashboard por defecto
    mostrarSeccion('dashboard');

    // Agregar algunos datos de ejemplo si no existen
    if (db.pacientes.length === 0) {
        db.pacientes.push({
            id: generarId(),
            nombre: 'Juan Pérez',
            email: 'juan@ejemplo.com',
            telefono: '123456789',
            fechaNacimiento: '1990-01-01',
            fechaRegistro: new Date(2024, 2, 15).toISOString()
        });
    }

    if (db.doctores.length === 0) {
        db.doctores.push({
            id: generarId(),
            nombre: 'Dra. María García',
            especialidad: 'Medicina General',
            email: 'maria@ejemplo.com',
            telefono: '987654321',
            fechaRegistro: new Date(2024, 3, 1).toISOString()
        });
    }

    // Iniciar actualización periódica del dashboard
    actualizarDashboard();
    setInterval(actualizarDashboard, 30000); // Actualizar cada 30 segundos

    // Agregar indicador de notificaciones al header
    const userInfo = document.querySelector('.user-info');
    const notificacionBtn = document.createElement('div');
    notificacionBtn.className = 'notificacion-btn';
    notificacionBtn.innerHTML = `
        <i class="fas fa-bell"></i>
        <span class="notificacion-indicador">0</span>
    `;
    notificacionBtn.onclick = () => notificaciones.mostrarPanel();
    userInfo.insertBefore(notificacionBtn, userInfo.firstChild);

    // Ejemplo de notificación inicial
    setTimeout(() => {
        notificaciones.agregar('info', '¡Bienvenido al Sistema de Gestión Médica!');
    }, 1000);
}); 