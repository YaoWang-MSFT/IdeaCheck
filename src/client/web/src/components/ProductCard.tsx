import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onToggleStatus: (product: Product) => void;
  onDelete: (productId: string, productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onToggleStatus, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const getCheckLink = () => {
    return `${window.location.origin}/check/${product.checklink}`;
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '1.5rem',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Status Badge */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          backgroundColor: product.status === 'active' ? '#d4edda' : '#f8d7da',
          color: product.status === 'active' ? '#155724' : '#721c24'
        }}>
          {product.status === 'active' ? '✅ Active' : '⚠️ Disabled'}
        </span>
      </div>

      {/* Product Info */}
      <div style={{ marginBottom: '1.5rem', paddingRight: '6rem' }}>
        <h3 style={{ 
          margin: '0 0 0.75rem 0', 
          color: '#333',
          fontSize: '1.25rem',
          fontWeight: 'bold'
        }}>
          {product.name}
        </h3>
        
        <p style={{ 
          color: '#666', 
          margin: '0 0 0.5rem 0',
          fontSize: '0.95rem',
          lineHeight: '1.4'
        }}>
          {product.description || 'No description provided'}
        </p>
        
        {product.category && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{
              padding: '0.2rem 0.6rem',
              background: '#e9ecef',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#495057',
              fontWeight: '500'
            }}>
              📂 {product.category}
            </span>
          </div>
        )}
        
        <div style={{ fontSize: '0.85rem', color: '#888' }}>
          Created: {new Date(product.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Check Link */}
      <div style={{
        padding: '0.75rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '1rem',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ 
          fontSize: '0.8rem', 
          fontWeight: 'bold', 
          marginBottom: '0.25rem',
          color: '#495057'
        }}>
          🔗 Check Link:
        </div>
        <code style={{ 
          fontSize: '0.75rem', 
          color: '#007bff',
          wordBreak: 'break-all',
          display: 'block'
        }}>
          {getCheckLink()}
        </code>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(product);
          }}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: product.status === 'active' ? '#ffc107' : '#28a745',
            color: product.status === 'active' ? '#000' : 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {product.status === 'active' ? '⏸️ Disable' : '▶️ Activate'}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(getCheckLink(), '_blank');
          }}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        >
          👁️ Preview
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id, product.name);
          }}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        >
          🗑️ Delete
        </button>
      </div>

      {/* Click hint */}
      <div style={{
        position: 'absolute',
        bottom: '0.5rem',
        left: '1.5rem',
        fontSize: '0.75rem',
        color: '#999',
        fontStyle: 'italic'
      }}>
        Click card to view details →
      </div>
    </div>
  );
};

export default ProductCard;