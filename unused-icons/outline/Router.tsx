import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRouter = (props: SvgProps) => (
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
    <Path d="M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
    <Path d="M17 17l0 .01" />
    <Path d="M13 17l0 .01" />
    <Path d="M15 13l0 -2" />
    <Path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
    <Path d="M8.5 6.5a8 8 0 0 1 13 0" />
  </Svg>
);
export default SvgRouter;
