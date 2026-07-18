import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgIceberg = (props: SvgProps) => (
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
    <Path d="M19 10l-2 9l-4 3l-3 -5l-3 -1l-2 -6l2 -5l3 -2l3 3l4 1l2 3" />
    <Path d="M3 10h18" />
  </Svg>
);
export default SvgIceberg;
