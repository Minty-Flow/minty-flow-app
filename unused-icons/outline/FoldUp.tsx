import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFoldUp = (props: SvgProps) => (
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
    <Path d="M12 13v-8l-3 3m6 0l-3 -3" />
    <Path d="M9 17l1 0" />
    <Path d="M14 17l1 0" />
    <Path d="M19 17l1 0" />
    <Path d="M4 17l1 0" />
  </Svg>
);
export default SvgFoldUp;
