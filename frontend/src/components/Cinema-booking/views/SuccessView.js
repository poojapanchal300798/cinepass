import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

const SuccessView = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:5000/session-status?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setSession(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) return <div>Loading payment status...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>No session found</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: "#fff" }}>Payment Successful!</h1>
      <p style={{ color: "#fff", marginBottom: "20px" }}>Thank you for your purchase!</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#a0e9aeff', border: "5px solid #24b040ff", color: 'black', borderRadius: '8px' }}>
        <h3 style={{marginBottom: "15px"}}>Order Details:</h3>
        <p style={{display: "none"}}><strong>Session ID:</strong> {session.id}</p>
        <p><strong>Payment Status:</strong> {session.payment_status}</p>
        <p><strong>Amount:</strong> {(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
        <p><strong>Customer Email:</strong> {session.customer_email}</p>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: "fit-content" }}
      >
        Back to Start
      </button>
    </div>
  );
};

export default SuccessView;