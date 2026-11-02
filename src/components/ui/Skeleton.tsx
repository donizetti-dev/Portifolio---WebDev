import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  style,
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className={styles.cardSkeleton} role="status" aria-label="Carregando projeto...">
      <div className={styles.headerRow}>
        <Skeleton width="55%" height="1.4rem" />
        <Skeleton width="4.5rem" height="1.25rem" borderRadius="9999px" />
      </div>
      <Skeleton width="100%" height="0.95rem" />
      <Skeleton width="85%" height="0.95rem" />
      <Skeleton width="65%" height="0.95rem" />
      <div className={styles.tagsRow}>
        <Skeleton width="4rem" height="1.4rem" borderRadius="9999px" />
        <Skeleton width="5rem" height="1.4rem" borderRadius="9999px" />
        <Skeleton width="3.5rem" height="1.4rem" borderRadius="9999px" />
      </div>
    </div>
  );
};
