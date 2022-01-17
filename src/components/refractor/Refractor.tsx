/**
 * @module Components/Title
 * @mergeTarget
 */

import { useMemo, useRef } from 'react';
import { Mesh, WebGLRenderTarget } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { BackfaceMaterial } from 'Components/refractor/shaders/BackfaceMaterial';
import { RefractionMaterial } from 'Components/refractor/shaders/RefractionMaterial';
import { useTransientScroll } from 'utils/hooks/useTransientScroll';

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

  // load model
  const { nodes } = useGLTF('/assets/models/refractor.glb') as GLTF;

  // calculate size
  const scale = Math.max(size.width, size.height) / 2;

  // create fbo's and materials
  const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
    const envFbo = new WebGLRenderTarget(size.width, size.height);
    const backfaceFbo = new WebGLRenderTarget(size.width, size.height);
    const backfaceMaterial = new BackfaceMaterial();
    const refractionMaterial = new RefractionMaterial({
      envMap: envFbo.texture,
      backfaceMap: backfaceFbo.texture,
      resolution: [size.width, size.height]
    });
    return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial];
  }, [size]);
  // create ref to model
  const model = useRef<Mesh>();

  // set up transient subscription to the scroll position so we can avoid computations when refractor is not on screen
  const scrollRef = useTransientScroll();

  useFrame(({ clock }) => {
    if (model.current && scrollRef.current < index + 1 && scrollRef.current > index - 1) {
      // rotate model
      model.current.rotateX(0.006);
      model.current.rotateY(0.004);
      model.current.rotateZ(0.005 * Math.sin(clock.getElapsedTime() / 2));

      // render env to fbo
      camera.layers.set(1);
      gl.setRenderTarget(envFbo);
      gl.render(scene, camera);
      // render cube backfaces to fbo
      camera.layers.set(0);
      model.current.material = backfaceMaterial;
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
      model.current.material = refractionMaterial;
      gl.render(scene, camera);
    }
  });

  return (
    <mesh
      onUpdate={(self) => self.geometry.center()}
      ref={model}
      geometry={nodes.refractor.geometry}
      position={[0, 0, 100]}
      scale={scale}
    >
      <meshBasicMaterial />
    </mesh>
  );
}

export { Refractor };
export type { RefractorProps };
