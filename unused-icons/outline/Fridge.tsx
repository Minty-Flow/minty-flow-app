import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFridge = (props: SvgProps) => (
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
    <Path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M5 10h14" />
    <Path d="M9 13v3" />
    <Path d="M9 6v1" />
  </Svg>
);
export default SvgFridge;
