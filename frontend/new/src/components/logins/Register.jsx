import React, { useState } from "react";
import "./Login.css";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from '../../assets/backgroundUrl.png';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error("Email already in use. Please login.");
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in with Google!");
      navigate("/"); 
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ backgroundImage: `url(${Background})` }}>
      <form
        className="d-flex flex-column gap-3 w-100 p-4 bg-white rounded shadow-lg"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-primary text-center position-relative">
          Register
          <span
            className="position-absolute rounded-circle bg-primary blink"
            style={{
              width: "16px",
              height: "16px",
              top: "40%",
              left: "-5px",
              transform: "translateY(-50%)",
            }}
          ></span>
        </h2>
        <p className="text-muted text-center">
          Signup now and get full access to our app.
        </p>
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="d-flex gap-2">
          <div className="form-floating w-100">
            <input
              type="text"
              id="firstname"
              className="form-control"
              placeholder="Firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
            />
            <label htmlFor="firstname">Firstname</label>
          </div>
          <div className="form-floating w-100">
            <input
              type="text"
              id="lastname"
              className="form-control"
              placeholder="Lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
            />
            <label htmlFor="lastname">Lastname</label>
          </div>
        </div>
        <div className="form-floating">
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="form-floating position-relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-control"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <span
            className="position-absolute end-0 top-50 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "👀" : "🙈"}
          </span>
        </div>
        <div className="form-floating position-relative">
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            className="form-control"
            placeholder="Confirm password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Confirm password</label>
          <span
            className="position-absolute end-0 top-50 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "👀" : "🙈"}
          </span>
        </div>
        <button className="btn btn-primary w-100">Submit</button>
        <button
          type="button"
          className="btn btn-outline-success w-100"
          onClick={handleGoogleAuth}
        >
          Sign up with Google
        </button>
        <p className="text-center text-muted">
          Already have an account?{" "}
          <a href="/" className="text-primary text-decoration-none">
            Login
          </a>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
