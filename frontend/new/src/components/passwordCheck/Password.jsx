import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/backgroundUrl.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Validate = () => {
    const [formData, setFormData] = useState({
        customName: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/validate/${formData.customName}?password=${formData.password}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            const result = await response.json();
            console.log(result);
    
            if (response.ok) {
                toast.success("Redirecting to the original URL...", { autoClose: 1000 });
                setTimeout(() => {
                    window.location.href = result.originalUrl;
                }, 2000);
            } else {
                toast.error(result.message || "Invalid alias or password.", { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to connect to the server.", { autoClose: 3000 });
        }
    };
    

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <Container
                fluid
                className="text-white vh-100 d-flex justify-content-center align-items-center"
                style={{
                    zIndex: 2,
                }}
            >
                <Row
                    className="p-5 rounded shadow"
                    style={{
                        width: "80%",
                        maxWidth: "500px",
                    }}
                >
                    <Col>
                        <h3
                            className="text-center mb-4"
                            style={{
                                fontWeight: "800",
                                fontSize: "2.2rem",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            Verify URL Access
                        </h3>
                        <Form onSubmit={handleSubmit}>
                            {/* Alias Field */}
                            <Form.Group className="mb-3">
                                <Form.Label
                                    style={{
                                        color: "#f0f0f0",
                                        fontWeight: "100",
                                        fontSize: "1rem",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Enter Custom Alias
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customName"
                                    placeholder="Enter your custom alias"
                                    value={formData.customName}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        border: "1px solid #fff",
                                        color: "#2e4053",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                        outline: "none",
                                        padding: "10px",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Form.Group>

                            {/* Password Field */}
                            <Form.Group className="mb-3">
                                <Form.Label
                                    style={{
                                        color: "#f0f0f0",
                                        fontWeight: "100",
                                        fontSize: "1rem",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Enter Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        border: "1px solid #fff",
                                        color: "#2e4053",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                        outline: "none",
                                        padding: "10px",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Form.Group>

                            {/* Submit Button */}
                            <div className="text-center">
                                <Button
                                    variant="light"
                                    type="submit"
                                    className="px-5"
                                    style={{
                                        background: "#1d8348",
                                        border: "none",
                                        borderRadius: "30px",
                                        color: "#fff",
                                    }}
                                >
                                    Verify
                                </Button>
                            </div>
                        </Form>
                        <ToastContainer />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Validate;
