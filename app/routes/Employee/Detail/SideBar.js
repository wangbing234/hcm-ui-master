import React from 'react';

export default function SideBar({ children }) {
  return (
    <div style={{ width: 400, overflow: 'auto', backgroundColor: '#f3f3f3', padding: 20 }}>
      {children}
    </div>
  );
}
