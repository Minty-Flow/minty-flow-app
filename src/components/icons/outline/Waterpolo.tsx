import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgWaterpolo = (props: SvgProps) => (
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
    <Path d="M5 8l3 4l5 1l7 -1" />
    <Path d="M3 18.75a2.4 2.4 0 0 0 1 .25a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 1 -.25" />
    <Path d="M12 16l1 -3" />
    <Path d="M11.007 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5.007 3.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
  </Svg>
);
export default SvgWaterpolo;
