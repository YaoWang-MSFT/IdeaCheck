import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#343a40',
      color: 'white',
      padding: '3rem 0 2rem'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>IdeaCheck</h3>
            <p style={{ color: '#adb5bd', margin: 0 }}>
              Validate your product ideas quickly and effortlessly with trackable feedback collection.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>Features</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>How it Works</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>Pricing</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>Documentation</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>Contact Us</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#adb5bd', textDecoration: 'none' }}>FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #495057',
          paddingTop: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#adb5bd', margin: 0 }}>
            © 2026 IdeaCheck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer