import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgSegway = (props: SvgProps) => (
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
    <Path d="M11 3h3q -2.25 5 .75 11" />
    <Path d="M8 17a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M12 17.01v.01" />
  </Svg>
);
export default SvgSegway;
