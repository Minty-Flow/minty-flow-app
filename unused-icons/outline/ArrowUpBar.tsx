import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpBar = (props: SvgProps) => (
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
    <Path d="M12 21l0 -18" />
    <Path d="M15 6l-3 -3l-3 3" />
    <Path d="M9 21l6 0" />
  </Svg>
);
export default SvgArrowUpBar;
