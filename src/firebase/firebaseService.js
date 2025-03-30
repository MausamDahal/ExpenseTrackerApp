import { db } from '../../usefirebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

export const addExpense = async (uid, expenseData) => {
  await addDoc(collection(db, 'expenses'), {
    ...expenseData,
    uid,
    createdAt: new Date()
  });
};

export const updateExpense = async (id, updatedData) => {
  const ref = doc(db, 'expenses', id);
  await updateDoc(ref, updatedData);
};

export const deleteExpense = async (id) => {
  await deleteDoc(doc(db, 'expenses', id));
};

export const getExpenses = async (uid) => {
  const q = query(collection(db, "expenses"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};