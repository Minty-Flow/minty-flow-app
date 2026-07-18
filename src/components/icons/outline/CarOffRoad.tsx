import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCarOffRoad = (props: SvgProps) => (
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
    <Path d="M9 17h6" />
    <Path d="M9 17a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M19 17a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M17 10l-2 -3" />
    <Path d="M19 17h2v-5a2 2 0 0 0 -2 -2h-5v2h-2.586a1 1 0 0 1 -.707 -.293l-1.121 -1.121a2 2 0 0 0 -1.414 -.586h-4.172a1 1 0 0 0 -1 1v6h2" />
  </Svg>
);
export default SvgCarOffRoad;
