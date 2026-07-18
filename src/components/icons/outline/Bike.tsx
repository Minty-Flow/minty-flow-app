import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgBike = (props: SvgProps) => (
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
    <Path d="M2 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M16 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M12 19v-4l-3 -3l5 -4l2 3h3" />
    <Path d="M13.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgBike;
