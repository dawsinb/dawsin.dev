/**
 * Components used for the title section of the app
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { useEffect, useMemo, useRef } from 'react';
import { Mesh, WebGLRenderTarget } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useTransientScroll } from 'hooks/useTransientScroll';
import { BackfaceMaterial } from 'components/sections/title/refractor/BackfaceMaterial';
import { RefractionMaterial } from 'components/sections/title/refractor/RefractionMaterial';
import { loadGeometry } from 'loaders/loadGeometry';
import { useLayout } from 'stores/layout';

/** Props for {@link Refractor} */
interface RefractorProps {
  /** Index of section the {@link Refractor refractor} is in; used to prevent unnecessary computations when off screen */
  index: number;
}
/**
 * Refractor used in {@link Title} to create shifting/splitting effect.
 *
 * *Objects should be placed on layer 1 in order to be affected by the refractor*
 * @param props
 * @category Component
 */
function Refractor({ index }: RefractorProps) {
  // get three constants
  const { size, gl, scene, camera } = useThree();

  const dpr = useLayout((state) => state.dpr);

  // calculate size
  const scale = Math.max(size.width, size.height) / 2;

  // create fbo's and materials
  const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
    const width = size.width * dpr;
    const height = size.height * dpr;

    const envFbo = new WebGLRenderTarget(width, height);
    const backfaceFbo = new WebGLRenderTarget(width, height);

    const backfaceMaterial = new BackfaceMaterial();
    const refractionMaterial = new RefractionMaterial({
      envMap: envFbo.texture,
      backfaceMap: backfaceFbo.texture,
      resolution: [width, height]
    });
    return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial];
  }, [size, dpr]);
  // create ref to model
  const modelRef = useRef<Mesh>();

  // set up transient subscription to the scroll position so we can avoid computations when refractor is not on screen
  const scrollRef = useTransientScroll();

  useFrame(({ clock }) => {
    if (modelRef.current && scrollRef.current < index + 1 && scrollRef.current > index - 1) {
      // rotate model
      modelRef.current.rotateX(0.006);
      modelRef.current.rotateY(0.004);
      modelRef.current.rotateZ(0.005 * Math.sin(clock.getElapsedTime() / 2));

      // render env to fbo
      camera.layers.set(1);
      gl.setRenderTarget(envFbo);
      gl.render(scene, camera);
      // render cube backfaces to fbo
      camera.layers.set(0);
      modelRef.current.material = backfaceMaterial;
      gl.setRenderTarget(backfaceFbo);
      gl.clearDepth();
      gl.render(scene, camera);

      // render env to screen
      camera.layers.set(1);
      gl.setRenderTarget(null);
      gl.render(scene, camera);
      gl.clearDepth();
      // render cube with refraction material to screen
      camera.layers.set(0);
      modelRef.current.material = refractionMaterial;
      gl.render(scene, camera);
    }
  });

  // load model
  useEffect(() => {
    loadGeometry('/assets/models/refractor.drc')
      .then((geometry) => {
        if (modelRef.current) {
          modelRef.current.geometry = geometry;
        }
      })
      .catch((error) => console.error(error));
  });

  return (
    <mesh onUpdate={(self) => self.geometry.center()} scale={scale} ref={modelRef} position={[0, 0, 100]}>
      <meshBasicMaterial />
    </mesh>
  );
}

export { Refractor };
export type { RefractorProps };
