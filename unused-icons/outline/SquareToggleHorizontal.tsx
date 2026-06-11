import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSquareToggleHorizontal = (props: SvgProps) => (
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
    <Path d="M22 12h-20" />
    <Path d="M4 14v-8a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8" />
    <Path d="M18 20a2 2 0 0 0 2 -2" />
    <Path d="M4 18a2 2 0 0 0 2 2" />
    <Path d="M14 20l-4 0" />
  </Svg>
);
export default SvgSquareToggleHorizontal;
