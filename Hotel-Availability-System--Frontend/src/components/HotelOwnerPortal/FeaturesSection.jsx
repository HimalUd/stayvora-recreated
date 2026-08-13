import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import { features } from './data';

export default function FeaturesSection() {
  return (
    <section className="hop-features">
      <div className="hop-section-container">
        <SectionHeader
          title="Everything You Need to Succeed"
          subtitle="Powerful tools and features designed specifically for hotel owners"
        />
        <div className="hop-features-grid">
          {features.map(f => (
            <div key={f.title} className="hop-feature-card">
              <div className="hop-feature-icon" style={{ background: f.bg }}><f.icon /></div>
              <h3 className="hop-feature-title">{f.title}</h3>
              <p className="hop-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
