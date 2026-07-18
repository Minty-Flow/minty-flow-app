import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTextOutline = (props: SvgProps) => (
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
    <Path d="M3 8v-1a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v1" />
    <Path d="M3 16v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-1" />
    <Path d="M21.01 12h.01" />
    <Path d="M3.01 12h.01" />
    <Path d="M10 15v-4a2 2 0 1 1 4 0v4" />
    <Path d="M10 13h4" />
  </Svg>
);
export default SvgTextOutline;
