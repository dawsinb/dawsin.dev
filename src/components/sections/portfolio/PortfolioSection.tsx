/**
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { useEffect, useRef } from 'react';
import { Group, Mesh, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useThree, useFrame } from '@react-three/fiber';
import { loadFont } from 'loaders/loadFont';
import { useTheme } from 'Stores/theme';
import { lerp } from 'Utils/math';
import { Section, SectionItem } from 'Components/sections/Section';
import { Refractor } from 'Components/sections/title/refractor/Refractor';
import { loadGeometry } from 'loaders/loadGeometry';

/** Props for {@link PortfolioSection} */
interface PortfolioProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * Title screen of the app. Contains the title text alongside a {@link Refractor refractor} to apply a shifting effect
 * @param props
 * @returns
 */
function PortfolioSection({ index, parallax }: PortfolioProps) {
  // calculate base width and height
  const { size } = useThree();

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  // calculate Positions and sizes
  const titleX = 0;
  const titleY = 0;
  const titlePosition = new Vector3(titleX, titleY, 1);

  const phoneFrameRef = useRef<Mesh>();
  const phoneScreenRef = useRef<Mesh>();
  const phoneBezelRef = useRef<Mesh>();
  const phoneCameraRef = useRef<Mesh>();

  // load model
  useEffect(() => {
    loadGeometry('/assets/models/phone/phone_frame.drc')
      .then((geometry) => {
        if (phoneFrameRef.current) {
          phoneFrameRef.current.geometry = geometry;
        }
      })
      .catch((error) => console.error(error));
    loadGeometry('/assets/models/phone/phone_screen.drc')
      .then((geometry) => {
        if (phoneScreenRef.current) {
          phoneScreenRef.current.geometry = geometry;
        }
      })
      .catch((error) => console.error(error));
    loadGeometry('/assets/models/phone/phone_bezel.drc')
      .then((geometry) => {
        if (phoneBezelRef.current) {
          phoneBezelRef.current.geometry = geometry;
        }
      })
      .catch((error) => console.error(error));
    loadGeometry('/assets/models/phone/phone_camera.drc')
      .then((geometry) => {
        if (phoneCameraRef.current) {
          phoneCameraRef.current.geometry = geometry;
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem parallax={2}>
        <group scale={size.width * 2}>
          <mesh ref={phoneFrameRef}>
            <meshBasicMaterial color={'#ff0000'} />
          </mesh>
          <mesh ref={phoneScreenRef}>
            <meshBasicMaterial color={'#ffffff'} />
          </mesh>
          <mesh ref={phoneBezelRef}>
            <meshBasicMaterial color={'#000000'} />
          </mesh>
          <mesh ref={phoneCameraRef}>
            <meshBasicMaterial color={'#0000ff'} />
          </mesh>
        </group>
      </SectionItem>
    </Section>
  );
}

export { PortfolioSection };
export type { PortfolioProps };
