import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FeatureItem {
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
}

