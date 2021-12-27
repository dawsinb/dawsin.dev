import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import useStore from 'Utils/store';
import ScrollHandler from 'Components/scroll/ScrollHandler';
import Test from 'Components/Test';

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
    window.addEventListener('resize', () => {
      useStore.setState({ isVertical: window.innerHeight > window.innerWidth });
    });
  }, []);

  return (
    <AppContainer>
      <Suspense fallback={null}>
        <CanvasContainer>
          <Canvas linear dpr={[2, 2]} camera={{ position: [0, 0, 100], far: 200 }}>
            <Test />
          </Canvas>
        </CanvasContainer>
      </Suspense>

      <ScrollHandler />
    </AppContainer>
  );
}

export default App;
