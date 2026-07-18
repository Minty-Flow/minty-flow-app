import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgEarphoneBluetooth = (props: SvgProps) => (
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
    <Path d="M6.57 12.77a6.9 6.9 0 0 1 -.57 -2.77a7 7 0 0 1 14 0" />
    <Path d="M9 16l-1 1" />
    <Path d="M10.83 19.83l6.36 -6.37a1 1 0 0 0 0 -1.41l-4.19 -4.24a1 1 0 0 0 -1.41 0l-6.42 6.36a4 4 0 0 0 0 5.66a4 4 0 0 0 5.66 0" />
  </Svg>
);
export default SvgEarphoneBluetooth;
