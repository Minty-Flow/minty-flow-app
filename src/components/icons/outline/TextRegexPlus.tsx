import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTextRegexPlus = (props: SvgProps) => (
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
    <Path d="M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1" />
    <Path d="M7 16v-3a2 2 0 1 0 -4 0v1a2 2 0 0 0 3.726 1.01" />
    <Path d="M17 13h4" />
    <Path d="M19 11v4" />
  </Svg>
);
export default SvgTextRegexPlus;
