// React
import { createContext, useContext, useState } from "react";
// Firebase
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const authContext = createContext();
export const useAuthContext = () => useContext(authContext);

function AuthProvider({ children }) {
  const [error, setError] = useState("");

  const handleAuthError = (code) => {
    setError("");

    console.log(code);

    switch (code) {
      case "auth/user-not-found":
        setError("User not found");
        break;

      case "auth/invalid-email":
        setError("Invalid email");
        break;

      case "auth/weak-password":
        setError("Weak password");
        break;

      case "auth/wrong-password":
        setError("Wrong Email/Password");
        break;

      case "auth/email-already-in-use":
        setError("Email already exists");
        break;

      case "auth/configuration-not-found":
        setError("Firebase Auth is not configured");
        break;

      default:
        setError("Some error occured");
        break;
    }
  };

  const handleLoginWithPassword = async ({ email, password }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleAuthError(error.code);
    }
  };

  const handleSignUpWithPassword = async ({ name, email, password }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = {
        name,
        email: user.email,
      };

      // Making a collection in firestore in order to store extra data about the user.
      // We'll create user with Id we recieved when creating the user.
      // setDoc works same as addDoc but overrides the data like we are doing with Id.
      await setDoc(doc(db, "users", user.uid), userData);
    } catch (error) {
      console.log(error);
      handleAuthError(error.code);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();

    // This will open popup for choosing google account
    const { user } = await signInWithPopup(auth, provider);

    // Here we are checking if user already exists in firestore.
    let docRef = doc(db, "users", user.uid);
    const res = await getDoc(docRef);
    const existingUser = { ...res.data(), id: res.id };

    if (!!existingUser.email) {
      // If user already exists, set your user state with fetched data and return.
      return;
    }

    // If user does not exist, create a document in firestore with Id we got from google signin
    const userData = {
      name: user.displayName,
      email: user.email,
    };
    await setDoc(docRef, userData);
  };

  const contextValue = {
    handleLoginWithPassword,
    handleSignUpWithPassword,
    handleGoogleAuth,
    error,
  };

  return (
    <authContext.Provider value={contextValue}>{children}</authContext.Provider>
  );
}

export default AuthProvider;
