import { MutableRefObject, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot, events, ReconcilerRoot } from '@react-three/fiber';
import { PerformanceMonitor, Stats } from '@react-three/drei';
import styled from 'styled-components';
import { useLayout } from 'stores/layout';
import { useLanguage } from 'stores/language';
import {
  TitleSection,
  AboutSection,
  CommercialSection,
  PortfolioSection,
  ResearchSection,
  EuphonySection,
  MusicSection,
  EndSection
} from 'components/sections/index';
import { Background } from 'components/Background';
import { ScrollHandler } from 'components/scroll/ScrollHandler';
import { LanguageSvg } from 'components/language/LanguageSvg';
import './r3f-namespace';

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
  // detect language
  if (/^ja\b/.test(navigator.language)) {
    useLanguage.setState({ isJapanese: true });
  }

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
  const canvasHTMLRootRef = useRef<HTMLCanvasElement>(null);
  const canvasRootRef = useRef(null) as MutableRefObject<ReconcilerRoot<HTMLCanvasElement> | null>;

  // dynamically adjust DPR using performance monitor
  const [dpr, setDpr] = useState(2);

  // renders the R3F canvas content
  const render = () => {
    // create r3f canvas
    if (canvasHTMLRootRef.current) {
      if (!canvasRootRef.current) {
        canvasRootRef.current = createRoot(canvasHTMLRootRef.current);
      }

      canvasRootRef.current.configure({
        orthographic: true,
        camera: { position: [0, 0, 10000], far: 20000 },
        gl: { antialias: true },
        dpr: dpr,
        linear: true,
        flat: true,
        legacy: true,
        events
      });

      canvasRootRef.current.render(
        <PerformanceMonitor
          bounds={(deviceFrameRate) => [50, Math.min(deviceFrameRate, 144)]}
          factor={1}
          onChange={({ factor }) => {
            setDpr(Math.round((0.5 + 1.5 * factor) * 10) / 10);
          }}
        >
          <Stats showPanel={0} />
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
        </PerformanceMonitor>
      );
    }
  };

  // rerender the application when the dpr changes
  useEffect(() => render(), [dpr]);

  // add resize event listener
  useEffect(() => {
    window.addEventListener('resize', () => {
      // determine if vertical layout
      useLayout.setState({ isVertical: window.innerHeight > window.innerWidth });

      // rerender the app to reflect changes
      render();
    });

    // fire resize event for initial sizing
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <>
      <AppContainer>
        <Suspense fallback={null}>
          <CanvasRoot ref={canvasHTMLRootRef} />
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
