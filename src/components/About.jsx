import React from 'react';
import { User, Eye } from 'lucide-react';
import { personalInfo } from '../data/portfolioData.js';
import { SectionTechBackground } from './SectionTechBackground.jsx';

export const About = ({ onOpenResume }) => {
  return (
    <section id="about">
      <SectionTechBackground type="about" />
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title section-title-left">
              <span className="section-title-icon-badge" aria-hidden="true">
                <User className="section-title-icon" size={24} strokeWidth={2.2} />
              </span>
              <span className="section-title-text">About Me</span>
            </h2>
            {personalInfo.about.map((paragraph, index) => (
              <h4 key={index}>{paragraph}</h4>
            ))}
            <button
              type="button"
              onClick={onOpenResume}
              className="btn view-resume-btn"
              style={{ marginTop: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
              title="View Resume"
              aria-label="View Resume in preview modal"
            >
              <Eye size={19} strokeWidth={2.2} />
              <span>View Resume</span>
            </button>
          </div>

          <div className="about-image">
            <img
              src={personalInfo.aboutImage}
              alt={personalInfo.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
