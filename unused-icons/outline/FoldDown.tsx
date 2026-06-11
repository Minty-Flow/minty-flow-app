import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFoldDown = (props: SvgProps) => (
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
    <Path d="M12 11v8l3 -3m-6 0l3 3" />
    <Path d="M9 7l1 0" />
    <Path d="M14 7l1 0" />
    <Path d="M19 7l1 0" />
    <Path d="M4 7l1 0" />
  </Svg>
);
export default SvgFoldDown;
