'use client';

import React from 'react';
import { FarmProvider } from '@/context/FarmContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <FarmProvider>{children}</FarmProvider>;
};
