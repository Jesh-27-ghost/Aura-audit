import React from 'react';

const GradientButton = ({ children, onClick, icon: Icon, style }) => {
  return (
    <button className="gradient-btn" onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', ...style }}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default GradientButton;
