import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgPlayHandball = (props: SvgProps) => (
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
    <Path d="M13 21l3.5 -2l-4.5 -4l2 -4.5" />
    <Path d="M5 7l4 3l5 .5l4 2.5l2.5 3" />
    <Path d="M4 20l5 -1l1.5 -2" />
    <Path d="M13.007 8a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6.007 3.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
  </Svg>
);
export default SvgPlayHandball;
