import { collection, query, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export async function deleteSubcollection(docPath, subcollectionName) {
  const subcollectionRef = collection(db, docPath, subcollectionName);
  const q = query(subcollectionRef);
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
