
// Added React import to fix "Cannot find namespace 'React'" error
import React from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'chart' | 'card';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export interface Logo {
  name: string;
  src: string;
}
