import React, { useState, useEffect } from "react";
import Loader from './Loader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { User, BarChart2, DollarSign, Users, Lock, QrCode, Home, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Analytics.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const Analytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [data, setData] = useState({
    stats: [],
    urlsOverTime: [],
    clicksOverTime: [],
    detailedUrls: [],
  });
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    shortUrl: null,
    customName: '',
  });

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/analytics/${userId}`
      );
      const result = await response.json();
      console.log("Fetched Analytics Data:", result);

      if (result.stats.totalUrls === 0) {
        navigate("/dashboard", { state: { userId: userId } });
        return;
      }

      const stats = [
        {
          label: "Total URLs",
          value: result.stats.totalUrls || 0,
          change: result.stats.totalUrlsChange || " ",
          icon: <BarChart2 className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "Total Clicks",
          value: result.stats.totalClicks || 0,
          change: result.stats.totalClicksChange || "",
          icon: <User className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "Most Clicked Alias",
          value: result.stats.mostClickedUrl || "N/A",
          change: result.stats.mostClickedUrlChange || "",
          icon: <DollarSign className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "Highest Clicks",
          value: result.stats.mostClickedUrlClicks || 0,
          change: result.stats.mostClickedUrlClicksChange || "",
          icon: <Users className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "Avg Clicks/URL",
          value: result.stats.averageClicksPerUrl || 0,
          change: result.stats.averageClicksPerUrlChange || "",
          icon: <BarChart2 className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "Password-Protected URLs",
          value: result.stats.passwordProtectedUrls || 0,
          change: result.stats.passwordProtectedUrlsChange || " ",
          icon: <Lock className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: "QR Code URLs",
          value: result.stats.qrCodeUrls || 0,
          change: result.stats.qrCodeUrlsChange || " ",
          icon: <QrCode className="stat-icon" />,
          backgroundColor: "#f0f8ff",
        },
        {
          label: <p style={{ color: "#424949" }}><strong>Click to create Snapurl🎯</strong></p>,
          value: <p style={{ color: "#273746" }}><strong>Snap Your URL</strong></p>,
          change: "",
          icon: <Home className="stat-icon" style={{ color: "#FF5733" }} />,
          onClick: () => navigate("/dashboard", { state: { userId: userId } }),
        },
      ];

      setData({
        stats,
        urlsOverTime: result.urlsOverTime || [],
        clicksOverTime: result.clicksOverTime || [],
        detailedUrls: result.detailedUrls || [],
      });
      
      toast.info("Click Snap Your URL card to Snap it!", {
        position: "bottom-center",
        autoClose: 20000,
        theme: "dark",
        color: "#FF5733",
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics", {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (shortUrl) => {
    setDeleteConfirmation({
      isOpen: true,
      shortUrl: shortUrl,
      customName: '',
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      shortUrl: null,
      customName: '',
    });
  };

  const handleDeleteUrl = async () => {
    const { shortUrl, customName } = deleteConfirmation;
    
    // Find the URL to verify custom name
    const urlToDelete = data.detailedUrls.find(url => url.shortUrl === shortUrl);
    
    // Check if entered custom name matches
    if (!urlToDelete || customName.trim() !== urlToDelete.shortUrl) {
      toast.error('Custom URL name does not match!', {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/shorturl/${shortUrl}`, 
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(shortUrl);
            if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      // Remove the deleted URL from the state
      setData(prevData => ({
        ...prevData,
        detailedUrls: prevData.detailedUrls.filter(url => url.shortUrl !== shortUrl),
        stats: prevData.stats.map(stat => {
          // Update relevant stats after deletion
          switch(stat.label) {
            case 'Total URLs':
              return {
                ...stat,
                value: stat.value - 1,
              };
            case 'Total Clicks':
              return {
                ...stat,
                value: stat.value - (prevData.detailedUrls.find(url => url.shortUrl === shortUrl)?.clicks || 0)
              };
            default:
              return stat;
          }
        })
      }));

      toast.success('URL deleted successfully!', {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
      });

      // Close the confirmation modal
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL', {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    if (userId) fetchAnalytics();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Loader className="display-1"/>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <button 
              onClick={closeDeleteConfirmation} 
              className="delete-modal-close"
            >
              <X size={24} />
            </button>
            <h2 className="delete-modal-title">Confirm URL Deletion</h2>
            <p className="text-center mb-4">
              To delete this URL,<br></br> Please enter the custom name:   
              <strong>{deleteConfirmation.shortUrl}</strong>
            </p>
            <input 
              type="text" 
              value={deleteConfirmation.customName}
              onChange={(e) => setDeleteConfirmation(prev => ({
                ...prev, 
                customName: e.target.value
              }))}
              placeholder="Retype the  custom name"
              className="delete-modal-input"
            />
            <div className="delete-modal-actions">
              <button 
                onClick={handleDeleteUrl}
                className="delete-modal-btn delete-modal-btn-delete"
              >
                Delete
              </button>
              <button 
                onClick={closeDeleteConfirmation}
                className="delete-modal-btn delete-modal-btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        {data.stats.map((stat, index) => (
          <div key={index} className="stat-card" onClick={stat.onClick}>
            <div className="stat-content">
              {stat.icon}
              <div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
            <span className="stat-change">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">URLs Created Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.urlsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Clicks Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.clicksOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Clicks Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.stats.filter(stat => typeof stat.value === "number")}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {data.stats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="url-grid">
        {data.detailedUrls.map((url, index) => (
          <div key={index} className="url-card relative">
            <div className="absolute top-2 right-2">
              <Trash2 
                className="text-red-500 hover:text-red-700 cursor-pointer" 
                onClick={() => openDeleteConfirmation(url.shortUrl)}
                size={20}
              />
            </div>
            <p>
              <strong>Short URL:</strong>{" "}
              <a
                href={`https://snappedurl.onrender.com/${url.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                https://snappedurl.onrender.com/{url.shortUrl}
              </a>
            </p>
            <p>
              <strong>Original URL:</strong>{" "}
              <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                {url.originalUrl}
              </a>
            </p>
            <img src={url.qrCode} alt="QR Code" className="qr-code" />
            <p><strong>URL Hits:</strong> {url.clicks}</p>
            <p><strong>Maximum Hits Allowed:</strong> {url.maxClicks || "Unlimited"}</p>
            <p>
              <strong>Password Protected:</strong>{" "}
              {url.password ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(url.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;