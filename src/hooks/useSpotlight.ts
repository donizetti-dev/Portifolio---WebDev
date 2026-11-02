import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';

export interface UseSpotlightOptions {
  /**
   * Ângulo máximo de rotação nos eixos X e Y (em graus).
   * @default 4.5
   */
  maxTilt?: number;
  /**
   * Ativa ou desativa o efeito de Tilt 3D sutil.
   * @default true
   */
  enableTilt?: boolean;
}

export interface UseSpotlightReturn<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T>;
  isEnabled: boolean;
  isHovered: boolean;
  handlers: {
    onMouseMove: (event: React.MouseEvent<T>) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

/**
 * Hook que gerencia o efeito Spotlight radial (acompanhando o cursor)
 * e Tilt 3D sutil via variáveis CSS (`--spotlight-x`, `--spotlight-y`, `--tilt-x`, `--tilt-y`).
 *
 * Desativa automaticamente em dispositivos touch (`pointer: coarse`) ou quando
 * a preferência de acessibilidade `prefers-reduced-motion: reduce` está ativa (RNF03 / RNF04).
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>(
  options: UseSpotlightOptions = {}
): UseSpotlightReturn<T> {
  const { maxTilt = 4.5, enableTilt = true } = options;
  const ref = useRef<T>(null);
  const frameRef = useRef<number | null>(null);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const fineHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const evaluateSupport = () => {
      const canRunEffect =
        !reducedMotionQuery.matches && !coarsePointerQuery.matches && fineHoverQuery.matches;
      setIsEnabled(canRunEffect);

      if (!canRunEffect && ref.current) {
        ref.current.style.setProperty('--spotlight-opacity', '0');
        ref.current.style.setProperty('--tilt-x', '0deg');
        ref.current.style.setProperty('--tilt-y', '0deg');
      }
    };

    evaluateSupport();

    reducedMotionQuery.addEventListener('change', evaluateSupport);
    coarsePointerQuery.addEventListener('change', evaluateSupport);
    fineHoverQuery.addEventListener('change', evaluateSupport);

    return () => {
      reducedMotionQuery.removeEventListener('change', evaluateSupport);
      coarsePointerQuery.removeEventListener('change', evaluateSupport);
      fineHoverQuery.removeEventListener('change', evaluateSupport);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<T>) => {
      if (!isEnabled || !ref.current) {
        return;
      }

      const element = ref.current;
      const clientX = event.clientX;
      const clientY = event.clientY;

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        element.style.setProperty('--spotlight-x', `${x.toFixed(1)}px`);
        element.style.setProperty('--spotlight-y', `${y.toFixed(1)}px`);
        element.style.setProperty('--spotlight-opacity', '1');

        if (enableTilt) {
          const normalizedX = (x / rect.width - 0.5) * 2; // -1 a 1
          const normalizedY = (y / rect.height - 0.5) * 2; // -1 a 1

          const rotateX = (-normalizedY * maxTilt).toFixed(2);
          const rotateY = (normalizedX * maxTilt).toFixed(2);

          element.style.setProperty('--tilt-x', `${rotateX}deg`);
          element.style.setProperty('--tilt-y', `${rotateY}deg`);
        }
      });
    },
    [isEnabled, enableTilt, maxTilt]
  );

  const onMouseEnter = useCallback(() => {
    if (!isEnabled || !ref.current) {
      return;
    }
    setIsHovered(true);
    ref.current.style.setProperty('--spotlight-opacity', '1');
  }, [isEnabled]);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!ref.current) {
      return;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    ref.current.style.setProperty('--spotlight-opacity', '0');
    ref.current.style.setProperty('--tilt-x', '0deg');
    ref.current.style.setProperty('--tilt-y', '0deg');
  }, []);

  return {
    ref,
    isEnabled,
    isHovered,
    handlers: {
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    },
  };
}

export default useSpotlight;
