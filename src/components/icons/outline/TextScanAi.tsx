import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTextScanAi = (props: SvgProps) => (
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
    <Path d="M8 12h4.5" />
    <Path d="M8 8h6" />
    <Path d="M8 16h2" />
    <Path d="M3 7v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M3 17v2a2 2 0 0 0 2 2h2" />
    <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <Path d="M14 21v-4a2 2 0 1 1 4 0v4" />
    <Path d="M14 19h4" />
    <Path d="M21 15v6" />
  </Svg>
);
export default SvgTextScanAi;
