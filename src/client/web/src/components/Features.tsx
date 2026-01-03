import React from 'react'

const Features: React.FC = () => {
  const features = [
    {
      title: "Easy Product Creation",
      description: "Create and manage your product concepts with simple, intuitive tools. Add descriptions, images, and key details in minutes.",
      icon: "📝"
    },
    {
      title: "Unique Checklinks", 
      description: "Generate trackable URLs for each product. Share these links to collect targeted feedback from your audience.",
      icon: "🔗"
    },
    {
      title: "User Feedback Collection",
      description: "Collect valuable user feedback through clean, accessible interfaces. Gather ratings, comments, and insights.",
      icon: "💬"
    },
    {
      title: "Analytics & Insights",
      description: "Track engagement metrics and analyze user responses to make data-driven decisions about your products.",
      icon: "📊"
    }
  ]

  return (
    <section className="section" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2>Why Choose IdeaCheck?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to validate your product ideas efficiently and effectively.
          </p>
        </div>
        
        <div className="grid grid-2">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ textAlign: 'center' }}>{feature.title}</h3>
              <p style={{ textAlign: 'center', margin: 0 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features