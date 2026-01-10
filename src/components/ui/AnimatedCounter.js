'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import styled from 'styled-components';

const CounterSpan = styled(motion.span)`
  display: inline-block;
  font-variant-numeric: tabular-nums;
`;

export default function AnimatedCounter({ 
  value, 
  duration = 1, 
  formatValue = (v) => Math.round(v).toLocaleString('en-IN'),
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  const spring = useSpring(prevValue.current, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  useEffect(() => {
    spring.set(value);
    prevValue.current = value;
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [spring]);

  return (
    <CounterSpan>
      {formatValue(displayValue)}
    </CounterSpan>
  );
}