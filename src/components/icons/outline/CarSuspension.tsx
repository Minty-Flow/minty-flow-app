import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCarSuspension = (props: SvgProps) => (
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
    <Path d="M12 22a3 3 0 1 1 0 -6a3 3 0 0 1 0 6" />
    <Path d="M12 16v-12" />
    <Path d="M13 2h-2v2h2v-2" />
    <Path d="M9 11l6 -1" />
    <Path d="M9 14l6 -1" />
    <Path d="M9 8l6 -1" />
  </Svg>
);
export default SvgCarSuspension;
