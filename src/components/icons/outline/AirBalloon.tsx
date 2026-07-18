import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgAirBalloon = (props: SvgProps) => (
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
    <Path d="M9 21v-3h6v3a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1" />
    <Path d="M9 18c-2.347 -2.169 -5 -5.226 -5 -8a8 8 0 1 1 16 0c0 2.774 -2.653 5.831 -5 8" />
    <Path d="M5.5 14h13" />
    <Path d="M10 14c-1.69 -4.712 -.924 -8.197 0 -11.602" />
    <Path d="M14 14c1.469 -3.867 1.19 -7.735 0 -11.602" />
  </Svg>
);
export default SvgAirBalloon;
