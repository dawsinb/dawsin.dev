/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import { useContext } from 'react';
import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';
import { useLanguage } from 'stores/language';
import { ScrollOverlayContext } from './ScrollOverlay';

/** Props for {@link BackgroundHandler} */
interface BackgroundHandlerProps {
  $isVertical: boolean;
  $expansionFactor: number;
  style: CssProperties & {
    '--expansion': AnimatedValue<number>;
    '--opacity': AnimatedValue<number>;
  };
}
/** Style handler for {@link Background} */
const BackgroundHandler = styled(animated.div)<BackgroundHandlerProps>`
  position: absolute;
  // position right if horizontal, bottom if vertical
  bottom: ${({ $isVertical }) => ($isVertical ? 0 : 'auto')};
  right: ${({ $isVertical }) => ($isVertical ? 'auto' : 0)};
  // handle size expansion; expand width if horizonal, height if vertical
  width: ${({ $isVertical, $expansionFactor }) =>
    $isVertical ? '100%' : `calc(100% + var(--expansion) * 100% * ${$expansionFactor})`};
  height: ${({ $isVertical, $expansionFactor }) =>
    $isVertical ? `calc(100% + var(--expansion) * 100% * ${$expansionFactor})` : '100%'};
  // handle opacity fade in/out
  opacity: var(--opacity);
  // set color to semi-transparent black with a blur effect
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

/** Props for {@link Background} */
interface BackgroundProps {
  /** Maximum length of a title; used to determine how much the background should expand */
  maxTitleLength: number;
  /** Toggle to handle the background expand & fade animation */
  toggle: SpringValue<number>;
}
/**
 * Animated background of {@link ScrollOverlay}. Becomes visible and expands on mouse over / touch
 * @param props
 * @category Component
 */
function Background({ maxTitleLength, toggle }: BackgroundProps) {
  // switch to vertical layout if screen size is vertical
  const { isVertical } = useContext(ScrollOverlayContext);
  // alter size if japanese text is used
  const isJapanese = useLanguage((state) => state.isJapanese);

  // multiply expansion by constant factor depending on layout to get proper size
  const expansionFactor = isVertical ? 0.3 : 0.2;
  const expansionFactorJp = 0.25;

  return (
    <BackgroundHandler
      $isVertical={isVertical}
      $expansionFactor={isJapanese ? expansionFactorJp : expansionFactor}
      style={{
        '--expansion': toggle.to({ output: [0, maxTitleLength] }),
        '--opacity': toggle.to({ output: [0, 1] })
      }}
    />
  );
}

export { Background };
export type { BackgroundProps };
