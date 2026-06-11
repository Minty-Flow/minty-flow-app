import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandLinktree = (props: SvgProps) => (
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
    <Path d="M4 10h16" />
    <Path d="M6.5 4.5l11 11" />
    <Path d="M6.5 15.5l11 -11" />
    <Path d="M12 10v-8" />
    <Path d="M12 15v7" />
  </Svg>
);
export default SvgBrandLinktree;
