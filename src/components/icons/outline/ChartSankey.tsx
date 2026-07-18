import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgChartSankey = (props: SvgProps) => (
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
    <Path d="M4 6c6.944 0 9.056 8 16 8" />
    <Path d="M4 12c6.37 0 9.63 6 16 6" />
    <Path d="M20 6c-7.526 0 -7.905 12 -16 12" />
  </Svg>
);
export default SvgChartSankey;
