import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { useLayout } from 'Stores/layout';
import { Title, About, Commercial } from 'Components/sections/index';
import { ScrollHandler } from 'Components/scroll/ScrollHandler';

const AppContainer = styled('div')`
  width: 100vw;
  height: 100vh;
`;

const CanvasContainer = styled('div')`
  width: 100%;
  height: 100%;
`;

/**
 * The base app component that is rendered by react.
 *
 * As a single page application this is where all screens should go, alongside any global state handlers such as layout and their respective default params.
 * @category Component
 */
function App() {
  // set layout variables
  useEffect(() => {
    // set margins
    useLayout.setState({ marginX: 0.1, marginY: 0.05 });

    // switch to vertical layout if height > width
    useLayout.setState({ isVertical: window.innerHeight > window.innerWidth });
    window.addEventListener('resize', () => {
      useLayout.setState({ isVertical: window.innerHeight > window.innerWidth });
    });
  }, []);

  const sectionNames = ['', 'about me', 'commercial', 'portfolio', 'research', 'euphony', 'music', ''];

  return (
    <AppContainer>
      <Suspense fallback={null}>
        <CanvasContainer>
          <Canvas linear flat orthographic dpr={[1, 1]} camera={{ position: [0, 0, 10000], far: 20000 }}>
            <Title index={0} parallax={1} />
            <About index={1} parallax={1.5} />
            <Commercial index={2} parallax={1} alternateColor alternatePosition/>
          </Canvas>
        </CanvasContainer>
      </Suspense>

      <ScrollHandler numSections={sectionNames.length} sectionNames={sectionNames} />
    </AppContainer>
  );
}

export { App };
