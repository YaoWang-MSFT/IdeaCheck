import React from 'react'
import { Link } from 'react-router-dom'

const Hero: React.FC = () => {
  return (
    <section className="section" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1.5rem',
          color: 'white'
        }}>
          Validate Your Product Ideas
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          marginBottom: '2rem', 
          maxWidth: '600px',
          margin: '0 auto 2rem',
          color: 'rgba(255,255,255,0.9)'
        }}>
          IdeaCheck helps entrepreneurs and product managers quickly validate product concepts 
          by collecting user feedback through unique trackable links.
        </p>
        <Link 
          to="/login" 
          className="btn btn-large"
          style={{
            backgroundColor: 'white',
            color: '#667eea',
            fontWeight: '600'
          }}
        >
          Get Started Today
        </Link>
      </div>
    </section>
  )
}

export default Hero