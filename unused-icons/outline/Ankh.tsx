import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAnkh = (props: SvgProps) => (
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
    <Path d="M6 13h12" />
    <Path d="M12 21v-8l-.422 -.211a6.472 6.472 0 0 1 -3.578 -5.789a4 4 0 1 1 8 0a6.472 6.472 0 0 1 -3.578 5.789l-.422 .211" />
  </Svg>
);
export default SvgAnkh;
