import { useState, useEffect, useRef } from 'react';
import './styles.css';
import axios from 'axios';

const MailSender = () => {
    const [formData, setFormData] = useState({
        senderName: '', senderEmail: '', appPassword: '', subject: '', body: '', bcc: '', csvFile: null
    });
    const [loading, setLoading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showHowToUse, setShowHowToUse] = useState(false);

    // Refs for detecting clicks outside
    const helpRef = useRef(null);
    const howToUseRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
            if (howToUseRef.current && !howToUseRef.current.contains(event.target)) {
                setShowHowToUse(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, csvFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        try {
            await axios.post('http://localhost:5000/api/mails/send', data);
            alert('Emails sent successfully!');
        } catch (error) {
            alert('Error sending emails.');
        }
        setLoading(false);
    };

    return (
        <>
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="logo">📧 Bulk MailSender</div>
            </nav>

            {/* Mail Sender Container */}
            <div className="mail-container">
                <h2>Mail Sender</h2>

                {/* "How to Use" Button */}
                <button className="how-to-use-btn" onClick={() => setShowHowToUse(true)}>
                    📖 How to Use
                </button>

                {/* How to Use Popup */}
                {showHowToUse && (
                    <div className="how-to-use-popup" ref={howToUseRef}>
                        <strong>How to Use MailSender:</strong>
                        <ol>
                            <li>Get an **App Password** from Google Security settings.</li>
                            <li>Fill in your sender details and email content.</li>
                            <li>Upload a **CSV file** containing recipient email addresses.</li>
                            <li>Click **Send Emails**, and you're done!</li>
                        </ol>
                    </div>
                )}

                {/* Mail Sender Form */}
                <form onSubmit={handleSubmit} className="mail-form">
                    <input type="text" name="senderName" placeholder="Sender Name" onChange={handleChange} required />
                    <input type="email" name="senderEmail" placeholder="Sender Email" onChange={handleChange} required />

                    {/* Password with Help Icon */}
                    <div className="password-container">
                        <input type="password" name="appPassword" placeholder="App Password" onChange={handleChange} required />
                        <span className="help-icon" onClick={() => setShowHelp(true)}>❓</span>
                        {showHelp && (
                            <div className="help-popup" ref={helpRef}>
                                <strong>How to Get an App Password?</strong>
                                <ol>
                                    <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">Google Security</a>.</li>
                                    <li>Enable 2-Step Verification.</li>
                                    <li>Find "App Passwords" under Security.</li>
                                    <li>Generate a password for "Mail" and "Your Device".</li>
                                    <li>Copy the 16-digit password here.</li>
                                </ol>
                            </div>
                        )}
                    </div>

                    <input type="file" name="csvFile" onChange={handleFileChange} required />
                    <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
                    <textarea name="body" placeholder="Email Body" onChange={handleChange} required />
                    <input type="text" name="bcc" placeholder="BCC (Optional)" onChange={handleChange} />
                    <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Emails'}</button>
                </form>
            </div>
        </>
    );
};

export default MailSender;
