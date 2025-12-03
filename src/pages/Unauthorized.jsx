import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <Header />
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px',
        minHeight: '60vh'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚫</div>
        <h1>403 - Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập trang này.</p>
        <div style={{ marginTop: '20px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              margin: '0 10px',
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600'
            }}
          >
            Quay về Trang chủ
          </Link>
          <Link 
            to="/jobs" 
            style={{
              display: 'inline-block',
              margin: '0 10px',
              padding: '12px 24px',
              backgroundColor: '#2ecc71',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600'
            }}
          >
            Tìm việc làm
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Unauthorized;