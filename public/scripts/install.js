'use strict';
let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
installButton.removeAttribute('hidden');}

function installPWA(evt) {
  deferredInstallPrompt.prompt();
  evt.srcElement.setAttribute('hidden', true);
  deferredInstallPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('Instalacion aceptada, new friend confirmed', choice);
    } else {
      console.log('Igual jugamos otro dia', choice);
    }
    deferredInstallPrompt = null;
  });
}

window.addEventListener('appinstalled', logAppInstalled);

function logAppInstalled(evt) {
  console.log('UPG ha hecho otro amigo.', evt);}
