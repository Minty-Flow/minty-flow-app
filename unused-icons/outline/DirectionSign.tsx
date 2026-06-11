import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDirectionSign = (props: SvgProps) => (
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
    <Path d="M3.32 12.774l7.906 7.905c.427 .428 1.12 .428 1.548 0l7.905 -7.905a1.095 1.095 0 0 0 0 -1.548l-7.905 -7.905a1.095 1.095 0 0 0 -1.548 0l-7.905 7.905a1.095 1.095 0 0 0 0 1.548" />
    <Path d="M8 12h7.5" />
    <Path d="M12 8.5l3.5 3.5l-3.5 3.5" />
  </Svg>
);
export default SvgDirectionSign;
