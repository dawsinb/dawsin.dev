import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Test() {
  const boxRef = useRef();

  const texture = useTexture('/assets/images/test.jpg');

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    boxRef.current.rotation.y = time;
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default Test;
