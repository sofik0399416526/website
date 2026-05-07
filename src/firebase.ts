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
      message += "Popup was blocked. Please allow popups for this site or try clicking the login button again.";
    } else if (error.code === 'auth/unauthorized-domain') {
      message += "This domain is not authorized in your Firebase Console. Please add '" + window.location.hostname + "' to the 'Authorized Domains' list in Firebase Authentication settings.";
    } else if (error.code === 'auth/operation-not-allowed') {
      message += "Google login is not enabled in Firebase Console.";
    } else {
      message += error.message;
    }
    throw new Error(message);
  }
};

export const logout = () => signOut(auth);

// --- Improved Firestore Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

// Cart Functions
export const addToCart = async (userId: string, product: { id: number, name: string, price: number, image: string }) => {
  const cartPath = `users/${userId}/cart`;
  try {
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
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, cartPath);
  }
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const path = `users/${userId}/cart/${itemId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'cart', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const updateCartQuantity = async (userId: string, itemId: string, newQuantity: number) => {
  const path = `users/${userId}/cart/${itemId}`;
  try {
    if (newQuantity <= 0) {
      await removeFromCart(userId, itemId);
    } else {
      await updateDoc(doc(db, 'users', userId, 'cart', itemId), {
        quantity: newQuantity
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export { onAuthStateChanged, onSnapshot, collection, query, where };
