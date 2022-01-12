import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import useStore from 'Utils/store';
import Test from 'Components/Test';
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
    useStore.setState({ isVertical: window.innerHeight > window.innerWidth });
    window.addEventListener('resize', () => {
      useStore.setState({ isVertical: window.innerHeight > window.innerWidth });
    });
  }, []);

  const sectionNames = ['', 'about me', 'commercial', 'portfolio', 'research', 'euphony', 'music', ''];

  return (
    <AppContainer>
      <Suspense fallback={null}>
        <CanvasContainer>
          <Canvas linear dpr={[2, 2]} camera={{ position: [0, 0, 100], far: 200 }}>
            <Test />
          </Canvas>
        </CanvasContainer>
      </Suspense>

      <ScrollHandler numSections={sectionNames.length} sectionNames={sectionNames} />
    </AppContainer>
  );
}

export default App;
