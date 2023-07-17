let account;

const button = document.getElementById('connect-button');
button.addEventListener('click', connectMetamask);

async function connectMetamask() {
  // Primero, verificamos si el usuario tiene Metamask instalado
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Intentamos solicitar al usuario que nos permita acceder a su cuenta
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Si el usuario acepta, podemos acceder a su cuenta y realizar acciones con ella
      accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Cuenta conectada:', accounts[0]);
      account = accounts[0]

      // Aquí podrías hacer otras cosas con la cuenta, como por ejemplo:
      // - Obtener su saldo
      // - Realizar transacciones
      // - Interactuar con contratos inteligentes
    } catch (error) {
      // Si el usuario rechaza nuestra solicitud o hay algún otro error, lo manejamos aquí
      console.error(error);
    }
  } else {
    // Si el usuario no tiene Metamask instalado, lo notificamos
    console.error('Metamask no detectado');
  }
}


