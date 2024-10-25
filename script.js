import Dexie from 'dexie';

const db = new Dexie('MyDatabase');
db.version(1).stores({
  files: 'id, name, content'
});

async function downloadFile(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}

async function saveFile(id, name, blob) {
  const content = await blob.arrayBuffer();
  await db.files.put({ id, name, content });
}

function showStatusMessage(message) {
  const statusMessageElement = document.getElementById('statusMessage');
  statusMessageElement.textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', async () => {
    console.log('Pulsante di salvataggio cliccato'); // Debug
    showStatusMessage('Inizio download dei file...');
    console.time("downloadAndSave");

    try {
      const blob = await downloadFile('path/to/your/file-of-1mb.png'); // Sostituisci con il tuo URL
      await saveFile(1, 'file-of-1mb.png', blob);
      console.timeEnd("downloadAndSave");
      showStatusMessage('File scaricato e salvato in IndexedDB!');
    } catch (error) {
      console.error('Errore nel download o salvataggio:', error);
      showStatusMessage('Si è verificato un errore durante il download.');
    }
  });

  document.getElementById('updateButton').addEventListener('click', async () => {
    showStatusMessage('Aggiornamento dei file...');
    const files = await db.files.toArray();

    for (const file of files) {
      try {
        const newBlob = await downloadFile(file.name);
        await saveFile(file.id, file.name, newBlob);
      } catch (error) {
        console.error('Errore durante l\'aggiornamento:', error);
        showStatusMessage('Errore durante l\'aggiornamento di un file.');
        return;
      }
    }
    showStatusMessage('File aggiornati!');
  });
});
