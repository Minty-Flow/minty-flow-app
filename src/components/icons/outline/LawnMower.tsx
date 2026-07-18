import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgLawnMower = (props: SvgProps) => (
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
    <Path d="M6 11h5.38a1 1 0 0 1 .9 .55l.72 1.45h5a1 1 0 0 1 1 1v2" />
    <Path d="M3 4h1.13a1 1 0 0 1 1 .86l1.59 11.14" />
    <Path d="M17 18h-8" />
    <Path d="M9 18a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M21 18a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  </Svg>
);
export default SvgLawnMower;
