import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArticle = (props: SvgProps) => (
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
    <Path d="M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12" />
    <Path d="M7 8h10" />
    <Path d="M7 12h10" />
    <Path d="M7 16h10" />
  </Svg>
);
export default SvgArticle;
