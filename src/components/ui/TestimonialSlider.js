'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Marquee from './Marquee';

const SliderSection = styled.section`
  padding: 3rem 0;
  background: var(--bg-primary);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const TestimonialCard = styled(motion.div)`
  flex-shrink: 0;
  width: 320px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin: 0 0.75rem;
  
  @media (max-width: 640px) {
    width: 280px;
    padding: 1.25rem;
  }
`;

const QuoteIcon = styled.div`
  font-size: 2rem;
  color: var(--accent-primary);
  opacity: 0.5;
  margin-bottom: 0.75rem;
`;

const TestimonialText = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $bgColor }) => $bgColor || 'var(--bg-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
`;

const AuthorRole = styled.p`
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.125rem;
  margin-bottom: 0.75rem;
`;

const Star = styled.span`
  color: ${({ $filled }) => $filled ? '#f59e0b' : 'var(--border-color)'};
  font-size: 0.875rem;
`;

export default function TestimonialSlider({ 
  testimonials = [],
  title = "What Users Say",
  subtitle = "Join thousands of satisfied users",
  speed = 35,
}) {
  return (
    <SliderSection>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <SectionSubtitle>{subtitle}</SectionSubtitle>
      </SectionHeader>
      
      <Marquee speed={speed} noFade pauseOnHover>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} $filled={star <= testimonial.rating}>
                  ★
                </Star>
              ))}
            </StarRating>
            
            <TestimonialText>
              {`"${testimonial.text}"`}
            </TestimonialText>
            
            <TestimonialAuthor>
              <AuthorAvatar $bgColor={testimonial.avatarBg}>
                {testimonial.avatar}
              </AuthorAvatar>
              <AuthorInfo>
                <AuthorName>{testimonial.name}</AuthorName>
                <AuthorRole>{testimonial.role}</AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        ))}
      </Marquee>
    </SliderSection>
  );
}