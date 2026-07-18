import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgBuildingEiffelTower = (props: SvgProps) => (
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
    <Path d="M11 4c0 4.889 -2.292 12.111 -5 17" />
    <Path d="M13 4c0 4.889 2.292 12.111 5 17" />
    <Path d="M3 21h18" />
    <Path d="M8 14h8" />
    <Path d="M9 10h6" />
    <Path d="M10 4h4" />
    <Path d="M12 2v1.778" />
    <Path d="M10 21s.27 -1.406 .667 -2c.333 -.5 .666 -1 1.333 -1s1 .5 1.333 1c.448 .672 .667 2 .667 2" />
  </Svg>
);
export default SvgBuildingEiffelTower;
