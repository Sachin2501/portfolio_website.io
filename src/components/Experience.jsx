import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { experiences } from '../data/portfolioData.js';
import { SectionTechBackground } from './SectionTechBackground.jsx';

export const Experience = ({ onSelectCertificate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const groups = [
    { key: 'ai', label: 'AI & Machine Learning Internships' },
    { key: 'web', label: 'Web & Full Stack Internships' },
  ];

  const filterTabs = [
    { key: 'all', label: `All (${experiences.length})` },
    { key: 'ai', label: 'AI & ML' },
    { key: 'web', label: 'Web & Full Stack' },
  ];

  const filteredGroups =
    selectedFilter === 'all'
      ? groups
      : groups.filter((g) => g.key === selectedFilter);

  return (
    <section id="experience">
      <SectionTechBackground type="experience" />
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">
            <span className="section-title-icon-badge" aria-hidden="true">
              <Briefcase className="section-title-icon" size={24} strokeWidth={2.2} />
            </span>
            <span className="section-title-text">Work Experience & Internships</span>
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="cert-filter-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`cert-filter-btn ${selectedFilter === tab.key ? 'active' : ''}`}
              onClick={() => setSelectedFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="certifications-container">
          {filteredGroups.map((group) => {
            const groupExp = experiences.filter(
              (e) => e.category === group.key
            );
            if (groupExp.length === 0) return null;

            return (
              <div key={group.key} className="cert-group-section">
                <div className="group-label">
                  <i
                    className={`fas ${group.key === 'ai' ? 'fa-brain' : 'fa-laptop-code'}`}
                    style={{ marginRight: '8px' }}
                  ></i>
                  {group.label}
                </div>

                <div className="experience-card-grid">
                  {groupExp.map((exp) => (
                    <div key={exp.id} className="experience-card-item">
                      <div className="experience-card-top">
                        <div className="experience-card-header">
                          <h3>{exp.role}</h3>
                          <div className="experience-company-row">
                            <i className="fas fa-building" style={{ color: '#3b82f6' }}></i>
                            <span className="issuer">{exp.company}</span>
                          </div>
                        </div>
                        <span className="date">{exp.duration}</span>
                      </div>

                      <ul className="experience-details" style={{ margin: '1rem 0', paddingLeft: '1.2rem' }}>
                        {exp.details.map((detail, idx) => (
                          <li key={idx} style={{ marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                            {detail}
                          </li>
                        ))}
                      </ul>

                      <div className="tech-used" style={{ marginTop: 'auto', marginBottom: '1.2rem' }}>
                        {exp.tech.map((tag) => (
                          <span key={tag} className="tech-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {exp.certificate && onSelectCertificate && (
                        <div className="experience-card-action" style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            type="button"
                            className="certificate-view"
                            onClick={() => onSelectCertificate(exp.certificate)}
                            title={`View certificate for ${exp.role}`}
                          >
                            <i className="fas fa-certificate"></i> View Certificate
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
