import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/backgroundUrl.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Dashboard = () => {
    const location = useLocation();
    const user = location.state?.userId || null; 
    const [formData, setFormData] = useState({
        originalUrl: "",
        customName: "",
        password: "",
        maxClicks: "",
        user: user,
    });
    const [likeCount, setLikeCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const likeResponse = await axios.get('https://likeme-backend-fxrs.onrender.com/api/snapurl/count');
                setLikeCount(likeResponse.data.count);
                localStorage.setItem('likeCount', likeResponse.data.count);
            } catch (error) {
                console.error('Error updating like count:', error.response || error.message || error);
            }
        };

        fetchLikeCount();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "customName" && /\s/.test(value)) {
            toast.error("Custom alias cannot contain spaces.", { autoClose: 3000 });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shortUrl`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("SnapURL created successfully!", { autoClose: 1000 });
                setTimeout(() => {
                    navigate("/result", { state: { shortUrl: result.shortUrl, qrCode: result.qrcode, userId: user } });
                }, 3000);
            } else if (result.message === "Custom name already in use. Try another name.") {
                toast.error("Custom alias already exists! Please choose another alias.", { autoClose: 4000 });
            } else {
                toast.error(result.message || "An error occurred.", { autoClose: 3000 });
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
                            SnapURL
                        </h3>
                        <Form onSubmit={handleSubmit}>
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
                                    Enter your long URL
                                </Form.Label>
                                <Form.Control
                                    type="url"
                                    name="originalUrl"
                                    placeholder="https://your-long-url.com"
                                    value={formData.originalUrl}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        flex: 1,
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
                                    Custom Alias
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customName"
                                    value={formData.customName}
                                    onChange={handleChange}
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
                                <Form.Text className="text-muted text-light">
                                    Leave blank for random URL slug.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Row>
                                    <Col>
                                        <Form.Label
                                            style={{
                                                color: "#f0f0f0",
                                                fontWeight: "100",
                                                fontSize: "1rem",
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Optional"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                    </Col>
                                    <Col>
                                        <Form.Label
                                            style={{
                                                color: "#f0f0f0",
                                                fontWeight: "100",
                                                fontSize: "1rem",
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Max Clicks
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="maxClicks"
                                            placeholder="Optional"
                                            value={formData.maxClicks}
                                            onChange={handleChange}
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
                                    </Col>
                                </Row>
                            </Form.Group>

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
                                    Snap It
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

export default Dashboard;
