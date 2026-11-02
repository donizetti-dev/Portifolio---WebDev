import React from 'react';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum item encontrado',
  description = 'Não há registros disponíveis para exibição no momento.',
  icon,
  action,
}) => {
  return (
    <div className={styles.container} role="status">
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon ?? <Inbox size={22} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
