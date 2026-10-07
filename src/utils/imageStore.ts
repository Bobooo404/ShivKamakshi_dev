// IndexedDB helper for storing and retrieving full-resolution user project images

const DB_NAME = 'ShivkamakshiProjectImagesDB';
const STORE_NAME = 'project_photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredPhoto {
  id: string; // e.g. 'shree-kamakshi-saunsthan-0'
  projectId: string;
  index: number;
  dataUrl: string;
  fileName: string;
  title: string;
  tag?: string;
  timestamp: number;
}

export async function saveProjectPhotos(projectId: string, photos: { file: File; title: string; tag?: string }[]): Promise<StoredPhoto[]> {
  const db = await openDB();
  const storedList: StoredPhoto[] = [];

  for (let i = 0; i < photos.length; i++) {
    const item = photos[i];
    const dataUrl = await fileToDataUrl(item.file);
    const photoDoc: StoredPhoto = {
      id: `${projectId}-${i}`,
      projectId,
      index: i,
      dataUrl,
      fileName: item.file.name,
      title: item.title || item.file.name.replace(/\.[^/.]+$/, ''),
      tag: item.tag || 'Real Site Photograph',
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(photoDoc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    storedList.push(photoDoc);
  }

  return storedList;
}

export async function getProjectPhotos(projectId: string): Promise<StoredPhoto[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result as StoredPhoto[]).filter((p) => p.projectId === projectId);
        results.sort((a, b) => a.index - b.index);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read from IndexedDB:', err);
    return [];
  }
}

export async function clearProjectPhotos(projectId: string): Promise<void> {
  const db = await openDB();
  const photos = await getProjectPhotos(projectId);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    photos.forEach((p) => store.delete(p.id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
