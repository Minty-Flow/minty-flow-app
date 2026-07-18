import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTabClose = (props: SvgProps) => (
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
    <Path d="M3 21v-1a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v1" />
    <Path d="M6 15a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2" />
    <Path d="M15 6l-3 3l-3 -3" />
    <Path d="M12 9v-6" />
  </Svg>
);
export default SvgTabClose;
