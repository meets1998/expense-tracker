'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getCategoryById } from '@/constants';

const SectionWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const ScrollButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ScrollButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, var(--bg-primary) 0%, transparent 100%);
    opacity: ${({ $showLeftFade }) => $showLeftFade ? 1 : 0};
    transition: opacity 0.2s ease;
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, var(--bg-primary) 0%, transparent 100%);
    opacity: ${({ $showRightFade }) => $showRightFade ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const CardsTrack = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryCard = styled(motion.div)`
  flex-shrink: 0;
  width: 180px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $color }) => $color};
    box-shadow: 0 8px 25px ${({ $color }) => `${$color}25`};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color }) => $color};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.p`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const Amount = styled.p`
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TransactionCount = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const Percentage = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}15`};
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
`;

const EmptyState = styled.div`
  background: var(--bg-card);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CategoryStats({ expensesByCategory, total }) {
  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  // Convert to array and sort by total (high to low)
  const sortedCategories = Object.entries(expensesByCategory || {})
    .map(([id, data]) => ({
      id,
      ...getCategoryById(id),
      ...data,
    }))
    .sort((a, b) => b.total - a.total);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (sortedCategories.length === 0) {
    return (
      <SectionWrapper>
        <SectionHeader>
          <SectionTitle>Spending by Category</SectionTitle>
        </SectionHeader>
        <EmptyState>
          No category data yet. Add expenses to see breakdown.
        </EmptyState>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>Spending by Category</SectionTitle>
        {sortedCategories.length > 3 && (
          <ScrollButtons>
            <ScrollButton 
              onClick={() => scroll('left')}
              disabled={!showLeftFade}
            >
              <FiChevronLeft size={16} />
            </ScrollButton>
            <ScrollButton 
              onClick={() => scroll('right')}
              disabled={!showRightFade}
            >
              <FiChevronRight size={16} />
            </ScrollButton>
          </ScrollButtons>
        )}
      </SectionHeader>

      <ScrollContainer 
        $showLeftFade={showLeftFade} 
        $showRightFade={showRightFade && sortedCategories.length > 3}
      >
        <CardsTrack 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {sortedCategories.map((category, index) => {
            const Icon = category.icon;
            const percentage = total > 0 ? ((category.total / total) * 100).toFixed(1) : 0;

            return (
              <CategoryCard
                key={category.id}
                $color={category.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CardHeader>
                  <IconWrapper $color={category.color}>
                    <Icon size={20} />
                  </IconWrapper>
                  <CategoryName>{category.name}</CategoryName>
                </CardHeader>
                
                <Amount>{formatCurrency(category.total)}</Amount>
                
                <MetaRow>
                  <TransactionCount>
                    {category.count} transaction{category.count !== 1 ? 's' : ''}
                  </TransactionCount>
                  <Percentage $color={category.color}>
                    {percentage}%
                  </Percentage>
                </MetaRow>
              </CategoryCard>
            );
          })}
        </CardsTrack>
      </ScrollContainer>
    </SectionWrapper>
  );
}