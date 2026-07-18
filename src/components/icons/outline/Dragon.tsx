import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgDragon = (props: SvgProps) => (
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
    <Path d="M10.706 8.849l-5.706 -3.301l-2 6.452l3.5 -1.973l.5 2.973l3.555 -1.385" />
    <Path d="M15 9c0 3.5 4 3 4 7c0 3 -3 5 -5.5 5s-6 -.5 -6.5 -5c2 2 6.592 3.043 7.5 1c1.094 -2.461 -4 -3.459 -4 -6.5c0 -2.062 .5 -2.5 1.8 -3.2" />
    <Path d="M18 6a3 3 270 1 0 -3 3h5l1 -3h-3" />
    <Path d="M15 3h-8l5 3" />
  </Svg>
);
export default SvgDragon;
