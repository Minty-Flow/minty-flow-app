import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgKarate = (props: SvgProps) => (
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
    <Path d="M3 9l4.5 1l3 2.5" />
    <Path d="M13 21v-8l3 -5.5" />
    <Path d="M8 4.5l4 2l4 1l4 3.5l-2 3.5" />
    <Path d="M15.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgKarate;
