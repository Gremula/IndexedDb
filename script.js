import Dexie from 'dexie';

// Crea un'istanza del database
const db = new Dexie('MyDatabase');
db.version(1).stores({
  files: 'id, name, content' // Definisci la struttura
});

// Funzione per scaricare un file
async function downloadFile(url) {
  const response = await fetch(url);
  const blob = await response.blob(); // Ottieni il blob del file
  return blob; // Restituisci il blob
}

// Funzione per salvare un file in IndexedDB
async function saveFile(id, name, blob) {
  const content = await blob.arrayBuffer(); // Converti il blob in ArrayBuffer
  await db.files.put({ id, name, content });
}

// Funzione per mostrare i messaggi di stato
function showStatusMessage(message) {
  const statusMessageElement = document.getElementById('statusMessage');
  statusMessageElement.textContent = message;
}

// Gestione del pulsante di salvataggio
document.getElementById('saveButton').addEventListener('click', async () => {
  showStatusMessage('Inizio download dei file...'); // Messaggio di inizio
  console.time("downloadAndSave");
  
  try {
    const blob = await downloadFile('path/to/your/file-of-1mb.png'); // Sostituisci con il tuo URL
    await saveFile(1, 'file-of-1mb.png', blob);
    console.timeEnd("downloadAndSave"); // Mostra il tempo impiegato
    showStatusMessage('File scaricato e salvato in IndexedDB!'); // Messaggio di completamento
  } catch (error) {
    console.error('Errore nel download o salvataggio:', error);
    showStatusMessage('Si è verificato un errore durante il download.'); // Messaggio di errore
  }
});

// Gestione del pulsante di aggiornamento
document.getElementById('updateButton').addEventListener('click', async () => {
  showStatusMessage('Aggiornamento dei file...'); // Messaggio di aggiornamento
  const files = await loadFiles();
  
  for (const file of files) {
    try {
      const newBlob = await downloadFile(file.name); // Scarica il nuovo contenuto
      await saveFile(file.id, file.name, newBlob); // Aggiorna il file
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
      showStatusMessage('Errore durante l\'aggiornamento di un file.'); // Messaggio di errore
      return; // Esci dal ciclo in caso di errore
    }
  }
  showStatusMessage('File aggiornati!'); // Messaggio di completamento
});
