import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Falha ao carregar dados',
  message = 'Ops, tivemos um problema para carregar alguns dados, nossos devs já estão trabalhando nisso!',
  onRetry,
  retryLabel = 'Tentar novamente',
}) => {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.iconWrapper} aria-hidden="true">
        <AlertTriangle size={22} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw size={15} />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
