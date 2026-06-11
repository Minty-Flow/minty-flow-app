import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
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
    <Path d="M12 9a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M5 8l3 4l4.5 1l7.5 -1" />
    <Path d="M3 18.75a2.4 2.4 0 0 0 1 .25a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 1 -.25" />
    <Path d="M12 16l.5 -3" />
    <Path d="M6.5 5a.5 .5 0 1 0 0 -1a.5 .5 0 0 0 0 1" fill="currentColor" />
  </Svg>
);
export default SvgWaterpolo;
