import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgJetski = (props: SvgProps) => (
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
    <Path d="M10 5h1.4a1 1 0 0 1 .882 .53l1.718 3.22" />
    <Path d="M3.485 16.94l.136 .545a2 2 0 0 0 1.94 1.515h7.439a10 10 0 0 0 8 -4c0 -6 -5 -8 -5 -8c-1.889 2.518 -5.852 4 -9 4h-2a2 2 0 0 0 -2 2c0 1.328 .163 2.652 .485 3.94" />
    <Path d="M3.25 15h17.75" />
  </Svg>
);
export default SvgJetski;
