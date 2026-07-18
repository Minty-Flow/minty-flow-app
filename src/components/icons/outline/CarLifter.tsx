import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCarLifter = (props: SvgProps) => (
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
    <Path d="M7 21l10 -7l-10 -7" />
    <Path d="M17 7l-10 7l10 7" />
    <Path d="M20 7h-16a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1" />
    <Path d="M3 21h18" />
  </Svg>
);
export default SvgCarLifter;
