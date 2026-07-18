import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgScanCube = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M8.504 9.426l3 -1.714a1 1 0 0 1 .992 0l3 1.714a1 1 0 0 1 .504 .868v3.411a1 1 0 0 1 -.504 .868l-3 1.715a1 1 0 0 1 -.992 0l-3 -1.715a1 1 0 0 1 -.504 -.868v-3.41a1 1 0 0 1 .504 -.869" />
    <Path d="M15.75 9.964l-3.75 2.036" />
    <Path d="M12 12l-3.75 -2.036" />
    <Path d="M12 12v4.071" />
    <Path d="M3 7v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M3 17v2a2 2 0 0 0 2 2h2" />
    <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <Path d="M17 21h2a2 2 0 0 0 2 -2v-2" />
  </Svg>
);
export default SvgScanCube;
