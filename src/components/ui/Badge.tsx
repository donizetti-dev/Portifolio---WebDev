import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'electric' | 'outline' | 'success' | 'warning';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...rest
}) => {
  const classes = [styles.badge, variant !== 'default' ? styles[variant] : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};
