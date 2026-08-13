import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="section-header-title">{title}</h2>
      <p className="section-header-subtitle">{subtitle}</p>
    </>
  );
}
