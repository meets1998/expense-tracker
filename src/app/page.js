'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiArrowRight, 
  FiCheck, 
  FiShield, 
  FiZap, 
  FiSmartphone,
  FiPieChart,
  FiLock,
  FiRefreshCw,
  FiCreditCard,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2
} from 'react-icons/fi';
import { 
  FeatureSlider, 
  TestimonialSlider, 
  StatsSlider 
} from '@/components/ui';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

/* Hero Section */
const Hero = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 85vh;
`;

const Badge = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
  
  span {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent-gradient);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.05rem;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.05rem;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-card-hover);
    border-color: var(--accent-primary);
  }
`;

const Features = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-top: 3rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  
  svg {
    color: var(--success);
  }
`;

/* Features Section */
const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: var(--bg-primary);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  
  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
`;

/* CTA Section */
const CTASection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

const CTAText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

/* Footer */
const Footer = styled.footer`
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  border-top: 1px solid var(--border-color);
`;

/* Data */
const featureSliderItems = [
  { icon: FiZap, text: 'Real-time Tracking', color: '#f59e0b' },
  { icon: FiShield, text: 'Secure & Private', color: '#22c55e' },
  { icon: FiSmartphone, text: 'Mobile Friendly', color: '#6366f1' },
  { icon: FiPieChart, text: 'Visual Insights', color: '#ec4899' },
  { icon: FiLock, text: 'Data Protection', color: '#8b5cf6' },
  { icon: FiRefreshCw, text: 'Auto Sync', color: '#06b6d4' },
  { icon: FiCreditCard, text: 'Multiple Banks', color: '#f43f5e' },
  { icon: FiTrendingUp, text: 'Expense Trends', color: '#10b981' },
];

const testimonials = [
  {
    text: "Finally an expense tracker that's actually beautiful to use. I've tried many apps, but this one stands out!",
    name: "Priya Sharma",
    role: "Freelance Designer",
    avatar: "👩‍🎨",
    avatarBg: "#fce7f3",
    rating: 5,
  },
  {
    text: "The category breakdown helps me understand where my money goes. Super intuitive and clean interface.",
    name: "Rahul Verma",
    role: "Software Engineer",
    avatar: "👨‍💻",
    avatarBg: "#dbeafe",
    rating: 5,
  },
  {
    text: "I love how simple it is to add expenses. No complicated forms, just quick entries on the go.",
    name: "Ananya Patel",
    role: "Marketing Manager",
    avatar: "👩‍💼",
    avatarBg: "#d1fae5",
    rating: 5,
  },
  {
    text: "The dark theme is gorgeous and easy on the eyes. Perfect for late-night expense logging.",
    name: "Vikram Singh",
    role: "Entrepreneur",
    avatar: "🧑‍💼",
    avatarBg: "#fef3c7",
    rating: 4,
  },
  {
    text: "Bank-wise tracking is a game changer. I can finally see which account I'm spending from most.",
    name: "Sneha Reddy",
    role: "Financial Analyst",
    avatar: "👩‍💹",
    avatarBg: "#e0e7ff",
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '₹50Cr+', label: 'Expenses Tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User Rating' },
  { value: '50+', label: 'Categories' },
  { value: '24/7', label: 'Support' },
];

const features = [
  {
    icon: FiZap,
    color: '#f59e0b',
    title: 'Instant Tracking',
    description: 'Log expenses in seconds with our streamlined interface. No complex forms, just quick entries.',
  },
  {
    icon: FiPieChart,
    color: '#6366f1',
    title: 'Visual Insights',
    description: 'Beautiful charts and breakdowns help you understand your spending patterns at a glance.',
  },
  {
    icon: FiCreditCard,
    color: '#22c55e',
    title: 'Multi-Bank Support',
    description: 'Track expenses across multiple banks and wallets. See where your money flows.',
  },
  {
    icon: FiSmartphone,
    color: '#ec4899',
    title: 'Mobile First',
    description: 'Designed for mobile devices. Track expenses on the go, anytime, anywhere.',
  },
  {
    icon: FiShield,
    color: '#8b5cf6',
    title: 'Secure & Private',
    description: 'Your financial data stays private. We prioritize security and data protection.',
  },
  {
    icon: FiBarChart2,
    color: '#06b6d4',
    title: 'Smart Reports',
    description: 'Get monthly summaries and insights. Know exactly where your money goes.',
  },
];

export default function HomePage() {
  return (
    <Container>
      {/* Hero Section */}
      <Hero>
        <Badge
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BadgeDot /> Now in Beta — Free Forever
        </Badge>
        
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Track Expenses<br />
          <span>Effortlessly</span>
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Take control of your finances with our beautiful, intuitive expense 
          tracking app. Built for clarity and peace of mind.
        </Subtitle>
        
        <ButtonGroup
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PrimaryButton href="/register">
            Get Started Free <FiArrowRight />
          </PrimaryButton>
          <SecondaryButton href="/login">
            Sign In
          </SecondaryButton>
        </ButtonGroup>
        
        <Features
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Feature>
            <FiCheck /> Free forever
          </Feature>
          <Feature>
            <FiCheck /> No credit card required
          </Feature>
          <Feature>
            <FiCheck /> Setup in 2 minutes
          </Feature>
        </Features>
      </Hero>
      
      {/* Feature Slider */}
      <FeatureSlider 
        items={featureSliderItems} 
        speed={25}
        bgColor="var(--bg-secondary)"
      />
      
      {/* Stats Slider */}
      <StatsSlider stats={stats} speed={40} />
      
      {/* Features Section */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>Why Choose ExpenseWise?</SectionTitle>
          <SectionSubtitle>
            Simple yet powerful features to help you manage your money better
          </SectionSubtitle>
        </SectionHeader>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIcon $color={feature.color}>
                <feature.icon size={26} />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
      
      {/* Testimonials Slider */}
      <TestimonialSlider 
        testimonials={testimonials}
        title="Loved by Thousands"
        subtitle="See what our users have to say about ExpenseWise"
        speed={35}
      />
      
      {/* CTA Section */}
      <CTASection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <CTATitle>Ready to Take Control?</CTATitle>
          <CTAText>
            Join thousands of users who track their expenses with ExpenseWise.
          </CTAText>
          <PrimaryButton href="/register">
            Start Tracking Free <FiArrowRight />
          </PrimaryButton>
        </motion.div>
      </CTASection>
      
      {/* Feature Slider (Reverse) */}
      <FeatureSlider 
        items={featureSliderItems} 
        speed={25}
        reverse
        bgColor="var(--bg-secondary)"
      />
      
      {/* Footer */}
      <Footer>
        © {new Date().getFullYear()} ExpenseWise. Built with ❤️ for better finances.
      </Footer>
    </Container>
  );
}