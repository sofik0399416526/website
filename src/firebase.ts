import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  increment,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase with safety check
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use the firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const googleProvider = new GoogleAuthProvider();

// Auth Functions
export const loginWithGoogle = async () => {
  console.log("Initiating Google Login...");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Login Success:", user.email);
    
    // Non-blocking profile update to avoid hanging the UI
    setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp()
    }, { merge: true }).catch(err => {
      console.warn("Firestore profile sync failed (ignore if this is a first-time setup):", err.message);
    });
    
    return user;
  } catch (error: any) {
    console.error("Firebase Login Detailed Error:", error);
    let message = "Login Failed: ";
    if (error.code === 'auth/popup-blocked') {
      message += "Popup was blocked by your browser. Please allow popups for this site.";
    } else if (error.code === 'auth/operation-not-allowed') {
      message += "Google login is not enabled in Firebase Console.";
    } else {
      message += error.message;
    }
    throw new Error(message);
  }
};

export const logout = () => signOut(auth);

// Cart Functions
export const addToCart = async (userId: string, product: { id: number, name: string, price: number, image: string }) => {
  const cartRef = collection(db, 'users', userId, 'cart');
  const q = query(cartRef, where('productId', '==', product.id));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Update quantity if already in cart
    const docRef = doc(db, 'users', userId, 'cart', querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      quantity: increment(1)
    });
  } else {
    // Add new item
    await addDoc(cartRef, {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      userId: userId,
      addedAt: serverTimestamp()
    });
  }
};

export const removeFromCart = async (userId: string, itemId: string) => {
  await deleteDoc(doc(db, 'users', userId, 'cart', itemId));
};

export const updateCartQuantity = async (userId: string, itemId: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    await removeFromCart(userId, itemId);
  } else {
    await updateDoc(doc(db, 'users', userId, 'cart', itemId), {
      quantity: newQuantity
    });
  }
};

export { onAuthStateChanged, onSnapshot, collection, query, where };
