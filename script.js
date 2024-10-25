import Dexie from 'dexie';

// Crea un'istanza del database
const db = new Dexie('MyDatabase');
db.version(1).stores({
  files: 'id, name, content' // Definisci la struttura
});

// Funzione per salvare un file
async function saveFile(id, name, content) {
  await db.files.put({ id, name, content });
}

// Funzione per caricare i file
async function loadFiles() {
  return await db.files.toArray(); // Restituisce un array di file
}

// Funzione per aggiornare un file
async function updateFile(id, newContent) {
  await db.files.update(id, { content: newContent });
}

// Funzione per scaricare un file
async function downloadFile(url) {
  const response = await fetch(url);
  const content = await response.text(); // Ottieni il contenuto del file
  return content;
}

// Gestione del pulsante di salvataggio
document.getElementById('saveButton').addEventListener('click', async () => {
  // Scarica e salva i file
  await saveFile(1, 'index.html', await downloadFile('index.html'));
  await saveFile(2, 'styles.css', await downloadFile('styles.css'));
  await saveFile(3, 'script.js', await downloadFile('script.js'));
  await saveFile(4, 'image.png', await downloadFile('image.png'));
  alert('File scaricati e salvati in IndexedDB!');
});

// Gestione del pulsante di aggiornamento
document.getElementById('updateButton').addEventListener('click', async () => {
  const files = await loadFiles();
  for (const file of files) {
    const newContent = await downloadFile(file.name); // Scarica il nuovo contenuto
    await updateFile(file.id, newContent); // Aggiorna il file
  }
  alert('File aggiornati!');
});
