import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Background from '../../assets/backgroundUrl.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/analytics", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      toast.success("Google Sign-In successful!");
      // Redirect to home or dashboard page
      navigate("/analytics", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${Background})` }}>
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 rounded shadow"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center text-primary mb-4 position-relative">
            Login
            <span
              className="position-absolute rounded-circle bg-primary blink"
              style={{
                width: "16px",
                height: "16px",
                top: "50%",
                left: "-10px",
                transform: "translateY(-50%)",
              }}
            ></span>
          </h2>
          <p className="text-muted text-center mb-3">
            Welcome back! Please login to your account.
          </p>
          <div className="form-floating mb-3">
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-4 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control pe-5"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <span
              className="position-absolute top-50 translate-middle-y end-0 me-3"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline-success w-100 mt-3"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
          <p className="text-center text-muted mt-3">
            Continue without login -- {'> '}
            <a href="dashboard" className="text-primary">
              SnapURL
            </a>
          </p>
          <p className="text-center text-muted mt-3">
            Don’t have an account?{' '}
            <a href="register" className="text-primary">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
