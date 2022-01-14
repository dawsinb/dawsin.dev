import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import useLayout from 'Utils/stores/layout';
import Title from 'Components/sections/screens/Title';
import ScrollHandler from 'Components/scroll/ScrollHandler';

const AppContainer = styled('div')`
  width: 100vw;
  height: 100vh;
`;

const CanvasContainer = styled('div')`
  width: 100%;
  height: 100%;
`;

function App() {
  // switch to vertical layout if height > width
  useEffect(() => {
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
          </Canvas>
        </CanvasContainer>
      </Suspense>

      <ScrollHandler numSections={sectionNames.length} sectionNames={sectionNames} />
    </AppContainer>
  );
}

export default App;