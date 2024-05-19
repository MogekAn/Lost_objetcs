// Configuración de Firebase
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Referencias a elementos del DOM
const welcomePage = document.getElementById('welcome-page');
const registerOptions = document.getElementById('register-options');
const loginOptions = document.getElementById('login-options');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const studentDashboard = document.getElementById('student-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// Mostrar/ocultar secciones
function showElement(element) {
    element.classList.add('visible');
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.remove('visible');
    element.classList.add('hidden');
}

function showRegisterOptions() {
    hideElement(welcomePage);
    showElement(registerOptions);
}

function showLoginOptions() {
    hideElement(welcomePage);
    showElement(loginOptions);
}

function showRegisterForm(role) {
    hideElement(registerOptions);
    showElement(registerForm);
    registerForm.setAttribute('data-role', role);
}

function showLoginForm(role) {
    hideElement(loginOptions);
    showElement(loginForm);
    loginForm.setAttribute('data-role', role);
}

function backToWelcome() {
    hideElement(registerOptions);
    hideElement(loginOptions);
    showElement(welcomePage);
}

function backToRegisterOptions() {
    hideElement(registerForm);
    showElement(registerOptions);
}

function backToLoginOptions() {
    hideElement(loginForm);
    showElement(loginOptions);
}

// Registro de usuarios
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = registerForm.getAttribute('data-role');
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                role: role
            });
        })
        .then(() => {
            alert('Usuario registrado correctamente');
            backToWelcome();
        })
        .catch((error) => {
            alert('Error en el registro: ' + error.message);
        });
});

// Inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = loginForm.getAttribute('data-role');
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).get();
        })
        .then((doc) => {
            if (doc.exists && doc.data().role === role) {
                if (role === 'student') {
                    showStudentDashboard();
                } else if (role === 'admin') {
                    showAdminDashboard();
                }
            } else {
                alert('Rol incorrecto');
                auth.signOut();
            }
        })
        .catch((error) => {
            alert('Error en el inicio de sesión: ' + error.message);
        });
});

// Mostrar dashboards
function showStudentDashboard() {
    hideElement(loginForm);
    showElement(studentDashboard);
}

function showAdminDashboard() {
    hideElement(loginForm);
    showElement(adminDashboard);
}

// Cerrar sesión
function logout() {
    auth.signOut().then(() => {
        backToWelcome();
    });
}

// Buscar objetos perdidos
document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const size = document.getElementById('search-size').value;
    const color = document.getElementById('search-color').value;
    const material = document.getElementById('search-material').value;
    const brand = document.getElementById('search-brand').value;

    db.collection('lost_objects')
        .where('size', '==', size)
        .where('color', '==', color)
        .where('material', '==', material)
        .where('brand', '==', brand)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert('Objeto encontrado, ve a la oficina de objetos perdidos');
            } else {
                alert('Objeto no encontrado');
            }
        })
        .catch((error) => {
            console.error('Error buscando objetos: ', error);
        });
});

// Registrar objetos perdidos
document.getElementById('register-object-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const size = document.getElementById('object-size').value;
    const color = document.getElementById('object-color').value;
    const material = document.getElementById('object-material').value;
    const brand = document.getElementById('object-brand').value;

    db.collection('lost_objects').add({
        size: size,
        color: color,
        material: material,
        brand: brand,
        date: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Objeto registrado correctamente');
    })
    .catch((error) => {
        console.error('Error registrando objeto: ', error);
    });
});

// Listar objetos perdidos
function listLostObjects() {
    const lostObjectsList = document.getElementById('lost-objects-list');
    lostObjectsList.innerHTML = '';

    db.collection('lost_objects')
        .orderBy('date', 'desc')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const listItem = document.createElement('div');
                listItem.textContent = `Tamaño: ${data.size}, Color: ${data.color}, Material: ${data.material}, Marca: ${data.brand}, Fecha: ${data.date.toDate()}`;
                lostObjectsList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Error listando objetos: ', error);
        });
}

// Listar objetos al entrar al dashboard de administrador
adminDashboard.addEventListener('show', listLostObjects);

// Función para abrir el modal de registro
function openRegistration(userType) {
    var modal = document.getElementById('registrationModal');
    modal.style.display = 'block';
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(event.target);
        var username = formData.get('username');
        var password = formData.get('password');
        // Aquí puedes implementar la lógica para registrar al usuario en la base de datos
        console.log('Registrando', userType, 'con nombre de usuario:', username, 'y contraseña:', password);
        closeModal('registrationModal');
    });
}

// Función para abrir el modal de inicio de sesión
function openLogin(userType) {
    var modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(event.target);
        var username = formData.get('loginUsername');
        var password = formData.get('loginPassword');
        // Aquí puedes implementar la lógica para iniciar sesión
        console.log('Iniciando sesión como', userType, 'con nombre de usuario:', username, 'y contraseña:', password);
        if (userType === 'student') {
            // Redireccionar a la página del estudiante
            window.location.href = 'student.html';
        } else if (userType === 'admin') {
            // Redireccionar a la página del administrador
            window.location.href = 'admin.html';
        }
    });
}

// Función para cerrar el modal
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Función para buscar un objeto perdido
function searchLostObject(size, color, material, brand) {
    // Simulando una búsqueda en la base de datos
    var found = false; // Cambiar a true si el objeto se encuentra en la base de datos

    if (found) {
        document.getElementById('searchResult').innerText = "Objeto encontrado, ve a la oficina de objetos perdidos";
    } else {
        document.getElementById('searchResult').innerText = "Objeto no encontrado";
    }
}

// Función para registrar un objeto perdido
function registerLostObject(size, color, material, brand) {
    var formData = new FormData(event.target);
    var objectDetails = formData.entries();
    console.log('Registrando objeto perdido con los siguientes detalles:');
    for (let detail of objectDetails) {
        console.log(detail[0] + ':', detail[1]);
    }
    // Simulación de registro exitoso
    alert('Objeto registrado exitosamente.');
    document.getElementById('registrationResult').innerText = "Objeto registrado exitosamente";
    // Aquí también deberías actualizar la tabla de objetos perdidos
}

// Función para cargar y mostrar la base de datos de objetos perdidos
function loadDatabase() {
    // Aquí puedes implementar la lógica para cargar la base de datos desde el servidor
    // Por ahora, simularemos algunos datos
    var database = [
        { id: 1, name: 'Laptop', color: 'Negro', size: 'Pequeño' },
        { id: 2, name: 'Teléfono', color: 'Blanco', size: 'Mediano' },
        { id: 3, name: 'Bolígrafo', color: 'Azul', size: 'Pequeño' }
    ];
    var databaseElement = document.getElementById('database');
    databaseElement.innerHTML = ''; // Limpiar contenido anterior
    database.forEach(function(object) {
        var objectElement = document.createElement('div');
        objectElement.innerText = 'ID: ' + object.id + ' - Nombre: ' + object.name + ' - Color: ' + object.color + ' - Tamaño: ' + object.size;
        databaseElement.appendChild(objectElement);
    });
}

// Cargar y mostrar la base de datos al cargar la página
window.addEventListener('load', function() {
    loadDatabase();
});

// Función para cerrar sesión
function logout() {
    // Lógica de cierre de sesión
    window.location.href = 'index.html';
}
