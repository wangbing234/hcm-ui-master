import React from 'react';

export default function Content({ children }) {
  return <div style={{ width: 640, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>{children}</div>;
}
