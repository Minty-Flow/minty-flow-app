import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgUnicycle = (props: SvgProps) => (
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
    <Path d="M7 16a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M12 16v-11" />
    <Path d="M8 3q 2 2 7 2" />
  </Svg>
);
export default SvgUnicycle;
