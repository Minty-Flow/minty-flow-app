import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTarget2 = (props: SvgProps) => (
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
    <Path d="M17 21l-1.74 -6" />
    <Path d="M7 21l1.74 -6" />
    <Path d="M12 4v-1" />
    <Path d="M14 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M18 10a6 6 0 1 0 -12 0a6 6 0 0 0 12 0" />
  </Svg>
);
export default SvgTarget2;
