import React from 'react'

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Create Your Product",
      description: "Sign up and create your first product concept. Add descriptions, images, and key details."
    },
    {
      step: "2", 
      title: "Generate Checklink",
      description: "Get a unique trackable URL for your product. This link will be used to collect user feedback."
    },
    {
      step: "3",
      title: "Share & Collect",
      description: "Share your checklink with potential users. They can view your product and provide feedback easily."
    },
    {
      step: "4",
      title: "Analyze Results", 
      description: "Review collected feedback and analytics to make informed decisions about your product."
    }
  ]

  return (
    <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2>How It Works</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Get started with IdeaCheck in four simple steps.
          </p>
        </div>
        
        <div className="grid grid-2">
          {steps.map((step, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#007bff',
                color: 'white',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {step.step}
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ margin: 0, color: '#666' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks