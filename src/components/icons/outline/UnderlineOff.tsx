import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgUnderlineOff = (props: SvgProps) => (
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
    <Path d="M7 7.4v2.6c0 2.8 2.2 5 5 5c.9 0 1.8 -.2 2.4 -.6" />
    <Path d="M5 19h14" />
    <Path d="M3 2.7l18 18" />
    <Path d="M16.4 12.4c.4 -.7 .6 -1.5 .6 -2.4v-5" />
  </Svg>
);
export default SvgUnderlineOff;
