import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgHulaHoop = (props: SvgProps) => (
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
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 6l2 1.5l6 .5l6 -.5l2 -1.5" />
    <Path d="M16 21l-4 -8v-5" />
    <Path d="M8 21l4 -8" />
    <Path d="M9.007 10.999c-2.37 .32 -4.007 1.201 -4.007 2.001c0 1.105 3.134 2 7 2s7 -.895 7 -2c0 -.798 -1.636 -1.679 -4 -2" />
  </Svg>
);
export default SvgHulaHoop;
