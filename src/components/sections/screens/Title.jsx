import { useEffect, useRef } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useThree, useFrame } from '@react-three/fiber';
import useStore from 'Utils/hooks/useStore';
import { Section, SectionItem } from 'Components/sections/Section';
import Refractor from 'Components/refractor/Refractor';
import useFont from 'Utils/hooks/useFont';

function Title({ index, parallax }) {
  // calculate base width and height
  const { size } = useThree();

  // get colors
  const primary = useStore((state) => state.primaryColor);
  const secondary = useStore((state) => state.secondaryColor);

  // calculate Positions and sizes
  const titleX = 0;
  const titleY = 0;
  const titlePosition = [titleX, titleY, 1];
  const fontSize = size.width / 10;

  // create refs for text geometries
  const textGroupRef = useRef();
  const dawsinTextRef = useRef();
  const devTextRef = useRef();

  // load font and create text geometries
  useEffect(() => {
    useFont('/assets/fonts/BorisBlackBloxxDirty.json', (font) => {
      // create text geometries
      const config = { font: font, size: fontSize, height: 25 };
      dawsinTextRef.current.geometry = new TextGeometry('dawsin', config);
      devTextRef.current.geometry = new TextGeometry('.dev', config);

      // center texts together
      dawsinTextRef.current.geometry.computeBoundingBox();
      textGroupRef.current.position.x =
        dawsinTextRef.current.geometry.boundingBox.min.x - dawsinTextRef.current.geometry.boundingBox.max.x / 2;
    });
  }, []);

  // rotate text to look at mouse position
  useFrame(({ mouse }) => {
    textGroupRef.current.lookAt(mouse.x * size.width, mouse.y * size.height, 4000);
  });

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem parallax={2}>
        <group position={titlePosition}>
          <group ref={textGroupRef}>
            <mesh ref={dawsinTextRef} layers={1}>
              <meshBasicMaterial color={primary} />
            </mesh>

            <mesh ref={devTextRef} layers={1} position={[0, -fontSize / 1.5, 0.1]}>
              <meshBasicMaterial color={secondary} />
            </mesh>
          </group>
        </group>
      </SectionItem>

      <SectionItem parallax={4}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -1000]}>
          <planeGeometry args={[size.width * 3, size.height * 2, 32, 32]} />
          <meshBasicMaterial color={'#000'} />
        </mesh>
      </SectionItem>

      <SectionItem parallax={20}>
        <Refractor />
      </SectionItem>
    </Section>
  );
}

export default Title;
