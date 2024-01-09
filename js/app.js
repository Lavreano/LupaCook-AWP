'use strict';

// --------- Registramos el service worker ---------

if('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('sw.js')
        .then(function(registration){
        //Registro ok
        console.log('ServiceWorker registrado ok, alcance:', registration.scope);
        }, function(err){
            console.log('El registro del ServiceWorker fallo:', err)
        });
    });
}

// --------- Funcionalidad para Online - Offline ---------

(function () {
    let encabezado = document.querySelector('.encabezado');
    let metaTema = document.querySelector("meta[name=theme-color]");
  
    function estado() {
      if (navigator.onLine) {
        // Cambiar el color del tema cuando este online
        metaTema.setAttribute('content', '#00D900'); // Cambiar a un color que represente "en línea"
        encabezado.classList.remove('offline'); // Eliminar la clase "offline" del encabezado
        alert('Hay conexión a Internet');
      } else {
        // Color del tema cuando esta sin conexion
        metaTema.setAttribute('content', '#D90000'); // Cambiar a un color que represente "sin conexión"
        encabezado.classList.add('offline'); // Agregar la clase "offline" al encabezado
        alert('Sin conexión a Internet');
      }
    }
  
    // Verificar el estado de la conexion al cargar la pagina
    if (!navigator.onLine) {
      estado();
    }
  
    // Escuchar eventos de cambio de estado 
    window.addEventListener('online', estado);
    window.addEventListener('offline', estado);
  })();


// --------- Funcionalidad de Notificación ---------

 /// Solicitar permisos de notificación
function solicitarPermisosNotificacion() {
  // Se solicita permisos al usuario para mostrar lsa notificaciones
  Notification.requestPermission().then((permiso) => {
    if (permiso === 'granted') {
       // Si se otorga el permiso, mostramos la notificacion
      mostrarNotificacion();
    }
  });
}

// Función para mostrar una notificación
function mostrarNotificacion() {
  var title = 'Recetas del día';
  var options = {
    body: '¡Nuevas recetas disponibles!',
    icon: 'img/icon-144x144.png',
    actions: [
      { action: 'like', title: 'Me gusta esta receta' },
      { action: 'dislike', title: 'No me gusta esta receta' }
    ]
  };

 // Se muestra la notificacion usando la API de notificaciones de la ventana
  self.registration.showNotification(title, options);
}

// Configuracion de eventos

// Solicitar permisos de notificación cuando la página carga
window.addEventListener('load', solicitarPermisosNotificacion);

// Configuracion de la notificacion push
self.addEventListener('push', function(e) {
  e.waitUntil(mostrarNotificacion());
});

// Manejo de eventos de clic en las notificaciones
self.addEventListener('notificationclick', function(e) {
  if (e.action === 'like') {
    console.log('¡Me gusta esta receta!');
  } else if (e.action === 'dislike') {
    console.log('No me gusta esta receta');
  }

  e.notification.close();
});


// --------- Funcionalidad para la instalación de la App ---------

let ButInstall = null;
const installButton = document.getElementById('buttonInstall');
installButton.addEventListener('click' , installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Función para manejar el evento beforeinstallprompt

function saveBeforeInstallPromptEvent (e) {
    ButInstall = e;
    installButton.removeAttribute('hidden');
}

// Función para iniciar la instalacion de la PWA

function installPWA(e) {
    ButInstall.prompt();
    e.srcElement.setAttribute('hidden', true);
    ButInstall.userChoice.then((choice) => {
        // Verificar si el usuario acepto o rechazo la instalacion
        if(choice.outcome === "accepted") {
            console.log("Aceptado")
        } else {
            console.log("No aceptado")
        }
        ButInstall = null; // Restablezco la variable ButInstall
    })
}

// Escuchar el evento 'appinstalled' que se dispara cuando la PWA se instala correctamente
window.addEventListener('appinstalled', logAppInstalled)

function logAppInstalled (e) {
    console.log("Se instalo correctamente la aplicación de LupaCook")
}


// --------- Funcionalidad para compartir la App ---------

document.querySelector('.share').addEventListener('click', function() {
    if (navigator.share) {
      // Definimos los datos de la receta que se van a compartir
      const recipeTitle = 'Nombre de la receta';
      const recipeText = 'Descripción de la receta';
      const recipeURL = 'URL de la receta';
  
      // Llama a navigator.share con los datos de la receta
      navigator.share({
        title: recipeTitle,
        text: recipeText,
        url: recipeURL
      })
        .then(function() {
          console.log('¡La receta se compartió con éxito!');
        })
        .catch(function(error) {
          console.log('Error al compartir la receta:', error);
        });
    } else {
      console.log('El navegador no admite la API de compartir');
    }
  });