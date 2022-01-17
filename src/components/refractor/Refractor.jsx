import { useMemo, useRef } from 'react';
import { WebGLRenderTarget } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import BackfaceMaterial from 'Components/refractor/shaders/BackfaceMaterial';
import RefractionMaterial from 'Components/refractor/shaders/RefractionMaterial';

function Refractor() {
  // get three constants
  const { size, gl, scene, camera } = useThree();

  // load model
  const { nodes } = useGLTF('/assets/models/refractor.glb');

  const model = useRef();
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

  useFrame(({ clock }) => {
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
  }, 1);

  const center = (self) => self.geometry.center();

  return (
    <mesh onUpdate={center} ref={model} geometry={nodes.refractor.geometry} position={[0, 0, 100]} scale={scale}>
      <meshBasicMaterial />
    </mesh>
  );
}

export default Refractor;
