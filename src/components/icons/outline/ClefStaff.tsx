import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgClefStaff = (props: SvgProps) => (
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
    <Path d="M15 15h6" />
    <Path d="M15 11h6" />
    <Path d="M11 19h10" />
    <Path d="M11 12a4.16 4.16 0 0 1 -5.62 3.89a3.78 3.78 0 0 1 -2.38 -3.39a3.42 3.42 0 0 1 2.34 -3.38l3.79 -1.42a2.89 2.89 0 0 0 1.87 -2.7a2 2 0 0 0 -2 -2a2 2 0 0 0 -2 2v14a2 2 0 0 1 -2 2a2 2 0 0 1 -2 -2" />
  </Svg>
);
export default SvgClefStaff;
