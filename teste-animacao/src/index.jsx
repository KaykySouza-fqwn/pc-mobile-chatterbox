import React, {useLayoutEffect, useMemo} from 'react';
import {Billboard} from './sprite';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Composition, Easing, interpolate, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';

const buildings = [
  [-3.5, -0.6, 2.0, 3.8, '#29495a'],
  [3.5, -1.6, 2.1, 4.3, '#37566a'],
  [-3.0, -5.2, 2.4, 4.8, '#405d6b'],
  [3.0, -5.6, 2.3, 3.6, '#314857'],
  [-2.3, -9.5, 2.7, 5.4, '#375563'],
  [1.4, -10.5, 2.8, 4.9, '#3c5263'],
];

function House({x, z, width, height, color}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 2.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, height + 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[width * 0.86, 1.25, 4]} />
        <meshStandardMaterial color="#202d42" />
      </mesh>
      {[0.42, 0.72].map((level) => (
        <group key={level} position={[0, height * level, 1.32]}>
          {[-0.48, 0.48].map((offset) => (
            <group key={offset} position={[offset, 0, 0]}>
              <mesh>
                <planeGeometry args={[0.51, 0.72]} />
                <meshBasicMaterial color="#142a3a" />
              </mesh>
              {[-0.11, 0.11].map((pane) => (
                <mesh key={pane} position={[pane, 0, 0.01]}>
                  <planeGeometry args={[0.18, 0.57]} />
                  <meshBasicMaterial color={level > 0.5 ? '#e9a564' : '#547080'} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function Plaza() {
  const pavers = useMemo(() => Array.from({length: 80}, (_, index) => {
    const row = Math.floor(index / 5);
    const column = index % 5;
    return [column * 0.91 - 1.82 + (row % 2) * 0.23, 3.7 - row * 0.75];
  }), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -4]}>
        <planeGeometry args={[40, 36]} />
        <meshStandardMaterial color="#253a49" />
      </mesh>
      {pavers.map(([x, z], index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.02, z]}>
          <planeGeometry args={[0.88, 0.72]} />
          <meshStandardMaterial color={['#455766', '#485c67', '#4d5f69'][index % 3]} />
        </mesh>
      ))}
      {buildings.map(([x, z, width, height, color]) => (
        <House key={z} {...{x, z, width, height, color}} />
      ))}
      <mesh position={[0, 4.9, -17]}>
        <circleGeometry args={[0.88, 32]} />
        <meshBasicMaterial color="#e7d9ac" fog={false} />
      </mesh>
    </>
  );
}

function Lantern({lift, time}) {
  const x = 0.12 + lift * 0.24 + Math.sin(time * 2.6) * lift * 0.1;
  const y = 0.38 + lift * 2.28;
  return (
    <group position={[x, y, -0.45]} rotation={[0, time * 0.6, lift * 0.13]}>
      <pointLight color="#ff993f" intensity={11 + lift * 7} distance={7} decay={2} />
      <mesh>
        <sphereGeometry args={[0.21, 16, 12]} />
        <meshBasicMaterial color="#ffbf60" />
      </mesh>
      {[-0.15, 0.15].map((height) => (
        <mesh key={height} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.02, 6, 18]} />
          <meshBasicMaterial color="#783e38" />
        </mesh>
      ))}
      {Array.from({length: 8}, (_, i) => {
        const phase = (time * 0.75 + i / 8) % 1;
        const angle = i * 2.4 + time;
        const radius = phase * 0.9;
        return (
          <mesh key={i} scale={lift * (1 - phase)} position={[
            Math.cos(angle) * radius, phase * 1.3, Math.sin(angle) * radius,
          ]}>
            <sphereGeometry args={[0.055, 6, 5]} />
            <meshBasicMaterial color="#ffe4a5" />
          </mesh>
        );
      })}
    </group>
  );
}

function Camera({progress, lift}) {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.position.set(0.65 - progress * 1.05, 1.95 + lift * 0.26, 6.8 - progress * 0.8);
    camera.lookAt(0, 1.35 + lift * 0.37, -0.5);
    camera.updateMatrixWorld();
  }, [camera, progress, lift]);
  return null;
}

const smooth = (frame, start, end) => interpolate(frame, [start, end], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
});

function Encontro() {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const time = frame / fps;
  const approach = smooth(frame, 0, 90);
  const lift = smooth(frame, 105, 227);
  const progress = smooth(frame, 0, 239);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{fov: 38}}>
        <color attach="background" args={['#536a83']} />
        <fog attach="fog" args={['#536a83', 7.5, 23]} />
        <hemisphereLight args={['#c1dbff', '#8e5950', 1.35]} />
        <directionalLight position={[-4, 8, 5]} color="#f7c8a1" intensity={1.4} />
        <Camera {...{progress, lift}} />
        <Plaza />
        <Billboard x={-1.7 + 0.97 * approach} time={time} walking={frame < 90}
          wonder={lift} coat="#c8663f" hat="#eeac56" skin="#edac7b" />
        <Billboard x={1.62 - 0.82 * approach} time={time + 0.12} walking={frame < 90}
          wonder={lift} coat="#3d9c8d" hat="#74b6a0" skin="#b97454" mirror />
        <Lantern {...{lift, time}} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 44%, #10192c66 100%)'}} />
    </AbsoluteFill>
  );
}

function Root() {
  return <Composition id="Encontro" component={Encontro} width={720} height={1280} fps={24} durationInFrames={240} />;
}

registerRoot(Root);
