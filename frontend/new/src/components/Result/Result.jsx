import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import axios from "axios";
import backgroundImage from "../../assets/backgroundUrl.png";
import githubLogo from '../../assets/githublogo.png';
import linkedinLogo from '../../assets/linkedin.svg';
import mediumLogo from '../../assets/medium-svgrepo-com.svg';
import { AiFillHeart } from "react-icons/ai";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { shortUrl, qrCode, userId } = location.state || {};
    const formattedShortUrl = shortUrl ? `https://snappedurl.onrender.com/${shortUrl}` : null;
    const [showConfetti, setShowConfetti] = useState(true);
    const [likeCount, setLikeCount] = useState(
      localStorage.getItem('likeCount') ? Number(localStorage.getItem('likeCount')) : 0
    ); 

    useEffect(() => {
        const fetchLikeCount = async () => { 
          try {
            const response = await axios.get('https://likeme-backend-fxrs.onrender.com/api/snapurl/count');
            setLikeCount(response.data.count);
            localStorage.setItem('likeCount', response.data.count);
          } catch (error) {
            console.error('Error fetching like count:', error);
          }
        };
        fetchLikeCount();
      }, []);

    const handleLike = async () => {
        try {
          const response = await axios.put('https://likeme-backend-fxrs.onrender.com/api/snapurl/updatecount');
          if (response.status === 200) {
            const likeResponse = await axios.get('https://likeme-backend-fxrs.onrender.com/api/snapurl/count');
            setLikeCount(likeResponse.data.count);
            localStorage.setItem('likeCount', likeResponse.data.count);
            toast.success('Thanks for your Support!', {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              icon: '❤️',
            });
          } else {
            throw new Error('Failed to update like count.');
          }
        } catch (error) {
          console.error('Error updating like count:', error.response || error.message || error);
          toast.error('Something went wrong! Please try again later.', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      };

    const downloadQrCode = () => {
        const qrImage = document.createElement("a");
        qrImage.href = qrCode; 
        qrImage.download = "Snapurl.png"; 
        qrImage.click();
    };

    const handleCopy = () => {
        if (formattedShortUrl) {
            navigator.clipboard.writeText(formattedShortUrl);
            toast.success("Shortened URL copied to clipboard!", { autoClose: 3000 });
        } else {
            toast.error("No URL available to copy.", { autoClose: 3000 });
        }
    };

    const handleAnalytics = () => {
        if (userId) {
            navigate(`/analytics`, { state: { userId: userId } });
            toast.success("Navigating to Analytics!", { autoClose: 3000 });
        } else {
            toast.error("No user ID available for analytics.", { autoClose: 3000 });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    const cardWidth = Math.max(500, Math.max(300, formattedShortUrl ? formattedShortUrl.length * 5 : 250));

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
            <ToastContainer />
            {formattedShortUrl && showConfetti && <Confetti />}
            <div
                style={{
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    textAlign: "center",
                    width: `${cardWidth}px`,
                }}
            >
                {formattedShortUrl ? (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#2c3e50",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                position: "relative",
                            }}
                        >
                            <input
                                type="text"
                                value={formattedShortUrl}
                                readOnly
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "18px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={handleCopy}
                                style={{
                                    background: "#2ecc71",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                📋
                            </button>
                        </div>
                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                borderRadius: "10px",
                            }}
                        >
                            <img
                                src={qrCode}
                                alt="QR Code"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    maxWidth: "200px",
                                    margin: "0 auto",
                                    display: "block",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                marginBottom: "20px",
                            }}
                        >
                            <button
                                style={{
                                    background: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "50%",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open("https://github.com/Jayasurya5454", "_blank")}
                            >
                                <img
                                    src={githubLogo}
                                    alt="github"
                                    style={{ width: "28px", height: "28px" }}
                                />
                            </button>
                            <button
                                style={{
                                    background: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "50%",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open("https://www.linkedin.com/in/jayasurya5454", "_blank")}
                            >
                                <img
                                    src={linkedinLogo}
                                    alt="Website"
                                    style={{ width: "28px", height: "28px" }}
                                />
                            </button>
                            <button
                                style={{
                                    background: "#fff",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "50%",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open("https://jayasurya5454.medium.com/", "_blank")}
                            >
                                <img
                                    src={mediumLogo}
                                    alt="Website"
                                    style={{ width: "28px", height: "28px" }}
                                />
                            </button>
                        </div>
                        <div>
                            <Button
                                style={{
                                    background: "#1abc9c",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                }}
                                onClick={downloadQrCode}
                            >
                                Download QR
                            </Button>
                            <Button
                                style={{
                                    background: "#1abc9c",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "30px",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(formattedShortUrl, "_blank")}
                            >
                                Open Snaped URL
                            </Button>
                            {userId && (
                                <>
                                    <Button
                                        style={{
                                            background: "#1abc9c",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "30px",
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                            position: "relative",
                                        }}
                                        onClick={handleAnalytics}
                                    >
                                        Analytics
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "-10px",
                                                right: "-10px",
                                                background: "#e74c3c",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        >
                                            1
                                        </div>
                                    </Button>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <button
                                            className="like-button"
                                            onClick={handleLike}
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#1abc9c',
                                                border: 'none',
                                                borderRadius: '50px',
                                                padding: '10px 20px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                color: 'white',
                                                overflow: 'hidden',
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                                            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            <AiFillHeart
                                                style={{
                                                    fontSize: '32px',
                                                    marginRight: '8px',
                                                    marginLeft: '5px',
                                                    color: 'red',
                                                    animation: 'pulse 1s infinite',
                                                }}
                                            />
                                            <h2
                                                style={{
                                                    fontSize: '26px',
                                                    fontWeight: 'bold',
                                                    margin: '0',
                                                    color: 'white',
                                                }}
                                            >
                                                {likeCount}
                                            </h2>

                                            {/* Glow effect */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '7',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '0',
                                                    borderRadius: '50px',
                                                    background: '#1abc9c',
                                                    zIndex: '-1',
                                                    opacity: '0',
                                                    transition: 'opacity 0.3s ease',
                                                }}
                                                className="glow-effect"
                                            />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <p>No URL generated. Please try again.</p>
                )}
            </div>
        </div>
    );
};

export default Result;
