import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductUpdate, Feedback } from '../types/product';
import { getProduct, updateProduct, deleteProduct, getProductFeedback } from '../services/products';
import { handleAuthError, removeToken } from '../services/auth';
import { getErrorMessage } from '../utils/validation';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'feedback'>('details');

  // Edit form state
  const [editForm, setEditForm] = useState<ProductUpdate>({});
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadFeedback();
    }
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const productData = await getProduct(productId);
      setProduct(productData);
      setEditForm({
        name: productData.name,
        description: productData.description,
        category: productData.category
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeToken();
        navigate('/login');
      } else {
        setError(handleAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async () => {
    if (!productId) return;
    
    try {
      const feedbackData = await getProductFeedback(productId);
      setFeedback(feedbackData);
    } catch (err: any) {
      console.error('Failed to load feedback:', handleAuthError(err));
    }
  };

  const validateEditForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (editForm.name !== undefined) {
      const nameError = getErrorMessage('Product Name', editForm.name);
      if (nameError) errors.name = nameError;
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = async () => {
    if (!product || !validateEditForm()) return;
    
    setError('');
    setMessage('');
    
    try {
      const updatedProduct = await updateProduct(product.id, editForm);
      setProduct(updatedProduct);
      setIsEditing(false);
      setMessage('Product updated successfully!');
    } catch (err: any) {
      setError(handleAuthError(err));
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      await deleteProduct(product.id);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(handleAuthError(err));
    }
  };

  const updateEditField = (field: keyof ProductUpdate, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCheckLink = () => {
    if (!product) return '';
    return `${window.location.origin}/check/${product.checklink}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Dashboard
            </button>
            <div>
              <h1 style={{ margin: 0 }}>{product?.name || 'Product'}</h1>
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                backgroundColor: product?.status === 'active' ? '#d4edda' : '#f8d7da',
                color: product?.status === 'active' ? '#155724' : '#721c24'
              }}>
                {product?.status === 'active' ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit Product
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProduct}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={handleDeleteProduct}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724'
          }}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          marginBottom: '2rem',
          background: 'white',
          borderRadius: '8px',
          padding: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: activeTab === 'details' ? '#007bff' : 'transparent',
              color: activeTab === 'details' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === 'details' ? 'bold' : 'normal'
            }}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: activeTab === 'feedback' ? '#007bff' : 'transparent',
              color: activeTab === 'feedback' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === 'feedback' ? 'bold' : 'normal'
            }}
          >
            Feedback ({feedback.length})
          </button>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'details' && (
            <div>
              {isEditing ? (
                // Edit Form
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => updateEditField('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: editErrors.name ? '1px solid #dc3545' : '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                    {editErrors.name && (
                      <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                        {editErrors.name}
                      </small>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Description
                    </label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => updateEditField('description', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        minHeight: '120px',
                        resize: 'vertical',
                        fontSize: '1rem'
                      }}
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => updateEditField('category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="e.g., Mobile App, Web Service, Hardware"
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <div style={{ display: 'grid', gap: '2rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>Product Information</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <strong>Description:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          {product?.description || 'No description provided'}
                        </p>
                      </div>
                      <div>
                        <strong>Category:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          {product?.category || 'Uncategorized'}
                        </p>
                      </div>
                      <div>
                        <strong>Created:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          {product?.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <strong>Last Updated:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          {product?.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ marginBottom: '1rem', color: '#333' }}>Validation Check Link</h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <code style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        color: '#007bff'
                      }}>
                        {getCheckLink()}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(getCheckLink())}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => window.open(getCheckLink(), '_blank')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Preview
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                      Share this link to collect user feedback and validation for your product.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>User Feedback</h3>
              {feedback.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <p style={{ color: '#666', marginBottom: '1rem' }}>No feedback received yet</p>
                  <p style={{ fontSize: '0.9rem', color: '#888' }}>
                    Share your check link to start collecting user feedback!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {feedback.map((item: any) => (
                    <div key={item.id} style={{
                      padding: '1.5rem',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      background: 'white'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          {item.email && (
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
                              {item.email}
                            </p>
                          )}
                          {item.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                              <span>Rating:</span>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} style={{
                                    color: star <= item.rating! ? '#ffc107' : '#dee2e6'
                                  }}>★</span>
                                ))}
                              </div>
                              <span>({item.rating}/5)</span>
                            </div>
                          )}
                        </div>
                        <small style={{ color: '#666' }}>
                          {new Date(item.created_at).toLocaleString()}
                        </small>
                      </div>
                      {item.comment && (
                        <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                          "{item.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;