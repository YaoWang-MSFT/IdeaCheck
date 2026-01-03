import React, { useState, useEffect } from 'react';
import { Product, ProductCreate } from '../types/product';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { handleAuthError } from '../services/auth';
import { getErrorMessage } from '../utils/validation';
import ProductCard from './ProductCard';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState<ProductCreate>({
    name: '',
    description: '',
    category: ''
  });
  const [createErrors, setCreateErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const validateCreateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    const nameError = getErrorMessage('Product Name', createForm.name);
    if (nameError) errors.name = nameError;
    
    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validateCreateForm()) return;
    
    try {
      const newProduct = await createProduct(createForm);
      setProducts(prev => [newProduct, ...prev]);
      setCreateForm({ name: '', description: '', category: '' });
      setShowCreateForm(false);
      setMessage('Product created successfully! Click on the card to manage it.');
    } catch (err: any) {
      setError(handleAuthError(err));
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setMessage('Product deleted successfully!');
    } catch (err: any) {
      setError(handleAuthError(err));
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'disabled' : 'active';
    try {
      const updatedProduct = await updateProduct(product.id, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setMessage(`Product ${newStatus === 'active' ? 'activated' : 'disabled'} successfully!`);
    } catch (err: any) {
      setError(handleAuthError(err));
    }
  };

  const updateCreateField = (field: keyof ProductCreate, value: string) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
    if (createErrors[field]) {
      setCreateErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading your products...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Your Products</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} • Click on cards to view details
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: showCreateForm ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Product'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          color: '#155724',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✅</span>
          {message}
        </div>
      )}

      {/* Create Product Form */}
      {showCreateForm && (
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '2px dashed #007bff'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🚀 Create New Product
          </h3>
          <form onSubmit={handleCreateProduct}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => updateCreateField('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: createErrors.name ? '2px solid #dc3545' : '2px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="Enter a compelling product name"
                />
                {createErrors.name && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.5rem' }}>
                    {createErrors.name}
                  </small>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  value={createForm.description || ''}
                  onChange={(e) => updateCreateField('description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    minHeight: '100px',
                    resize: 'vertical',
                    fontSize: '1rem'
                  }}
                  placeholder="Describe what your product does and why users would want it..."
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Category
                </label>
                <input
                  type="text"
                  value={createForm.category || ''}
                  onChange={(e) => updateCreateField('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., Mobile App, SaaS, E-commerce, Hardware, etc."
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                ✨ Create Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No products yet</h3>
          <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            Create your first product to start collecting user feedback and validation. 
            Each product gets a unique check link you can share.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            🚀 Create Your First Product
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleStatus={handleToggleProductStatus}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;