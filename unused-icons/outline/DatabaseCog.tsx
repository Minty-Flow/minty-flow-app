import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDatabaseCog = (props: SvgProps) => (
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
    <Path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
    <Path d="M4 6v6c0 1.657 3.582 3 8 3c.21 0 .42 -.003 .626 -.01" />
    <Path d="M20 11.5v-5.5" />
    <Path d="M4 12v6c0 1.657 3.582 3 8 3" />
    <Path d="M17.001 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19.001 15.5v1.5" />
    <Path d="M19.001 21v1.5" />
    <Path d="M22.032 17.25l-1.299 .75" />
    <Path d="M17.27 20l-1.3 .75" />
    <Path d="M15.97 17.25l1.3 .75" />
    <Path d="M20.733 20l1.3 .75" />
  </Svg>
);
export default SvgDatabaseCog;
