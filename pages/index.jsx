import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "../context/authContext";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {
    handleLoginWithPassword,
    handleSignUpWithPassword,
    handleGoogleAuth,
    error,
  } = useAuthContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleSignUpWithPassword(formData);
    } else {
      handleLoginWithPassword(formData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id={styles.heading}>{isSignup ? "Signup" : "Login"}</h2>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignup && (
            <div className={styles.inputGrp}>
              <label htmlFor="name">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
              />
            </div>
          )}
          <div className={styles.inputGrp}>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </div>
          <div className={styles.inputGrp}>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
            />
          </div>
          <button>{!isSignup ? "Login" : "Signup"}</button>
          <p
            onClick={() => {
              setIsSignup(!isSignup);
            }}
            className={styles.invert}
          >
            {isSignup ? "Login" : "Signup"} instead.
          </p>
        </form>
        <div id={styles.hr}>
          <p>OR</p>
        </div>
        <button onClick={handleGoogleAuth} id={styles.google}>
          <FcGoogle id={styles.googleIcon} />
          {!isSignup ? "Login" : "Signup"} with google
        </button>
      </div>
    </div>
  );
}
