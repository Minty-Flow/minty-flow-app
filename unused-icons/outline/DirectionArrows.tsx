import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDirectionArrows = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <Path d="M8 11l-1 1l1 1" />
    <Path d="M11 8l1 -1l1 1" />
    <Path d="M16 11l1 1l-1 1" />
    <Path d="M11 16l1 1l1 -1" />
  </Svg>
);
export default SvgDirectionArrows;
