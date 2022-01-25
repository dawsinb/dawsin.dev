import { Suspense, useEffect, useRef } from 'react';
import { createRoot, events } from '@react-three/fiber';
import styled from 'styled-components';
import { useLayout } from 'Stores/layout';
import {
  TitleSection,
  AboutSection,
  CommercialSection,
  PortfolioSection,
  ResearchSection,
  EuphonySection,
  MusicSection,
  EndSection
} from 'Components/sections/index';
import { Background } from 'components/background';
import { ScrollHandler } from 'Components/scroll/ScrollHandler';
import { LanguageSvg } from 'components/language/LanguageSvg';
import 'r3f-namespace';
import { useLanguage } from 'stores/language';

/** Container for the application itself */
const AppContainer = styled('div')`
  z-index: 1;
  width: 100vw;
  height: 100vh;
`;

/** Container for the WebGL canvas */
const CanvasRoot = styled('canvas')`
  index: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

/** Container for language selector */
const LanguageContainer = styled('div')`
  position: fixed;
  top: 1.25vh;
  right: 1.25vh;
  width: 3vh;
  height: 3vh;
  cursor: pointer;
`;

/**
 * The base app component that is rendered by react.
 *
 * As a single page application this is where all screens should go, alongside any global state handlers such as layout and their respective default params.
 * @category Component
 */
function App() {
  // set margins
  useLayout.setState({ marginX: 0.1, marginY: 0.05 });

  // names of sections to use for overlay (also used to determine total number of sections)
  const sectionNames = ['', 'about me', 'commercial', 'portfolio', 'research', 'euphony', 'music', ''];
  // japanese translations of section names
  const sectionNamesJp = [
    '',
    '私について',
    '商業作品',
    'ポートフォリオ',
    'リサーチ',
    'ユーフォニー',
    'ミュージック',
    ''
  ];

  // create ref to root element of the canvas so we can create a R3F render tree from it
  const canvasRootRef = useRef<HTMLCanvasElement>(null);

  // add resize event listener
  useEffect(() => {
    window.addEventListener('resize', () => {
      // determine if vertical layout
      useLayout.setState({ isVertical: window.innerHeight > window.innerWidth });

      // create r3f canvas
      if (canvasRootRef.current) {
        createRoot(canvasRootRef.current, {
          orthographic: true,
          camera: { position: [0, 0, 10000], far: 20000 },
          gl: { antialias: true },
          dpr: [1, 1],
          linear: true,
          flat: true,
          events
        }).render(
          <group>
            <TitleSection index={0} parallax={1} />
            <AboutSection index={1} parallax={1.5} />
            <CommercialSection index={2} parallax={1} alternateColor alternatePosition />
            <PortfolioSection index={3} parallax={1.5} />
            <ResearchSection index={4} parallax={1} />
            <EuphonySection index={5} parallax={1.5} alternateColor alternatePosition />
            <MusicSection index={6} parallax={1} />
            <EndSection index={7} parallax={1} />
            <Background numSections={sectionNames.length} />
          </group>
        );
      }
    });

    // fire resize event for initial sizing
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <>
      <AppContainer>
        <Suspense fallback={null}>
          <CanvasRoot ref={canvasRootRef} />
        </Suspense>
      </AppContainer>

      <ScrollHandler numSections={sectionNames.length} sectionNames={sectionNames} sectionNamesJp={sectionNamesJp} />
      <LanguageContainer onClick={() => useLanguage.setState({ isJapanese: !useLanguage.getState().isJapanese })}>
        <LanguageSvg color="white" />
      </LanguageContainer>
    </>
  );
}

export { App };
